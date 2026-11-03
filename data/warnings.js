// Real warning signs researched by hand, for news the live feeds can't see.
// Never add an invented event here: every entry needs a real source link and date.
// Earthquakes, storms and floods come live from sections/warnings.js.
// Test warnings live only in sections/alerts.js and only name Cataloochee Cell Works.
//
// lastChecked: the date this list was last researched (YYYY-MM-DD), or null if never.
// Each warning needs:
//   id:          short unique name
//   kind:        "earthquake", "storm", "port", "strike", "fire" or "customs"
//   title:       one line saying what happened
//   summary:     one or two plain-English sentences
//   date:        when it happened or was last confirmed (YYYY-MM-DD)
//   sources:     [{ name, url }, ...]; two or more independent reports count as confirmed
//   official:    true if the source is an official notice
//   supplierIds: suppliers whose site, port or route it affects, such as ["S04", "S08"]
window.LAUREL_RIDGE_WARNINGS = {
  lastChecked: "2026-11-03",
  warnings: [
    {
      id: "genoa-strike-2026-10-30",
      kind: "strike",
      title: "Port strike called for Oct 30, naming Genoa",
      summary: "An Italian report said a port workers' strike was planned for Oct 30 and named Genoa, the port on Selle Royal's route. We couldn't confirm whether Genoa was actually disrupted.",
      date: "2026-10-30",
      sources: [{ name: "LentePubblica", url: "https://lentepubblica.it/?p=439549" }],
      official: false,
      supplierIds: ["S12"],
    },
    {
      id: "german-ports-settled-2026-10-06",
      kind: "strike",
      title: "German port pay dispute: union accepts offer, strikes averted for now",
      summary: "Warning strikes hit Hamburg, Bremerhaven and other German ports in August and September. On Oct 6 the union accepted the employers' offer, subject to employer approval, and a later report says no strike took place.",
      date: "2026-10-06",
      sources: [
        { name: "ver.di", url: "https://www.verdi.de/geld-tarif/tarifrunde-seehaefen-verdi-nimmt-angebot-arbeitgeber" },
        { name: "SoZ", url: "https://sozonline.de/2026/10/nordseehaefen-doch-kein-streik" },
      ],
      official: false,
      supplierIds: ["S02", "S09", "S11"],
    },
    {
      id: "giant-cbp-order-2026-08-04",
      kind: "customs",
      title: "US customs order on Giant's Taiwan-made bikes and parts",
      summary: "Since Sept 24, 2025, US Customs has been detaining bicycles, bicycle parts and accessories made by Giant in Taiwan, citing information that reasonably indicates forced labor. Giant has asked for the order to be revoked. It was still in place on Aug 4, 2026, the latest report we found.",
      date: "2026-08-04",
      sources: [
        { name: "US Customs and Border Protection", url: "https://content.govdelivery.com/accounts/USDHSCBP/bulletins/3f3f8a1" },
        { name: "Bicycle Retailer", url: "https://bicycleretailer.com/international/2026/08/03/experts-wro" },
      ],
      official: true,
      supplierIds: ["S04"],
    },
  ],
};
