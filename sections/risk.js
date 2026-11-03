/**
 * Supplier risk section. Works out each supplier's impact tier, tightest stock
 * margin, weekly revenue at risk, level and reason from window.LAUREL_RIDGE, then
 * draws headline numbers, the ranked supplier table and the stock gap panel into
 * <div id="risk">. Other sections can reuse the numbers through window.LaurelRidgeRisk.
 */
(function () {
  const BOX_ID = "risk";
  const STYLE_ID = "risk-styles";
  const MS_PER_DAY = 86400000;
  const DAYS_PER_WEEK = 7;
  const ONLY_SOURCE_YES = "Yes";
  const THIN_MARGIN_DAYS = 14;
  const TIER_STOPS_ALL = 1;
  const TIER_STOPS_SOME = 2;
  const TIER_HAS_BACKUP = 3;
  const LEVEL_NORMAL = "Normal";
  const LEVEL_WATCH = "Watch";

  const TIER_LABELS = {
    [TIER_STOPS_ALL]: "Stops every bike, no other source",
    [TIER_STOPS_SOME]: "Stops some bikes, no other source",
    [TIER_HAS_BACKUP]: "Another source is approved",
  };

  const LEVEL_ICONS = { [LEVEL_NORMAL]: "●", [LEVEL_WATCH]: "▲" };

  const STYLES = `
    .frame-box p.risk-lead { margin: 0 0 16px; color: var(--muted); max-width: 820px; }
    .risk-tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 24px; }
    .risk-tile { border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }
    .risk-tile-label { font-size: 13px; font-weight: 600; color: var(--muted); }
    .risk-tile-value { font-size: 28px; font-weight: 700; line-height: 1.25; font-variant-numeric: tabular-nums; }
    .risk-tile-note { font-size: 13px; color: var(--muted); }
    .frame-box h3.risk-heading { font-size: 17px; margin: 28px 0 4px; }
    .risk-table-wrap { overflow-x: auto; }
    .risk-table { width: 100%; min-width: 760px; border-collapse: collapse; font-size: 15px; }
    .risk-table th { text-align: left; font-size: 13px; font-weight: 600; color: var(--muted); padding: 8px 10px; border-bottom: 1px solid var(--line); white-space: nowrap; }
    .risk-table td { padding: 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
    .risk-table tr:last-child td { border-bottom: none; }
    .risk-table .risk-num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .risk-table th.risk-tier-row { padding-top: 18px; font-size: 14px; color: var(--ink); white-space: normal; }
    .risk-tier-note { font-weight: 400; color: var(--muted); }
    .risk-supplier { font-weight: 600; min-width: 170px; }
    .risk-place { display: block; font-size: 13px; font-weight: 400; color: var(--muted); }
    .risk-short { font-weight: 700; }
    .risk-level { display: inline-block; white-space: nowrap; font-size: 13px; font-weight: 600; padding: 2px 8px; border-radius: 999px; }
    .risk-level-normal { padding-left: 0; }
    .risk-level-normal .risk-level-icon { color: #0ca30c; }
    .risk-why { min-width: 260px; }
    .risk-level-watch { background: #fab219; color: #0b0b0b; }
  `;

  /**
   * Converts a YYYY-MM-DD date into a UTC timestamp so day counts ignore time zones.
   * @param {string} isoDate Date in YYYY-MM-DD form.
   * @returns {number} Milliseconds since the epoch at midnight UTC.
   */
  function toUtcMs(isoDate) {
    return Date.parse(`${isoDate}T00:00:00Z`);
  }

  /**
   * Formats a UTC timestamp as a short date such as "Nov 23".
   * @param {number} utcMs Milliseconds since the epoch.
   * @returns {string} The short date.
   */
  function formatShortDate(utcMs) {
    return new Date(utcMs).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  }

  /**
   * Formats a dollar amount with no cents.
   * @param {number} amount Amount in US dollars.
   * @returns {string} The amount, such as "$448,000".
   */
  function formatUsd(amount) {
    return `$${amount.toLocaleString("en-US")}`;
  }

  /**
   * Makes data safe to place inside HTML.
   * @param {*} value Value to display.
   * @returns {string} The value with HTML special characters escaped.
   */
  function escapeHtml(value) {
    const replacements = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(value).replace(/[&<>"']/g, (ch) => replacements[ch]);
  }

  /**
   * Writes a day count with the right word.
   * @param {number} days Number of days, zero or more.
   * @returns {string} A phrase such as "1 day" or "13 days".
   */
  function formatDays(days) {
    return `${days} ${days === 1 ? "day" : "days"}`;
  }

  /**
   * Describes a margin in plain English.
   * @param {number} marginDays Days between run-out and next delivery; negative is a shortfall.
   * @returns {string} A phrase such as "15 days short" or "13 days spare".
   */
  function describeMargin(marginDays) {
    return `${formatDays(Math.abs(marginDays))} ${marginDays < 0 ? "short" : "spare"}`;
  }

  /**
   * Finds the part with the smallest margin.
   * @param {Object[]} parts Assessed parts.
   * @returns {?Object} The tightest part, or null if none has an open order.
   */
  function findTightestPart(parts) {
    return parts
      .filter((part) => part.marginDays !== null)
      .reduce((tightest, part) => (!tightest || part.marginDays < tightest.marginDays ? part : tightest), null);
  }

  /**
   * Adds up weekly revenue at retail price across products.
   * @param {Object[]} products Rows from products.
   * @returns {number} Weekly revenue in US dollars.
   */
  function sumWeeklyRevenue(products) {
    return products.reduce((total, product) => total + product.weekly_build_rate * product.retail_price_usd, 0);
  }

  /**
   * Works out when one part runs out and how that compares with its next delivery.
   * @param {Object} part Row from parts.
   * @param {Object} data The window.LAUREL_RIDGE data.
   * @returns {Object} The part with runOutMs, nextArrivalMs, marginDays and the models using it.
   * @throws {Error} If the part has no inventory row, since its stock can't be assessed.
   */
  function assessPart(part, data) {
    const stock = data.inventory.find((row) => row.part_number === part.part_number);
    if (!stock) {
      throw new Error(`No inventory row for ${part.part_number}`);
    }
    const runOutMs = toUtcMs(stock.as_of) + stock.weeks_of_cover * DAYS_PER_WEEK * MS_PER_DAY;
    const arrivals = data.openOrders
      .filter((order) => order.part_number === part.part_number)
      .map((order) => toUtcMs(order.promised_arrival_date));
    const nextArrivalMs = arrivals.length ? Math.min(...arrivals) : null;
    const marginDays = nextArrivalMs === null ? null : Math.floor((runOutMs - nextArrivalMs) / MS_PER_DAY);
    const productIds = data.bom
      .filter((row) => row.part_number === part.part_number)
      .map((row) => row.product_id);
    const models = data.products.filter((product) => productIds.includes(product.product_id));
    return { ...part, runOutMs, nextArrivalMs, marginDays, models };
  }

  /**
   * Explains a supplier's stock-based level, using our own data only.
   * @param {?Object} watchPart The part with no other source and a thin margin, if any.
   * @param {?Object} tightestPart The supplier's tightest part, if any.
   * @param {number} tier The supplier's impact tier.
   * @returns {string} A plain-English reason.
   */
  function describeStockReason(watchPart, tightestPart, tier) {
    if (watchPart && watchPart.marginDays < 0) {
      return `${watchPart.description} runs out ${formatShortDate(watchPart.runOutMs)}, ${formatDays(-watchPart.marginDays)} before its next delivery on ${formatShortDate(watchPart.nextArrivalMs)}.`;
    }
    if (watchPart) {
      return `${watchPart.description} has only ${formatDays(watchPart.marginDays)} spare if its ${formatShortDate(watchPart.nextArrivalMs)} delivery slips.`;
    }
    const opening = tier === TIER_HAS_BACKUP ? "Another source is approved." : "No stock concern in our data.";
    return tightestPart ? `${opening} ${tightestPart.description} has ${describeMargin(tightestPart.marginDays)}.` : opening;
  }

  /**
   * Assesses one supplier's production impact, stock position and level.
   * @param {Object} supplier Row from suppliers.
   * @param {Object} data The window.LAUREL_RIDGE data.
   * @returns {Object} The supplier with tier, revenueAtRisk, parts, tightestPart, level and reason.
   */
  function assessSupplier(supplier, data) {
    const parts = data.parts
      .filter((part) => part.supplier_id === supplier.supplier_id)
      .map((part) => assessPart(part, data));
    const onlySourceParts = parts.filter((part) => part.only_source === ONLY_SOURCE_YES);
    const stoppedModels = data.products.filter((product) =>
      onlySourceParts.some((part) => part.models.includes(product)));

    let tier = TIER_HAS_BACKUP;
    if (stoppedModels.length === data.products.length) {
      tier = TIER_STOPS_ALL;
    } else if (stoppedModels.length > 0) {
      tier = TIER_STOPS_SOME;
    }

    const tightestPart = findTightestPart(parts);
    const tightestOnlySource = findTightestPart(onlySourceParts);
    const watchPart = tightestOnlySource && tightestOnlySource.marginDays < THIN_MARGIN_DAYS ? tightestOnlySource : null;

    return {
      ...supplier,
      tier,
      revenueAtRisk: sumWeeklyRevenue(stoppedModels),
      parts,
      onlySourceParts,
      stoppedModels,
      tightestPart,
      level: watchPart ? LEVEL_WATCH : LEVEL_NORMAL,
      reason: describeStockReason(watchPart, tightestPart, tier),
    };
  }

  /**
   * Assesses every supplier and ranks them, highest production impact first.
   * @param {Object} data The window.LAUREL_RIDGE data.
   * @returns {Object[]} Suppliers by tier, then revenue at risk, then tightest margin.
   */
  function assessSuppliers(data) {
    const marginOf = (supplier) => (supplier.tightestPart ? supplier.tightestPart.marginDays : Infinity);
    return data.suppliers
      .map((supplier) => assessSupplier(supplier, data))
      .sort((a, b) => a.tier - b.tier || b.revenueAtRisk - a.revenueAtRisk || marginOf(a) - marginOf(b));
  }

  /**
   * Lists parts that run out before their next delivery, biggest shortfall first.
   * @param {Object[]} suppliers Assessed suppliers.
   * @returns {Object[]} Short parts, each with its supplier's name added.
   */
  function findStockGaps(suppliers) {
    return suppliers
      .flatMap((supplier) => supplier.parts.map((part) => ({ ...part, supplierName: supplier.supplier_name })))
      .filter((part) => part.marginDays !== null && part.marginDays < 0)
      .sort((a, b) => a.marginDays - b.marginDays);
  }

  /**
   * Builds the status label, which pairs an icon with text so it never relies on color alone.
   * @param {string} level The supplier's level.
   * @returns {string} The label's HTML.
   */
  function renderLevel(level) {
    return `<span class="risk-level risk-level-${level.toLowerCase()}"><span class="risk-level-icon" aria-hidden="true">${LEVEL_ICONS[level]}</span> ${escapeHtml(level)}</span>`;
  }

  /**
   * Builds one headline number.
   * @param {string} label What the number is.
   * @param {string} value The number.
   * @param {string} note Short context under the number.
   * @returns {string} The tile's HTML.
   */
  function renderTile(label, value, note) {
    return `<div class="risk-tile">
      <div class="risk-tile-label">${escapeHtml(label)}</div>
      <div class="risk-tile-value">${escapeHtml(value)}</div>
      <div class="risk-tile-note">${escapeHtml(note)}</div>
    </div>`;
  }

  /**
   * Builds the row of headline numbers.
   * @param {Object} data The window.LAUREL_RIDGE data.
   * @param {Object[]} suppliers Assessed suppliers.
   * @param {Object[]} gaps Parts that run out before their next delivery.
   * @returns {string} The tiles' HTML.
   */
  function renderTiles(data, suppliers, gaps) {
    const weeklyBikes = data.products.reduce((total, product) => total + product.weekly_build_rate, 0);
    const noBackup = suppliers.filter((supplier) => supplier.tier !== TIER_HAS_BACKUP).length;
    const firstGap = gaps.reduce((first, part) => (!first || part.runOutMs < first.runOutMs ? part : first), null);
    return `<div class="risk-tiles">
      ${renderTile("Weekly revenue at stake", formatUsd(sumWeeklyRevenue(data.products)), `${weeklyBikes} bikes a week, at retail price`)}
      ${renderTile("Suppliers with no backup", `${noBackup} of ${suppliers.length}`, "For at least one part")}
      ${renderTile("Parts short of next delivery", String(gaps.length), "Even if every order arrives on time")}
      ${firstGap ? renderTile("First part to run short", formatShortDate(firstGap.runOutMs), firstGap.description) : ""}
    </div>`;
  }

  /**
   * Builds one supplier row.
   * @param {Object} supplier An assessed supplier.
   * @returns {string} The row's HTML.
   */
  function renderSupplierRow(supplier) {
    const tight = supplier.tightestPart;
    const revenue = supplier.tier === TIER_HAS_BACKUP ? "Has backup" : formatUsd(supplier.revenueAtRisk);
    const marginClass = tight && tight.marginDays < 0 ? " risk-short" : "";
    return `<tr>
      <td class="risk-supplier">${escapeHtml(supplier.supplier_name)}
        <span class="risk-place">${escapeHtml(supplier.factory_city)}, ${escapeHtml(supplier.factory_country)}</span></td>
      <td>${renderLevel(supplier.level)}</td>
      <td class="risk-num">${escapeHtml(revenue)}</td>
      <td class="risk-num${marginClass}">${tight ? escapeHtml(describeMargin(tight.marginDays)) : "No open order"}</td>
      <td class="risk-why">${escapeHtml(supplier.reason)}</td>
    </tr>`;
  }

  /**
   * Builds the supplier table, grouped by impact tier.
   * @param {Object[]} suppliers Assessed suppliers, already ranked.
   * @returns {string} The table's HTML.
   */
  function renderSupplierTable(suppliers) {
    const groups = [TIER_STOPS_ALL, TIER_STOPS_SOME, TIER_HAS_BACKUP].map((tier) => {
      const rows = suppliers.filter((supplier) => supplier.tier === tier);
      if (!rows.length) {
        return "";
      }
      return `<tr><th colspan="5" scope="colgroup" class="risk-tier-row">Tier ${tier} <span class="risk-tier-note">· ${escapeHtml(TIER_LABELS[tier])}</span></th></tr>
        ${rows.map(renderSupplierRow).join("")}`;
    }).join("");
    return `<div class="risk-table-wrap"><table class="risk-table">
      <thead><tr><th>Supplier</th><th>Level</th><th class="risk-num">Weekly revenue at risk</th><th class="risk-num">Margin</th><th>Why</th></tr></thead>
      <tbody>${groups}</tbody>
    </table></div>`;
  }

  /**
   * Builds the stock gap panel.
   * @param {Object[]} gaps Parts that run out before their next delivery.
   * @param {number} productCount How many models we build.
   * @returns {string} The panel's HTML.
   */
  function renderStockGaps(gaps, productCount) {
    if (!gaps.length) {
      return `<h3 class="risk-heading">Known stock gaps</h3><p>No part runs out before its next delivery.</p>`;
    }
    const rows = gaps.map((part) => {
      const bikes = part.models.length === productCount
        ? "All three models"
        : part.models.map((model) => model.product_name).join(", ");
      return `<tr>
        <td class="risk-supplier">${escapeHtml(part.description)}<span class="risk-place">${escapeHtml(part.supplierName)}</span></td>
        <td>${escapeHtml(bikes)}</td>
        <td class="risk-num">${escapeHtml(formatUsd(sumWeeklyRevenue(part.models)))}</td>
        <td class="risk-num">${escapeHtml(formatShortDate(part.runOutMs))}</td>
        <td class="risk-num">${escapeHtml(formatShortDate(part.nextArrivalMs))}</td>
        <td class="risk-num risk-short">${escapeHtml(formatDays(-part.marginDays))}</td>
      </tr>`;
    }).join("");
    return `<h3 class="risk-heading">Known stock gaps</h3>
      <p class="risk-lead">These parts run out before their next delivery, based on our own stock and orders at normal production. They aren't reports of any event at these suppliers.</p>
      <div class="risk-table-wrap"><table class="risk-table">
        <thead><tr><th>Part</th><th>Bikes affected</th><th class="risk-num">Weekly revenue affected</th><th class="risk-num">Runs out</th><th class="risk-num">Next delivery</th><th class="risk-num">Short by</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`;
  }

  /**
   * Adds this section's styles to the page once.
   * @returns {void}
   */
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  /**
   * Draws the section into its box, if the box is on the page.
   * @param {Object} data The window.LAUREL_RIDGE data.
   * @returns {void}
   */
  function render(data) {
    const box = document.getElementById(BOX_ID);
    if (!box) {
      return;
    }
    injectStyles();
    const suppliers = assessSuppliers(data);
    const gaps = findStockGaps(suppliers);
    box.innerHTML = `
      <h2>Supplier risk</h2>
      <p class="risk-lead">Ranked by production impact. Levels use our stock and order data as of ${escapeHtml(formatShortDate(toUtcMs(data.asOf)))}. Outside warning signs aren't connected yet, so Normal doesn't yet mean nothing is happening at that supplier.</p>
      ${renderTiles(data, suppliers, gaps)}
      ${renderSupplierTable(suppliers)}
      ${renderStockGaps(gaps, data.products.length)}`;
  }

  window.LaurelRidgeRisk = { assessSuppliers, findStockGaps, describeMargin, formatShortDate, formatUsd, escapeHtml };

  if (window.LAUREL_RIDGE) {
    render(window.LAUREL_RIDGE);
  }
})();
