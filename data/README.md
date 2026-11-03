# Laurel Ridge Bikeworks purchasing data

All figures are as of November 2, 2026. Supplier names, factory locations and websites are real. Everything about Laurel Ridge Bikeworks and Cataloochee Cell Works is fictional: every relationship, price, order and inventory number.

## suppliers.csv: who we buy from

One row per supplier.

| Column | Meaning |
| --- | --- |
| supplier_id | Our internal code (S01 to S13) |
| supplier_name | Company name |
| parts_supplied | What we buy from them |
| factory_site, factory_city, factory_region, factory_country | Where our parts are made or shipped from |
| website | The supplier's website |
| shipping_route | How the parts travel to Hendersonville |
| us_port_of_entry | Where overseas shipments land in the US |
| lead_time_days | Days from placing an order to parts arriving |
| on_time_delivery_pct_last_12_months | Share of shipments that arrived on time in the last year |
| annual_spend_usd | What we spend with them in a year |
| contract_end | When our current supply contract ends |
| payment_terms | When we pay them |
| notes | Anything else purchasing knows |

## parts.csv: what we buy

One row per part. `only_source` is "Yes" when no other supplier is approved to make that part for us.

## products.csv: what we make

Our three models, with yearly and weekly build volumes and retail prices.

## bom.csv: what goes into each bike

The bill of materials: one row per part per product, with how many of that part each bike needs.

## inventory.csv: what's on our shelves

Units on hand, the safety stock we try never to dip below, weekly usage, and how many weeks the current stock lasts at normal production.

## open_orders.csv: what's on the way

Purchase orders we've placed that haven't arrived yet, with promised ship and arrival dates and current status.

## laurel-ridge-data.js: the same data, ready for the dashboard

All six files above in one file that web pages can read, even when opened with a double-click. Pages load it with `<script src="data/laurel-ridge-data.js"></script>` and then use `window.LAUREL_RIDGE`, which holds `suppliers`, `parts`, `products`, `bom`, `inventory` and `openOrders`.

If you change a CSV file, ask Claude to update this file to match.
