/**
 * Supplier risk section. Holds the scoring rules: each supplier's impact tier, stock
 * margin and revenue at risk come from window.LAUREL_RIDGE, and each warning in
 * window.LAUREL_RIDGE_WARNINGS goes through the four checks in our plan. Draws the
 * severity overview, ranked supplier table and stock gap panel into <div id="risk">.
 * Other sections reuse the results through window.LaurelRidgeRisk.
 */
(function () {
  const BOX_ID = "risk";
  const STYLE_ID = "risk-styles";
  const MS_PER_DAY = 86400000;
  const DAYS_PER_WEEK = 7;
  const ONLY_SOURCE_YES = "Yes";
  const THIN_MARGIN_DAYS = 14;
  const MAX_WARNING_AGE_DAYS = 7;
  const FUTURE_DATE_TOLERANCE_DAYS = 1;
  const MIN_INDEPENDENT_REPORTS = 2;
  const EARTHQUAKE_MIN_MAGNITUDE = 6;
  const EARTHQUAKE_MAX_DISTANCE_KM = 100;
  const STORM_ALERT_LEVELS = ["orange", "red", "severe", "extreme"];
  const METER_RANGE_DAYS = 35;
  const METER_MIN_FILL_PCT = 2;
  const METER_HALF_WIDTH_PCT = 50;
  const TIER_STOPS_ALL = 1;
  const TIER_STOPS_SOME = 2;
  const TIER_HAS_BACKUP = 3;
  const LEVEL_NORMAL = "Normal";
  const LEVEL_WATCH = "Watch";
  const LEVEL_ALERT = "Alert";
  const LEVELS_MOST_SEVERE_FIRST = [LEVEL_ALERT, LEVEL_WATCH, LEVEL_NORMAL];

  const TIER_LABELS = {
    [TIER_STOPS_ALL]: "Stops every bike, no other source",
    [TIER_STOPS_SOME]: "Stops some bikes, no other source",
    [TIER_HAS_BACKUP]: "Another source is approved",
  };

  const LEVEL_ICONS = { [LEVEL_ALERT]: "■", [LEVEL_WATCH]: "▲", [LEVEL_NORMAL]: "●" };

  const WARNING_KINDS = {
    earthquake: {
      assumedDelayDays: 14,
      meetsMinimum: (warning) => warning.magnitude >= EARTHQUAKE_MIN_MAGNITUDE && warning.distanceKm <= EARTHQUAKE_MAX_DISTANCE_KM,
    },
    storm: { assumedDelayDays: 7, meetsMinimum: (warning) => STORM_ALERT_LEVELS.includes(warning.alertLevel) },
    port: { assumedDelayDays: 7, meetsMinimum: () => true },
    strike: { assumedDelayDays: 14, meetsMinimum: () => true },
    fire: { assumedDelayDays: 30, meetsMinimum: () => true },
  };

  const STYLES = `
    :root { --risk-alert: #d03b3b; --risk-watch: #fab219; --risk-short: #ec835a; --risk-normal: #0ca30c; --risk-neutral: #c3c2b7; }
    .frame-box p.risk-lead { margin: 0 0 16px; color: var(--muted); max-width: 820px; }
    .frame-box p.risk-test-note { margin: 0 0 16px; padding: 8px 12px; border: 1px dashed var(--muted); border-radius: 8px; color: var(--ink); font-size: 14px; font-weight: 600; }
    .risk-glance { margin-bottom: 20px; }
    .risk-glance-bar { display: flex; gap: 2px; height: 12px; margin: 6px 0 8px; }
    .risk-glance-segment { min-width: 8px; border-radius: 4px; }
    .risk-glance-alert { background: var(--risk-alert); }
    .risk-glance-watch { background: var(--risk-watch); }
    .risk-glance-normal { background: var(--risk-normal); }
    .risk-glance-title { font-size: 13px; font-weight: 600; color: var(--muted); }
    .risk-glance-legend { display: flex; flex-wrap: wrap; gap: 6px 20px; font-size: 15px; }
    .risk-glance-count { font-weight: 700; font-variant-numeric: tabular-nums; }
    .risk-icon-alert { color: var(--risk-alert); }
    .risk-icon-watch { color: var(--risk-watch); }
    .risk-icon-normal { color: var(--risk-normal); }
    .risk-tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 24px; }
    .risk-tile { border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }
    .risk-tile-label { font-size: 13px; font-weight: 600; color: var(--muted); }
    .risk-tile-value { font-size: 28px; font-weight: 700; line-height: 1.25; font-variant-numeric: tabular-nums; }
    .risk-tile-note { font-size: 13px; color: var(--muted); }
    .frame-box h3.risk-heading { font-size: 17px; margin: 28px 0 4px; }
    .frame-box p.risk-table-note { margin: 0 0 4px; font-size: 13px; }
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
    .risk-row-alert { background: #fdeeee; }
    .risk-row-alert td:first-child { box-shadow: inset 4px 0 0 var(--risk-alert); }
    .risk-row-watch td:first-child { box-shadow: inset 4px 0 0 var(--risk-watch); }
    .risk-level { display: inline-block; white-space: nowrap; font-size: 13px; font-weight: 600; padding: 2px 8px; border-radius: 999px; }
    .risk-level-normal { padding-left: 0; }
    .risk-level-normal .risk-level-icon { color: var(--risk-normal); }
    .risk-level-watch { background: var(--risk-watch); color: #0b0b0b; }
    .risk-level-alert { background: var(--risk-alert); color: #ffffff; }
    .risk-why { min-width: 260px; }
    .risk-meter { position: relative; width: 110px; height: 6px; margin: 6px 0 0 auto; background: #efece4; border-radius: 3px; }
    .risk-meter::after { content: ""; position: absolute; left: 50%; top: -2px; width: 1px; height: 10px; background: var(--muted); }
    .risk-meter-fill { position: absolute; top: 0; height: 100%; border-radius: 3px; }
    .risk-meter-short { background: var(--risk-short); }
    .risk-meter-thin { background: var(--risk-watch); }
    .risk-meter-ok { background: var(--risk-neutral); }
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
   * Describes a part's margin as a full phrase.
   * @param {Object} part An assessed part with a margin.
   * @returns {string} A phrase such as "Wheelset is 1 day short" or "Saddle has 27 days spare".
   */
  function describePartMargin(part) {
    return `${part.description} ${part.marginDays < 0 ? "is" : "has"} ${describeMargin(part.marginDays)}`;
  }

  /**
   * Picks the more severe of two levels.
   * @param {string} first A level.
   * @param {string} second A level.
   * @returns {string} Whichever is more severe.
   */
  function moreSevere(first, second) {
    return LEVELS_MOST_SEVERE_FIRST.indexOf(first) <= LEVELS_MOST_SEVERE_FIRST.indexOf(second) ? first : second;
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
   * Explains a supplier's stock-based level, always labeled as our own data.
   * @param {?Object} watchPart The part with no other source and a thin margin, if any.
   * @param {?Object} tightestPart The supplier's tightest part, if any.
   * @param {number} tier The supplier's impact tier.
   * @returns {string} A plain-English reason.
   */
  function describeStockReason(watchPart, tightestPart, tier) {
    if (watchPart && watchPart.marginDays < 0) {
      return `Our data: ${watchPart.description} runs out ${formatShortDate(watchPart.runOutMs)}, ${formatDays(-watchPart.marginDays)} before its next delivery on ${formatShortDate(watchPart.nextArrivalMs)}.`;
    }
    if (watchPart) {
      return `Our data: ${watchPart.description} has only ${formatDays(watchPart.marginDays)} spare if its ${formatShortDate(watchPart.nextArrivalMs)} delivery slips.`;
    }
    const opening = tier === TIER_HAS_BACKUP ? "Another source is approved." : "No stock concern in our data.";
    return tightestPart ? `${opening} ${describePartMargin(tightestPart)}.` : opening;
  }

  /**
   * Assesses one supplier's production impact and stock position.
   * @param {Object} supplier Row from suppliers.
   * @param {Object} data The window.LAUREL_RIDGE data.
   * @returns {Object} The supplier with tier, revenue at risk, parts, decisionPart, level and reason.
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
      decisionPart: tightestOnlySource || tightestPart,
      level: watchPart ? LEVEL_WATCH : LEVEL_NORMAL,
      reason: describeStockReason(watchPart, tightestPart, tier),
    };
  }

  /**
   * Checks a warning has a source link and a usable date, which every warning must have.
   * @param {Object} warning A warning record.
   * @returns {boolean} True if it has at least one linked source and a valid date.
   */
  function hasSourceAndDate(warning) {
    const sources = warning.sources || [];
    return sources.length > 0 && sources.every((source) => Boolean(source.url)) && !Number.isNaN(toUtcMs(warning.date));
  }

  /**
   * Applies the four checks to one affected supplier.
   * @param {Object} supplier An assessed supplier.
   * @param {Object} facts What's known about the warning.
   * @param {boolean} facts.fresh Whether the warning is recent enough.
   * @param {boolean} facts.confirmed Whether it's official or has two independent reports.
   * @param {number} facts.assumedDelayDays The delay assumed for this kind of warning.
   * @returns {Object} The supplier, its level and a plain-English explanation.
   */
  function checkSupplier(supplier, { fresh, confirmed, assumedDelayDays }) {
    if (!fresh) {
      return { supplier, level: LEVEL_NORMAL, why: `Older than ${MAX_WARNING_AGE_DAYS} days.` };
    }
    if (!confirmed) {
      return supplier.tier === TIER_STOPS_ALL
        ? { supplier, level: LEVEL_WATCH, why: "Unconfirmed report about a Tier 1 supplier. Needs an official source or a second report." }
        : { supplier, level: LEVEL_NORMAL, why: "Unconfirmed report. Needs an official source or a second report." };
    }
    if (supplier.tier === TIER_HAS_BACKUP) {
      return { supplier, level: LEVEL_WATCH, why: "Confirmed, but another source is approved, so it doesn't trigger an email." };
    }
    const part = supplier.decisionPart;
    if (part && assumedDelayDays <= part.marginDays) {
      return { supplier, level: LEVEL_WATCH, why: `Confirmed, but the assumed ${assumedDelayDays}-day delay fits within ${formatDays(part.marginDays)} spare on ${part.description}.` };
    }
    const position = part ? describePartMargin(part) : "No delivery is on order";
    return { supplier, level: LEVEL_ALERT, why: `Confirmed, and the assumed ${assumedDelayDays}-day delay would reach the line. ${position}.` };
  }

  /**
   * Runs one warning through the filter and the four checks.
   * @param {Object} warning A warning record.
   * @param {Object[]} suppliers Assessed suppliers.
   * @param {number} nowMs The current time.
   * @returns {Object} The warning, its most severe level, whether it was ignored, why and each supplier's outcome.
   */
  function evaluateWarning(warning, suppliers, nowMs) {
    const rule = WARNING_KINDS[warning.kind];
    const ignore = (why) => ({ warning, level: LEVEL_NORMAL, ignored: true, why, outcomes: [] });
    if (!rule) {
      return ignore(`Unknown kind of warning: ${warning.kind}.`);
    }
    if (!hasSourceAndDate(warning)) {
      return ignore("No source link and date.");
    }
    if (!rule.meetsMinimum(warning)) {
      return ignore("Below our minimum for this kind of warning.");
    }
    const ageDays = (nowMs - toUtcMs(warning.date)) / MS_PER_DAY;
    const facts = {
      fresh: ageDays >= -FUTURE_DATE_TOLERANCE_DAYS && ageDays <= MAX_WARNING_AGE_DAYS,
      confirmed: warning.official === true || warning.sources.length >= MIN_INDEPENDENT_REPORTS,
      assumedDelayDays: rule.assumedDelayDays,
    };
    const affected = suppliers.filter((supplier) => (warning.supplierIds || []).includes(supplier.supplier_id));
    if (!affected.length) {
      return ignore("Doesn't touch a site, port or route we depend on.");
    }
    const outcomes = affected.map((supplier) => checkSupplier(supplier, facts));
    const level = outcomes.reduce((worst, outcome) => moreSevere(worst, outcome.level), LEVEL_NORMAL);
    const lead = outcomes.find((outcome) => outcome.level === level);
    return { warning, level, ignored: false, why: lead.why, outcomes };
  }

  /**
   * Scores every supplier and warning, then ranks suppliers by impact and severity.
   * @param {Object} data The window.LAUREL_RIDGE data.
   * @param {Object[]} [warnings] Warning records to check.
   * @param {number} [nowMs] The current time.
   * @returns {{suppliers: Object[], evaluations: Object[]}} Ranked suppliers and each warning's result.
   */
  function assessRisk(data, warnings = [], nowMs = Date.now()) {
    const assessed = data.suppliers.map((supplier) => assessSupplier(supplier, data));
    const evaluations = warnings.map((warning) => evaluateWarning(warning, assessed, nowMs));
    const suppliers = assessed.map((supplier) => {
      const raised = evaluations.flatMap((evaluation) => evaluation.outcomes
        .filter((outcome) => outcome.supplier === supplier && outcome.level !== LEVEL_NORMAL)
        .map((outcome) => ({ ...outcome, warning: evaluation.warning })));
      if (!raised.length) {
        return supplier;
      }
      const level = raised.reduce((worst, outcome) => moreSevere(worst, outcome.level), supplier.level);
      const warningReasons = raised.map((outcome) => `${outcome.warning.title}: ${outcome.why}`).join(" ");
      return { ...supplier, level, reason: `${warningReasons} ${supplier.reason}` };
    });
    const marginOf = (supplier) => (supplier.tightestPart ? supplier.tightestPart.marginDays : Infinity);
    const severityOf = (supplier) => LEVELS_MOST_SEVERE_FIRST.indexOf(supplier.level);
    suppliers.sort((a, b) => a.tier - b.tier || severityOf(a) - severityOf(b)
      || b.revenueAtRisk - a.revenueAtRisk || marginOf(a) - marginOf(b));
    return { suppliers, evaluations };
  }

  /**
   * Assesses every supplier against our own data only.
   * @param {Object} data The window.LAUREL_RIDGE data.
   * @returns {Object[]} Ranked suppliers.
   */
  function assessSuppliers(data) {
    return assessRisk(data).suppliers;
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
   * @param {string} level The level to show.
   * @returns {string} The label's HTML.
   */
  function renderLevel(level) {
    return `<span class="risk-level risk-level-${level.toLowerCase()}"><span class="risk-level-icon" aria-hidden="true">${LEVEL_ICONS[level]}</span> ${escapeHtml(level)}</span>`;
  }

  /**
   * Builds the bar and counts showing how many suppliers sit at each level.
   * @param {Object[]} suppliers Assessed suppliers.
   * @returns {string} The overview's HTML.
   */
  function renderGlance(suppliers) {
    const counts = LEVELS_MOST_SEVERE_FIRST.map((level) => ({
      level,
      count: suppliers.filter((supplier) => supplier.level === level).length,
    }));
    const summary = counts.map(({ level, count }) => `${level} ${count}`).join(", ");
    const segments = counts.filter(({ count }) => count > 0)
      .map(({ level, count }) => `<div class="risk-glance-segment risk-glance-${level.toLowerCase()}" style="flex-grow:${count}" title="${level}: ${count}"></div>`)
      .join("");
    const legend = counts.map(({ level, count }) => `<span><span class="risk-icon-${level.toLowerCase()}" aria-hidden="true">${LEVEL_ICONS[level]}</span> ${level} <span class="risk-glance-count">${count}</span></span>`)
      .join("");
    return `<div class="risk-glance">
      <div class="risk-glance-title">Severity across our ${suppliers.length} suppliers</div>
      <div class="risk-glance-bar" role="img" aria-label="${escapeHtml(summary)}">${segments}</div>
      <div class="risk-glance-legend">${legend}</div>
    </div>`;
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
   * Builds the small bar showing a margin either side of zero.
   * @param {number} marginDays Days between run-out and next delivery.
   * @returns {string} The meter's HTML; the margin text beside it carries the value.
   */
  function renderMarginMeter(marginDays) {
    const share = Math.min(Math.abs(marginDays) / METER_RANGE_DAYS, 1) * METER_HALF_WIDTH_PCT;
    const widthPct = Math.max(share, METER_MIN_FILL_PCT);
    const leftPct = marginDays < 0 ? METER_HALF_WIDTH_PCT - widthPct : METER_HALF_WIDTH_PCT;
    let tone = "ok";
    if (marginDays < 0) {
      tone = "short";
    } else if (marginDays < THIN_MARGIN_DAYS) {
      tone = "thin";
    }
    return `<div class="risk-meter" aria-hidden="true"><span class="risk-meter-fill risk-meter-${tone}" style="left:${leftPct}%;width:${widthPct}%"></span></div>`;
  }

  /**
   * Builds one supplier row, with a colored edge showing its severity.
   * @param {Object} supplier An assessed supplier.
   * @returns {string} The row's HTML.
   */
  function renderSupplierRow(supplier) {
    const tight = supplier.tightestPart;
    const revenue = supplier.tier === TIER_HAS_BACKUP ? "Has backup" : formatUsd(supplier.revenueAtRisk);
    const marginClass = tight && tight.marginDays < 0 ? " risk-short" : "";
    return `<tr class="risk-row-${supplier.level.toLowerCase()}">
      <td class="risk-supplier">${escapeHtml(supplier.supplier_name)}
        <span class="risk-place">${escapeHtml(supplier.factory_city)}, ${escapeHtml(supplier.factory_country)}</span></td>
      <td>${renderLevel(supplier.level)}</td>
      <td class="risk-num">${escapeHtml(revenue)}</td>
      <td class="risk-num${marginClass}">${tight ? `${escapeHtml(describeMargin(tight.marginDays))}${renderMarginMeter(tight.marginDays)}` : "No open order"}</td>
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
    return `<p class="risk-table-note">Margin bars: left of the center line means a part runs out before its next delivery.</p>
      <div class="risk-table-wrap"><table class="risk-table">
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
   * Reads the real warnings file, which may not be on the page.
   * @returns {{lastChecked: ?string, warnings: Object[]}} The real warnings.
   */
  function readRealWarnings() {
    return window.LAUREL_RIDGE_WARNINGS || { lastChecked: null, warnings: [] };
  }

  let testWarnings = [];

  /**
   * Scores the current data, including any test warnings that are switched on.
   * @returns {{suppliers: Object[], evaluations: Object[]}} The current result.
   */
  function currentRisk() {
    return assessRisk(window.LAUREL_RIDGE, [...readRealWarnings().warnings, ...testWarnings]);
  }

  /**
   * Draws the section into its box, if the box is on the page.
   * @returns {void}
   */
  function render() {
    const box = document.getElementById(BOX_ID);
    if (!box) {
      return;
    }
    injectStyles();
    const data = window.LAUREL_RIDGE;
    const { suppliers } = currentRisk();
    const gaps = findStockGaps(suppliers);
    const { lastChecked } = readRealWarnings();
    const warningStatus = lastChecked
      ? `Outside warning signs were last checked ${escapeHtml(formatShortDate(toUtcMs(lastChecked)))}.`
      : "Outside warning signs aren't connected yet, so Normal doesn't yet mean nothing is happening at that supplier.";
    box.innerHTML = `
      <h2>Supplier risk</h2>
      <p class="risk-lead">Ranked by production impact. Our stock and order data is as of ${escapeHtml(formatShortDate(toUtcMs(data.asOf)))}. ${warningStatus}</p>
      ${testWarnings.length ? `<p class="risk-test-note">TEST MODE: Cataloochee Cell Works is showing fictional test warnings.</p>` : ""}
      ${renderGlance(suppliers)}
      ${renderTiles(data, suppliers, gaps)}
      ${renderSupplierTable(suppliers)}
      ${renderStockGaps(gaps, data.products.length)}`;
  }

  /**
   * Switches test warnings on or off and redraws this section.
   * @param {Object[]} warnings Test warnings to apply, or an empty list to clear them.
   * @returns {void}
   */
  function setTestWarnings(warnings) {
    testWarnings = warnings;
    render();
  }

  window.LaurelRidgeRisk = {
    LEVEL_ALERT,
    LEVEL_WATCH,
    LEVEL_NORMAL,
    assessRisk,
    assessSuppliers,
    currentRisk,
    describeMargin,
    escapeHtml,
    findStockGaps,
    formatDays,
    formatShortDate,
    formatUsd,
    injectStyles,
    readRealWarnings,
    renderLevel,
    setTestWarnings,
    sumWeeklyRevenue,
    toUtcMs,
  };

  if (window.LAUREL_RIDGE) {
    render();
  }
})();
