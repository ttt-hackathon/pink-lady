/**
 * Supplier risk section. Works out each supplier's impact tier, tightest stock
 * margin and weekly revenue at risk from window.LAUREL_RIDGE, then draws the
 * ranked result into <div id="risk">. Other sections can reuse the numbers through
 * window.LaurelRidgeRisk.
 */
(function () {
  const BOX_ID = "risk";
  const STYLE_ID = "risk-styles";
  const MS_PER_DAY = 86400000;
  const DAYS_PER_WEEK = 7;
  const ONLY_SOURCE_YES = "Yes";
  const TIER_STOPS_ALL = 1;
  const TIER_STOPS_SOME = 2;
  const TIER_HAS_BACKUP = 3;

  const TIER_LABELS = {
    [TIER_STOPS_ALL]: "Stops every bike, no other source",
    [TIER_STOPS_SOME]: "Stops some bikes, no other source",
    [TIER_HAS_BACKUP]: "Another source is approved",
  };

  const STYLES = `
    .risk-lead { margin: 0 0 14px; color: var(--muted); }
    .risk-table-wrap { overflow-x: auto; }
    .risk-table { width: 100%; border-collapse: collapse; font-size: 15px; }
    .risk-table th { text-align: left; font-size: 13px; font-weight: 600; color: var(--muted); padding: 8px 10px; border-bottom: 1px solid var(--line); white-space: nowrap; }
    .risk-table td { padding: 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
    .risk-table tr:last-child td { border-bottom: none; }
    .risk-table .risk-num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .risk-supplier { font-weight: 600; }
    .risk-place { display: block; font-size: 13px; font-weight: 400; color: var(--muted); }
    .risk-short { font-weight: 700; }
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
   * Describes a margin in plain English.
   * @param {number} marginDays Days between run-out and next delivery; negative is a shortfall.
   * @returns {string} A phrase such as "15 days short" or "13 days spare".
   */
  function describeMargin(marginDays) {
    const days = Math.abs(marginDays);
    const unit = days === 1 ? "day" : "days";
    return marginDays < 0 ? `${days} ${unit} short` : `${days} ${unit} spare`;
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
   * Works out one product's weekly revenue at retail price.
   * @param {Object} product Row from products.
   * @returns {number} Weekly revenue in US dollars.
   */
  function weeklyRevenue(product) {
    return product.weekly_build_rate * product.retail_price_usd;
  }

  /**
   * Assesses one supplier's production impact and stock position.
   * @param {Object} supplier Row from suppliers.
   * @param {Object} data The window.LAUREL_RIDGE data.
   * @returns {Object} The supplier with tier, revenueAtRisk, parts and tightestPart.
   */
  function assessSupplier(supplier, data) {
    const parts = data.parts
      .filter((part) => part.supplier_id === supplier.supplier_id)
      .map((part) => assessPart(part, data));
    const onlySourceParts = parts.filter((part) => part.only_source === ONLY_SOURCE_YES);
    const stoppedModels = data.products.filter((product) =>
      onlySourceParts.some((part) => part.models.includes(product)));
    const revenueAtRisk = stoppedModels.reduce((total, product) => total + weeklyRevenue(product), 0);

    let tier = TIER_HAS_BACKUP;
    if (stoppedModels.length === data.products.length) {
      tier = TIER_STOPS_ALL;
    } else if (stoppedModels.length > 0) {
      tier = TIER_STOPS_SOME;
    }

    const tightestPart = parts
      .filter((part) => part.marginDays !== null)
      .reduce((tightest, part) => (!tightest || part.marginDays < tightest.marginDays ? part : tightest), null);

    return { ...supplier, tier, revenueAtRisk, parts, onlySourceParts, stoppedModels, tightestPart };
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
   * Builds one ranked table row.
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
      <td>Tier ${supplier.tier}<span class="risk-place">${escapeHtml(TIER_LABELS[supplier.tier])}</span></td>
      <td class="risk-num">${escapeHtml(revenue)}</td>
      <td class="risk-num${marginClass}">${tight ? escapeHtml(describeMargin(tight.marginDays)) : "No open order"}</td>
      <td>${tight ? escapeHtml(tight.description) : ""}</td>
    </tr>`;
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
    box.innerHTML = `
      <h2>Supplier risk</h2>
      <p class="risk-lead">Ranked by production impact, using our stock and order data as of ${escapeHtml(formatShortDate(toUtcMs(data.asOf)))}. Outside warning signs aren't connected yet.</p>
      <div class="risk-table-wrap">
        <table class="risk-table">
          <thead><tr><th>Supplier</th><th>Impact</th><th class="risk-num">Weekly revenue at risk</th><th class="risk-num">Margin</th><th>Tightest part</th></tr></thead>
          <tbody>${assessSuppliers(data).map(renderSupplierRow).join("")}</tbody>
        </table>
      </div>`;
  }

  window.LaurelRidgeRisk = { assessSuppliers, describeMargin, formatShortDate, formatUsd, escapeHtml };

  if (window.LAUREL_RIDGE) {
    render(window.LAUREL_RIDGE);
  }
})();
