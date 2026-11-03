/**
 * Alerts section. Shows a banner and a ready-to-send email for each warning that
 * passes all four checks, with one email per event. Also holds the Cataloochee test,
 * whose fictional warnings exist only in this file and never touch the real list.
 */
(function () {
  const BOX_ID = "alerts";
  const STYLE_ID = "alerts-styles";
  const COPIED_MESSAGE_MS = 2500;
  const TEST_SUPPLIER_ID = "S01";
  const ISO_DATE_LENGTH = 10;
  const DASHBOARD_URL = "https://ttt-hackathon.github.io/pink-lady/";

  const FALLBACK_ACTIONS = [
    "Call the supplier today to confirm what has happened and whether our open orders are affected.",
    "Ask for a written recovery date.",
    "Review remaining stock and decide which bikes to build first.",
  ];

  const ALERT_ACTIONS = {
    fire: [
      "Call the supplier today to confirm the damage and whether our open orders are affected.",
      "Ask for a written recovery date and any stock that can still ship from another site.",
      "Review remaining stock, decide which bikes to build first, and start looking for another source.",
    ],
    earthquake: [
      "Call the supplier today to confirm the site is running and our open orders are safe.",
      "Ask for a written recovery date if production has stopped.",
      "Review remaining stock and price faster shipping for the next order.",
    ],
    storm: [
      "Ask the supplier and our freight forwarder whether our open orders will be delayed.",
      "Get a new arrival date for every order on this route.",
      "Review remaining stock and price faster shipping if the new date falls after our run-out date.",
    ],
    port: [
      "Ask our freight forwarder where our orders are and get new arrival dates.",
      "Price moving the next shipment through another port or by air.",
      "Review remaining stock and decide which bikes to build first.",
    ],
    strike: [
      "Ask the supplier how the strike affects our open orders and how long it may last.",
      "Ask whether any finished parts can ship early.",
      "Review remaining stock and price faster shipping or a temporary backup source.",
    ],
  };

  const STYLES = `
    .alerts-status { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; justify-content: space-between; }
    .frame-box p.alerts-status-text { margin: 0; max-width: 720px; }
    .alerts-count { font-size: 14px; color: var(--muted); margin-top: 10px; font-variant-numeric: tabular-nums; }
    .alerts-button { font: inherit; font-size: 14px; font-weight: 600; padding: 7px 14px; border-radius: 8px; border: 1px solid var(--accent); background: var(--card); color: var(--accent); cursor: pointer; text-decoration: none; display: inline-block; }
    .alerts-button:hover { background: #e6f0ea; }
    .alerts-card { margin-top: 16px; border: 1px solid var(--line); border-left: 6px solid var(--risk-alert); border-radius: 10px; background: #fdeeee; padding: 16px 18px; }
    .alerts-card-title { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font-size: 18px; font-weight: 700; margin-bottom: 12px; }
    .alerts-facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(400px, 100%), 1fr)); gap: 12px 20px; }
    .alerts-fact-label { font-size: 13px; font-weight: 600; color: var(--muted); }
    .frame-box p.alerts-fact-text { margin: 0; color: var(--ink); font-size: 15px; }
    .alerts-steps { margin: 0; padding-left: 20px; font-size: 15px; }
    .alerts-email { margin-top: 14px; background: var(--card); border: 1px solid var(--line); border-radius: 8px; padding: 12px 14px; }
    .alerts-email-text { margin: 8px 0 12px; white-space: pre-wrap; overflow-wrap: anywhere; font: 14px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; max-height: 280px; overflow-y: auto; }
    .alerts-email summary { font-weight: 600; cursor: pointer; }
    .alerts-email-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
    .alerts-copied { font-size: 14px; font-weight: 600; color: var(--accent); }
    .alerts-test { margin-top: 16px; border: 1px dashed var(--muted); border-radius: 10px; padding: 12px 14px; overflow-x: auto; }
    .alerts-test-title { font-weight: 700; margin-bottom: 4px; }
    .alerts-test-table { width: 100%; min-width: 560px; border-collapse: collapse; font-size: 14px; margin-top: 8px; }
    .alerts-test-table th { text-align: left; font-size: 13px; color: var(--muted); padding: 6px 8px; border-bottom: 1px solid var(--line); }
    .alerts-test-table td { padding: 8px; vertical-align: top; border-bottom: 1px solid var(--line); }
    .alerts-test-table tr:last-child td { border-bottom: none; }
    .alerts-ignored { font-size: 13px; font-weight: 600; color: var(--muted); white-space: nowrap; }
  `;

  /**
   * Builds the fictional Cataloochee warnings: one too minor to count, one unconfirmed
   * and one confirmed. All are dated today so they pass the age check.
   * @param {Object} data The window.LAUREL_RIDGE data.
   * @returns {Object[]} The test warnings.
   */
  function buildTestWarnings(data) {
    const site = data.suppliers.find((supplier) => supplier.supplier_id === TEST_SUPPLIER_ID);
    const today = new Date().toISOString().slice(0, ISO_DATE_LENGTH);
    const sources = [{ name: "Cataloochee Cell Works (fictional)", url: site.website }];
    const shared = { date: today, sources, supplierIds: [TEST_SUPPLIER_ID], isTest: true };
    return [
      { ...shared, id: "test-minor", kind: "earthquake", official: true, magnitude: 4.2, distanceKm: 20, title: "TEST: Small earthquake near Waynesville", summary: "Fictional test: a magnitude 4.2 earthquake near Cataloochee's plant, with no reported damage." },
      { ...shared, id: "test-unconfirmed", kind: "strike", official: false, title: "TEST: Unconfirmed strike rumor at Cataloochee", summary: "Fictional test: one unconfirmed report of a possible strike at Cataloochee's plant." },
      { ...shared, id: "test-confirmed", kind: "fire", official: true, title: "TEST: Fire at Cataloochee's main plant", summary: "Fictional test: Cataloochee confirms a fire has stopped battery pack production at its Waynesville plant." },
    ];
  }

  /**
   * Gathers what an alert email needs from the suppliers an event puts on alert.
   * @param {Object} evaluation A warning's result from the risk section.
   * @returns {Object} Supplier names, parts, models, revenue at risk and stock lines.
   */
  function summarizeImpact(evaluation) {
    const risk = window.LaurelRidgeRisk;
    const suppliers = evaluation.outcomes
      .filter((outcome) => outcome.level === risk.LEVEL_ALERT)
      .map((outcome) => outcome.supplier);
    const models = [...new Set(suppliers.flatMap((supplier) => supplier.stoppedModels))];
    const parts = suppliers.flatMap((supplier) => supplier.onlySourceParts);
    const stockLines = suppliers
      .filter((supplier) => supplier.decisionPart)
      .map(({ decisionPart: part }) => {
        const nextDelivery = part.nextArrivalMs === null ? "no delivery on order" : `next delivery ${risk.formatShortDate(part.nextArrivalMs)}`;
        const margin = part.marginDays === null ? "" : `, ${risk.describeMargin(part.marginDays)}`;
        return `${part.description}: stock runs out ${risk.formatShortDate(part.runOutMs)} at normal production (${nextDelivery}${margin}).`;
      });
    return {
      supplierNames: suppliers.map((supplier) => supplier.supplier_name).join(", "),
      partNames: parts.map((part) => part.description).join("; "),
      modelNames: models.map((model) => model.product_name).join(", "),
      revenue: risk.formatUsd(risk.sumWeeklyRevenue(models)),
      stockLines,
    };
  }

  /**
   * Finds the recommended next steps for a kind of warning.
   * @param {Object} warning A warning record.
   * @returns {string[]} The steps.
   */
  function actionsFor(warning) {
    return ALERT_ACTIONS[warning.kind] || FALLBACK_ACTIONS;
  }

  /**
   * Writes one event's ready-to-send email.
   * @param {Object} evaluation A warning's result from the risk section.
   * @returns {{subject: string, body: string}} The email.
   */
  function buildEmail(evaluation) {
    const risk = window.LaurelRidgeRisk;
    const { warning } = evaluation;
    const impact = summarizeImpact(evaluation);
    const sources = warning.sources.map((source) => `${source.name}: ${source.url}`).join("\n");
    const steps = actionsFor(warning).map((step, index) => `${index + 1}. ${step}`).join("\n");
    const lines = [
      ...(warning.isTest ? ["THIS IS A TEST. Cataloochee Cell Works is fictional and no action is needed.", ""] : []),
      "Purchasing team,",
      "",
      "WHAT HAPPENED",
      `${warning.title} (${risk.formatShortDate(risk.toUtcMs(warning.date))})`,
      warning.summary,
      sources,
      "",
      "WHAT IT AFFECTS",
      `Supplier: ${impact.supplierNames}`,
      `Parts: ${impact.partNames}`,
      `Bikes: ${impact.modelNames}`,
      `Weekly revenue at risk: ${impact.revenue} at retail price`,
      "",
      "HOW LONG WE HAVE",
      ...impact.stockLines,
      `Stock and order data as of ${risk.formatShortDate(risk.toUtcMs(window.LAUREL_RIDGE.asOf))}.`,
      "",
      "WHAT TO DO",
      steps,
      "",
      `Dashboard: ${DASHBOARD_URL}`,
    ];
    const prefix = warning.isTest ? "[TEST] " : "";
    return { subject: `${prefix}Supply alert: ${warning.title.replace(/^TEST: /, "")}`, body: lines.join("\n") };
  }

  /**
   * Builds one alert's banner, facts and email.
   * @param {Object} evaluation A warning's result from the risk section.
   * @param {number} index The alert's position, used to find its email when buttons are clicked.
   * @returns {string} The alert's HTML.
   */
  function renderAlertCard(evaluation, index) {
    const risk = window.LaurelRidgeRisk;
    const { warning } = evaluation;
    const safe = risk.escapeHtml;
    const impact = summarizeImpact(evaluation);
    const email = buildEmail(evaluation);
    const mailto = `mailto:?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
    const sourceLinks = warning.sources
      .map((source) => `<a href="${safe(source.url)}" target="_blank" rel="noopener">${safe(source.name)}</a>`)
      .join(", ");
    return `<div class="alerts-card">
      <div class="alerts-card-title">${risk.renderLevel(risk.LEVEL_ALERT)} ${safe(warning.title)}</div>
      <div class="alerts-facts">
        <div><div class="alerts-fact-label">What happened</div>
          <p class="alerts-fact-text">${safe(warning.summary)} Source: ${sourceLinks}, ${safe(risk.formatShortDate(risk.toUtcMs(warning.date)))}.</p></div>
        <div><div class="alerts-fact-label">What it affects</div>
          <p class="alerts-fact-text">${safe(impact.supplierNames)}: ${safe(impact.modelNames)}. <strong>${safe(impact.revenue)}</strong> a week at risk.</p></div>
        <div><div class="alerts-fact-label">How long we have</div>
          <p class="alerts-fact-text">${safe(impact.stockLines.join(" "))}</p></div>
        <div><div class="alerts-fact-label">What to do</div>
          <ol class="alerts-steps">${actionsFor(warning).map((step) => `<li>${safe(step)}</li>`).join("")}</ol></div>
      </div>
      <details class="alerts-email" open>
        <summary>Ready-to-send email</summary>
        <div class="alerts-email-text"><strong>Subject:</strong> ${safe(email.subject)}

${safe(email.body)}</div>
        <div class="alerts-email-actions">
          <button type="button" class="alerts-button" data-alerts-copy="${index}">Copy email</button>
          <a class="alerts-button" href="${safe(mailto)}">Open in email</a>
          <span class="alerts-copied" data-alerts-copied="${index}" role="status"></span>
        </div>
      </details>
    </div>`;
  }

  /**
   * Builds the count of warnings reviewed, ignored, on Watch and alerted.
   * @param {Object[]} evaluations Each warning's result.
   * @returns {string} The line's HTML.
   */
  function renderCounts(evaluations) {
    const risk = window.LaurelRidgeRisk;
    const count = (level) => evaluations.filter((evaluation) => evaluation.level === level).length;
    return `<div class="alerts-count">${evaluations.length} reviewed · ${count(risk.LEVEL_NORMAL)} no action · ${count(risk.LEVEL_WATCH)} on Watch · ${count(risk.LEVEL_ALERT)} alerted</div>`;
  }

  /**
   * Builds the test panel, showing how each fictional warning was handled.
   * @param {Object[]} testEvaluations Results for the test warnings, empty when the test is off.
   * @returns {string} The panel's HTML.
   */
  function renderTestPanel(testEvaluations) {
    const risk = window.LaurelRidgeRisk;
    const safe = risk.escapeHtml;
    if (!testEvaluations.length) {
      return `<div class="alerts-test">
        <div class="alerts-test-title">See how an alert works</div>
        <p>Runs three fictional warnings about Cataloochee Cell Works through our rules. Real warnings aren't changed.</p>
        <p style="margin-top:10px"><button type="button" class="alerts-button" id="alerts-test-run">Run Cataloochee test</button></p>
      </div>`;
    }
    const rows = testEvaluations.map((evaluation) => {
      const result = evaluation.ignored
        ? `<span class="alerts-ignored">Ignored</span>`
        : risk.renderLevel(evaluation.level);
      return `<tr><td>${safe(evaluation.warning.title)}</td><td>${result}</td><td>${safe(evaluation.why)}</td></tr>`;
    }).join("");
    return `<div class="alerts-test">
      <div class="alerts-test-title">TEST RESULTS: three fictional warnings, one alert</div>
      <table class="alerts-test-table">
        <thead><tr><th>Test warning</th><th>Result</th><th>Why</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="margin-top:10px"><button type="button" class="alerts-button" id="alerts-test-reset">End test</button></p>
    </div>`;
  }

  /**
   * Describes the state of the real warnings, without implying all-clear if nothing was checked.
   * @param {Object[]} realEvaluations Results for real warnings.
   * @returns {string} The message's HTML.
   */
  function renderRealStatus(realEvaluations) {
    const risk = window.LaurelRidgeRisk;
    const { lastChecked } = risk.readRealWarnings();
    const realAlerts = realEvaluations.filter((evaluation) => evaluation.level === risk.LEVEL_ALERT);
    if (!lastChecked) {
      return `<div class="alerts-status"><p class="alerts-status-text">No real warnings have been loaded yet, so this can't confirm that all is clear.</p></div>`;
    }
    const checked = risk.formatShortDate(risk.toUtcMs(lastChecked));
    const failed = risk.getFailedFeeds();
    const feedProblem = failed.length ? ` <strong>Couldn't check: ${risk.escapeHtml(failed.join(", "))}.</strong>` : "";
    const message = realAlerts.length
      ? `<strong>${realAlerts.length} real ${realAlerts.length === 1 ? "alert" : "alerts"}.</strong> News last checked ${risk.escapeHtml(checked)}.`
      : `No real warning currently passes all four checks. News last checked ${risk.escapeHtml(checked)}.`;
    return `<div class="alerts-status"><p class="alerts-status-text">${message}${feedProblem}</p></div>${renderCounts(realEvaluations)}`;
  }

  /**
   * Copies text to the clipboard, falling back for pages opened with a double-click.
   * @param {string} text The text to copy.
   * @returns {Promise<boolean>} True if the text was copied.
   */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (clipboardError) {
      const holder = document.createElement("textarea");
      holder.value = text;
      document.body.appendChild(holder);
      holder.select();
      const copied = document.execCommand("copy");
      holder.remove();
      return copied;
    }
  }

  /**
   * Adds this section's styles to the page once.
   * @returns {void}
   */
  function injectStyles() {
    window.LaurelRidgeRisk.injectStyles();
    if (document.getElementById(STYLE_ID)) {
      return;
    }
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  let testIsOn = false;

  /**
   * Draws the section into its box and connects its buttons.
   * @param {HTMLElement} box The section's box.
   * @returns {void}
   */
  function render(box) {
    const risk = window.LaurelRidgeRisk;
    const { evaluations } = risk.currentRisk();
    const realEvaluations = evaluations.filter((evaluation) => !evaluation.warning.isTest);
    const testEvaluations = evaluations.filter((evaluation) => evaluation.warning.isTest);
    const alerts = evaluations.filter((evaluation) => evaluation.level === risk.LEVEL_ALERT);
    box.innerHTML = `
      <h2>Alerts</h2>
      ${renderRealStatus(realEvaluations)}
      ${alerts.map(renderAlertCard).join("")}
      ${renderTestPanel(testEvaluations)}`;

    box.querySelectorAll("[data-alerts-copy]").forEach((button) => {
      button.addEventListener("click", async () => {
        const index = button.dataset.alertsCopy;
        const email = buildEmail(alerts[Number(index)]);
        const copied = await copyText(`Subject: ${email.subject}\n\n${email.body}`);
        const message = box.querySelector(`[data-alerts-copied="${index}"]`);
        message.textContent = copied ? "Copied" : "Couldn't copy. Select the text above instead.";
        setTimeout(() => { message.textContent = ""; }, COPIED_MESSAGE_MS);
      });
    });

    const toggle = (turnOn) => {
      testIsOn = turnOn;
      risk.setTestWarnings(testIsOn ? buildTestWarnings(window.LAUREL_RIDGE) : []);
      render(box);
    };
    const runButton = box.querySelector("#alerts-test-run");
    const resetButton = box.querySelector("#alerts-test-reset");
    if (runButton) {
      runButton.addEventListener("click", () => toggle(true));
    }
    if (resetButton) {
      resetButton.addEventListener("click", () => toggle(false));
    }
  }

  const box = document.getElementById(BOX_ID);
  if (box && window.LaurelRidgeRisk && window.LAUREL_RIDGE) {
    injectStyles();
    render(box);
    document.addEventListener(window.LaurelRidgeRisk.RISK_CHANGED_EVENT, () => render(box));
  }
})();
