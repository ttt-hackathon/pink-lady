// Real warning signs for the dashboard, researched and checked by hand.
// Never add an invented event here: every entry needs a real source link and date.
// Test warnings live only in sections/alerts.js and only name Cataloochee Cell Works.
//
// lastChecked: the date this list was last researched (YYYY-MM-DD), or null if never.
// Each warning needs:
//   id:          short unique name
//   kind:        "earthquake", "storm", "port", "strike" or "fire"
//   title:       one line saying what happened
//   summary:     one or two plain-English sentences
//   date:        when it happened or was reported (YYYY-MM-DD)
//   sources:     [{ name, url }, ...]; two or more independent reports count as confirmed
//   official:    true if the source is an official notice
//   supplierIds: suppliers whose site, port or route it affects, such as ["S04", "S08"]
// Earthquakes also need magnitude and distanceKm. Storms also need alertLevel:
// "orange", "red", "severe" or "extreme".
window.LAUREL_RIDGE_WARNINGS = {
  lastChecked: null,
  warnings: [],
};
