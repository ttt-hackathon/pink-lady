/**
 * Warning signs section. Reads two live official feeds when the page opens, USGS
 * earthquakes and GDACS storms and floods, keeps events near the places we depend on,
 * and hands them to the risk section. Lists every real warning in <div id="warnings">
 * with its source link, date and result. A failed feed says "couldn't check", never all clear.
 */
(function () {
  const BOX_ID = "warnings";
  const STYLE_ID = "warnings-styles";
  const EARTHQUAKE_FEED_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
  const GDACS_FEED_URL = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH";
  const GDACS_EVENT_TYPES = "TC;FL";
  const GDACS_ALERT_LEVELS = "green;orange;red";
  const EARTHQUAKE_REPORT_KM = 300;
  const STORM_REPORT_KM = 500;
  const LOOKBACK_DAYS = 7;
  const FEED_TIMEOUT_MS = 20000;
  const MS_PER_DAY = 86400000;
  const ISO_DATE_LENGTH = 10;
  const EARTH_RADIUS_KM = 6371;
  const USGS_NAME = "USGS earthquakes";
  const GDACS_NAME = "GDACS storms and floods";

  const WATCH_SITES = [
    { name: "Waynesville, NC", lat: 35.49, lon: -82.99, supplierIds: ["S01"] },
    { name: "South Korea (battery cells)", lat: 36.8, lon: 127.1, supplierIds: ["S01"] },
    { name: "Miskolc, Hungary", lat: 48.1, lon: 20.78, supplierIds: ["S02"] },
    { name: "Port of Hamburg", lat: 53.54, lon: 9.98, supplierIds: ["S02", "S11"] },
    { name: "Port of Charleston", lat: 32.78, lon: -79.93, supplierIds: ["S02", "S09", "S10", "S11", "S12"] },
    { name: "Suzhou, China", lat: 31.3, lon: 120.62, supplierIds: ["S03"] },
    { name: "Port of Shanghai", lat: 31.23, lon: 121.47, supplierIds: ["S03"] },
    { name: "Port of Savannah", lat: 32.08, lon: -81.09, supplierIds: ["S03", "S04", "S05", "S06", "S07", "S08"] },
    { name: "Taichung, Taiwan", lat: 24.35, lon: 120.62, supplierIds: ["S04", "S05", "S08"] },
    { name: "Tainan, Taiwan", lat: 23.0, lon: 120.2, supplierIds: ["S07"] },
    { name: "Port of Kaohsiung", lat: 22.61, lon: 120.29, supplierIds: ["S07"] },
    { name: "Johor, Malaysia", lat: 1.55, lon: 103.5, supplierIds: ["S06"] },
    { name: "Korbach, Germany", lat: 51.27, lon: 8.87, supplierIds: ["S09"] },
    { name: "Port of Bremerhaven", lat: 53.55, lon: 8.58, supplierIds: ["S09"] },
    { name: "Biel/Bienne, Switzerland", lat: 47.14, lon: 7.25, supplierIds: ["S10"] },
    { name: "Port of Rotterdam", lat: 51.95, lon: 4.14, supplierIds: ["S10"] },
    { name: "Meinerzhagen, Germany", lat: 51.11, lon: 7.64, supplierIds: ["S11"] },
    { name: "Pozzoleone, Italy", lat: 45.65, lon: 11.67, supplierIds: ["S12"] },
    { name: "Port of Genoa", lat: 44.41, lon: 8.93, supplierIds: ["S12"] },
    { name: "Pleasant Prairie, WI", lat: 42.55, lon: -87.93, supplierIds: ["S13"] },
  ];

  const STYLES = `
    .frame-box p.warnings-lead { margin: 0 0 10px; max-width: 820px; }
    .warnings-feeds { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 14px; margin-bottom: 8px; }
    .warnings-feed-failed { font-weight: 700; }
    .warnings-count { font-size: 14px; color: var(--muted); margin-bottom: 8px; font-variant-numeric: tabular-nums; }
    .warnings-table-wrap { overflow-x: auto; }
    .warnings-table { width: 100%; min-width: 760px; border-collapse: collapse; font-size: 14px; }
    .warnings-table th { text-align: left; font-size: 13px; font-weight: 600; color: var(--muted); padding: 8px; border-bottom: 1px solid var(--line); white-space: nowrap; }
    .warnings-table td { padding: 10px 8px; vertical-align: top; border-bottom: 1px solid var(--line); }
    .warnings-table tr:last-child td { border-bottom: none; }
    .warnings-title { font-weight: 600; }
    .warnings-summary { display: block; color: var(--muted); margin-top: 2px; }
    .warnings-date { white-space: nowrap; }
    .warnings-result { font-size: 13px; font-weight: 600; color: var(--muted); white-space: nowrap; }
  `;

  /**
   * Works out the distance between two points on the globe.
   * @param {number} lat1 First latitude.
   * @param {number} lon1 First longitude.
   * @param {number} lat2 Second latitude.
   * @param {number} lon2 Second longitude.
   * @returns {number} Distance in kilometers.
   */
  function distanceKm(lat1, lon1, lat2, lon2) {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const a = Math.sin(toRadians(lat2 - lat1) / 2) ** 2
      + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(toRadians(lon2 - lon1) / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
  }

  /**
   * Finds the watched sites within range of a point, closest first.
   * @param {number} lat Latitude.
   * @param {number} lon Longitude.
   * @param {number} rangeKm Range in kilometers.
   * @returns {Object[]} Sites with their distance added as km.
   */
  function sitesWithin(lat, lon, rangeKm) {
    return WATCH_SITES
      .map((site) => ({ ...site, km: Math.round(distanceKm(lat, lon, site.lat, site.lon)) }))
      .filter((site) => site.km <= rangeKm)
      .sort((a, b) => a.km - b.km);
  }

  /**
   * Collects the unique suppliers tied to a set of sites.
   * @param {Object[]} sites Watched sites.
   * @returns {string[]} Supplier ids.
   */
  function supplierIdsAt(sites) {
    return [...new Set(sites.flatMap((site) => site.supplierIds))];
  }

  /**
   * Fetches a feed as JSON.
   * @param {string} url The feed's address.
   * @returns {Promise<Object>} The parsed feed.
   * @throws {Error} If the feed answers with an error status or takes too long.
   */
  async function fetchJson(url) {
    const response = await fetch(url, { signal: AbortSignal.timeout(FEED_TIMEOUT_MS) });
    if (!response.ok) {
      throw new Error(`Feed answered ${response.status}`);
    }
    return response.json();
  }

  /**
   * Reads earthquakes from USGS and keeps those near a watched site. Suppliers are limited
   * to sites inside the alert distance, falling back to the nearest site for the record.
   * @returns {Promise<Object[]>} Warning records.
   */
  async function readEarthquakes() {
    const alertRangeKm = window.LaurelRidgeRisk.EARTHQUAKE_MAX_DISTANCE_KM;
    const feed = await fetchJson(EARTHQUAKE_FEED_URL);
    return feed.features.flatMap((quake) => {
      const [lon, lat] = quake.geometry.coordinates;
      const near = sitesWithin(lat, lon, EARTHQUAKE_REPORT_KM);
      if (!near.length) {
        return [];
      }
      const inRange = near.filter((site) => site.km <= alertRangeKm);
      const { mag, place, time, url } = quake.properties;
      return [{
        id: `usgs-${quake.id}`,
        kind: "earthquake",
        title: `Magnitude ${mag} earthquake, ${place}`,
        summary: `About ${near[0].km} km from ${near[0].name}.`,
        date: new Date(time).toISOString().slice(0, ISO_DATE_LENGTH),
        sources: [{ name: "USGS", url }],
        official: true,
        magnitude: mag,
        distanceKm: near[0].km,
        supplierIds: supplierIdsAt(inRange.length ? inRange : [near[0]]),
      }];
    });
  }

  /**
   * Reads recent cyclones and floods from GDACS and keeps those near a watched site.
   * @returns {Promise<Object[]>} Warning records.
   */
  async function readStorms() {
    const isoDaysAgo = (days) => new Date(Date.now() - days * MS_PER_DAY).toISOString().slice(0, ISO_DATE_LENGTH);
    const query = `eventlist=${GDACS_EVENT_TYPES}&alertlevel=${GDACS_ALERT_LEVELS}&fromDate=${isoDaysAgo(LOOKBACK_DAYS)}&toDate=${isoDaysAgo(0)}`;
    const feed = await fetchJson(`${GDACS_FEED_URL}?${query}`);
    return (feed.features || []).flatMap((event) => {
      const [lon, lat] = event.geometry.coordinates;
      const near = sitesWithin(lat, lon, STORM_REPORT_KM);
      if (!near.length) {
        return [];
      }
      const { alertlevel, name, todate, url, eventtype, eventid } = event.properties;
      return [{
        id: `gdacs-${eventtype}-${eventid}`,
        kind: "storm",
        title: `${alertlevel} alert: ${name}`,
        summary: `About ${near[0].km} km from ${near[0].name}.`,
        date: String(todate).slice(0, ISO_DATE_LENGTH),
        sources: [{ name: "GDACS", url: url && url.report }],
        official: true,
        alertLevel: String(alertlevel).toLowerCase(),
        supplierIds: supplierIdsAt(near),
      }];
    });
  }

  /**
   * Names the suppliers a warning touches.
   * @param {Object} warning A warning record.
   * @returns {string} Supplier names, or a note if there are none.
   */
  function describeSuppliers(warning) {
    const names = (warning.supplierIds || []).map((id) => {
      const supplier = window.LAUREL_RIDGE.suppliers.find((row) => row.supplier_id === id);
      return supplier ? supplier.supplier_name : id;
    });
    return names.join(", ") || "None";
  }

  /**
   * Builds one warning's row.
   * @param {Object} evaluation A warning's result from the risk section.
   * @returns {string} The row's HTML.
   */
  function renderRow(evaluation) {
    const risk = window.LaurelRidgeRisk;
    const safe = risk.escapeHtml;
    const { warning, ignored, level } = evaluation;
    const sources = (warning.sources || [])
      .filter((source) => /^https?:\/\//.test(source.url || ""))
      .map((source) => `<a href="${safe(source.url)}" target="_blank" rel="noopener">${safe(source.name)}</a>`)
      .join(", ");
    let result = risk.renderLevel(level);
    if (ignored) {
      result = `<span class="warnings-result">Ignored</span>`;
    } else if (level === risk.LEVEL_NORMAL) {
      result = `<span class="warnings-result">No action</span>`;
    }
    return `<tr>
      <td>${result}</td>
      <td><span class="warnings-title">${safe(warning.title)}</span><span class="warnings-summary">${safe(warning.summary)}</span></td>
      <td>${safe(describeSuppliers(warning))}</td>
      <td class="warnings-date">${safe(risk.formatShortDate(risk.toUtcMs(warning.date)))}<br>${sources || "No source"}</td>
      <td>${safe(evaluation.why)}</td>
    </tr>`;
  }

  /**
   * Draws the section into its box.
   * @param {HTMLElement} box The section's box.
   * @param {Object[]} feedStates Each feed's name, state and count of nearby events.
   * @returns {void}
   */
  function render(box, feedStates) {
    const risk = window.LaurelRidgeRisk;
    const safe = risk.escapeHtml;
    const order = [risk.LEVEL_ALERT, risk.LEVEL_WATCH, risk.LEVEL_NORMAL];
    const evaluations = risk.currentRisk().evaluations
      .filter((evaluation) => !evaluation.warning.isTest)
      .sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level)
        || Number(a.ignored) - Number(b.ignored)
        || b.warning.date.localeCompare(a.warning.date));
    const count = (test) => evaluations.filter(test).length;
    const feeds = feedStates.map(({ name, state, nearby }) => {
      if (state === "checking") {
        return `<span>${safe(name)}: checking…</span>`;
      }
      return state === "failed"
        ? `<span class="warnings-feed-failed">▲ ${safe(name)}: couldn't check</span>`
        : `<span>● ${safe(name)}: checked just now, ${nearby} near our sites</span>`;
    }).join("");
    const { lastChecked } = risk.readRealWarnings();
    box.innerHTML = `
      <h2>Warning signs</h2>
      <p class="warnings-lead">Earthquakes, storms and floods update when this page opens. News on strikes and customs is researched by hand, last checked ${safe(risk.formatShortDate(risk.toUtcMs(lastChecked)))}.</p>
      <div class="warnings-feeds">${feeds}</div>
      <div class="warnings-count">${evaluations.length} reviewed · ${count((e) => e.ignored)} ignored · ${count((e) => !e.ignored && e.level === risk.LEVEL_NORMAL)} no action · ${count((e) => e.level === risk.LEVEL_WATCH)} on Watch · ${count((e) => e.level === risk.LEVEL_ALERT)} alerted</div>
      <div class="warnings-table-wrap"><table class="warnings-table">
        <thead><tr><th>Result</th><th>Warning</th><th>Suppliers touched</th><th>Date and source</th><th>Why</th></tr></thead>
        <tbody>${evaluations.map(renderRow).join("")}</tbody>
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
   * Reads every feed, then shares the results with the rest of the dashboard.
   * @param {HTMLElement} box The section's box.
   * @returns {Promise<void>} Resolves once the page has been updated.
   */
  async function loadFeeds(box) {
    const feeds = [
      { name: USGS_NAME, read: readEarthquakes, state: "checking", nearby: 0, warnings: [] },
      { name: GDACS_NAME, read: readStorms, state: "checking", nearby: 0, warnings: [] },
    ];
    render(box, feeds);
    const publish = () => {
      const failed = feeds.filter((feed) => feed.state === "failed").map((feed) => feed.name);
      window.LaurelRidgeRisk.setLiveWarnings(feeds.flatMap((feed) => feed.warnings), failed);
      render(box, feeds);
    };
    await Promise.all(feeds.map(async (feed) => {
      try {
        feed.warnings = await feed.read();
        feed.nearby = feed.warnings.length;
        feed.state = "ok";
      } catch (feedError) {
        feed.state = "failed";
      }
      publish();
    }));
  }

  const box = document.getElementById(BOX_ID);
  if (box && window.LaurelRidgeRisk && window.LAUREL_RIDGE) {
    injectStyles();
    loadFeeds(box);
  }
})();
