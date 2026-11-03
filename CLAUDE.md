# Workshop house rules

- We are business people, not programmers. Explain what you're doing in plain English.
- These are real companies. Never invent an event or show sample alerts about them.
  Every warning needs a real source link and date. For test data, use only
  Cataloochee Cell Works.
- Never write our API key into any file. This repository is public.
- Everything must work with a double-click on index.html and also at our live link.
- When we say "save to GitHub", commit and push with a short note.
  When we say "get the latest", pull first.

## How our dashboard fits together

Our team builds ONE dashboard together. Each person owns one section of it.

- index.html is the dashboard: the page frame, the layout and an empty box for each
  section. Only the dashboard owner edits it.
- Each section lives in its own file in the sections folder, such as
  sections/weather.js. Only that section's owner edits it.
- A section file draws its content into the box on index.html with the same name.
  For example, sections/weather.js fills <div id="weather">. index.html loads every
  section with a line like <script src="sections/weather.js"></script>.
- If a section's box isn't on index.html yet, the section should still load
  without errors; it simply shows up once the dashboard owner adds the box.
- Our purchasing data is in data/laurel-ridge-data.js, available as
  window.LAUREL_RIDGE. index.html loads it before any section. Use it instead of
  reading the CSV files, so everything works with a double-click.
- Keep each section's styles inside its own file, with names that start with the
  section's name, so sections don't change each other's look.

## Our team's plan

**Goal:** a stripped-down demo (MVP) that spots supply trouble early, ranks it by
impact on production, and only raises alerts that really matter.

**How we work:** all code is written on one machine, which owns index.html and every
section. Teammates check sources, review thresholds and prepare the demo. The live
link is https://ttt-hackathon.github.io/pink-lady/ . Each task must leave the
dashboard presentable, and is saved to GitHub when it's done.

**What we watch:** all 13 suppliers' sites and shipping routes, the ports of Savannah
and Charleston, Hendersonville, and South Korea (Cataloochee's battery cells).

**Margin:** days between a part running out and its next delivery, from our own data.
A negative margin means a shortfall even if every order arrives on time.

**Impact tiers** (from our own data, weekly revenue is at retail price):

- Tier 1: stops every bike, no other approved source.
- Tier 2: stops some bikes, no other approved source.
- Tier 3: another source is approved. Can reach Watch but can't trigger an email,
  until we confirm how quickly the backup can deliver.

**Levels:**

- Normal: no warning sign and no stock concern.
- Watch: a warning passes checks 1 and 2 but not all four, or it's an unconfirmed
  report about a Tier 1 supplier, or a part with no other source has under 14 days of
  margin. Stock concerns are labeled as coming from our own data, never as an event.
- Alert: a warning passes all four checks. Shows a banner and a ready-to-send email.

**The four checks for an alert:**

1. Real: official source or two independent reports, dated within the last 7 days.
2. Touches us: affects a site, port or route we depend on.
3. Matters: the supplier is Tier 1 or Tier 2.
4. Reaches the line: the expected delay is longer than our margin.

**Starting thresholds** (our judgment, adjust as needed):

| Warning | Minimum to count | Assumed delay |
| --- | --- | --- |
| Earthquake | Magnitude 6+ within 100 km | 14 days |
| Storm or flood | GDACS orange or red, or a US severe or extreme alert | 7 days |
| Port disruption or closure | Official notice or two reports | 7 days |
| Strike | Announced or under way | 14 days |
| Factory fire or major damage | Official notice or two reports | 30 days |
| Customs order blocking imports | Official notice or two reports | 30 days |

**Our sources:** two live feeds read when the page opens, USGS earthquakes and GDACS
cyclones and floods (kept if within 500 km of a site we watch), plus hand-researched
news in data/warnings.js. A failed feed shows "couldn't check", never all clear.

**Avoiding alert fatigue:** one event gets one email, even if it hits several
suppliers. Known stock gaps stay in a dashboard panel rather than repeating as alerts.
The page shows how many warnings were reviewed, on Watch and alerted.

**Sections:**

| Box | File | What it shows |
| --- | --- | --- |
| alerts | sections/alerts.js | Alert banner, ready-to-send email, Cataloochee test button |
| risk | sections/risk.js | Tiers, margins, levels, reasons and the stock gap panel |
| warnings | sections/warnings.js | Real warnings from data/warnings.js, each with source link and date |

**Build order:** (1) this plan, (2) page frame, (3) tiers and margins, (4) risk table
and stock gap panel, (5) research real warnings, (6) warnings list, (7) four checks
and levels, (8) alert and email, (9) Cataloochee test button, (10) final live check.

**If there's time:** USGS earthquakes feed, then GDACS disasters feed, showing
"couldn't check" if a feed fails; no-repeat email rules; a supplier map.

**Left out of the MVP:** checking where an order is when judging a delay, remembering
which alerts were sent, automatic email sending and scheduled rechecks.
