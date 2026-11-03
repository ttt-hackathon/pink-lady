// Laurel Ridge Bikeworks purchasing data, the same as the CSV files in this folder.
// Load it in a page with <script src="data/laurel-ridge-data.js"></script> and use window.LAUREL_RIDGE.
// Pages can read this file even when opened with a double-click; they can't read the CSV files that way.
window.LAUREL_RIDGE = {
  "asOf": "2026-11-02",
  "note": "Laurel Ridge Bikeworks and Cataloochee Cell Works are fictional. Supplier names, locations and websites are real; every relationship, price, order and inventory number is made up.",
  "suppliers": [
    {
      "supplier_id": "S01",
      "supplier_name": "Cataloochee Cell Works",
      "parts_supplied": "Battery packs",
      "factory_site": "Main plant",
      "factory_city": "Waynesville",
      "factory_region": "North Carolina",
      "factory_country": "United States",
      "website": "https://ttt-hackathon.github.io/cataloochee-cellworks/",
      "shipping_route": "Truck, about 1 hour",
      "us_port_of_entry": "None (domestic)",
      "lead_time_days": 21,
      "on_time_delivery_pct_last_12_months": 97,
      "annual_spend_usd": 2460000,
      "contract_end": "2027-06-30",
      "payment_terms": "Net 30",
      "notes": "Our only battery-pack supplier. Packs are assembled from lithium-ion cells Cataloochee imports from Samsung SDI in South Korea."
    },
    {
      "supplier_id": "S02",
      "supplier_name": "Bosch eBike Systems",
      "parts_supplied": "Mid-drive motors, displays",
      "factory_site": "Bosch plant",
      "factory_city": "Miskolc",
      "factory_region": "Borsod-Abauj-Zemplen",
      "factory_country": "Hungary",
      "website": "https://www.bosch-ebike.com",
      "shipping_route": "Truck to Hamburg, ocean to Charleston, truck to Hendersonville",
      "us_port_of_entry": "Charleston, SC",
      "lead_time_days": 112,
      "on_time_delivery_pct_last_12_months": 88,
      "annual_spend_usd": 2820000,
      "contract_end": "2027-12-31",
      "payment_terms": "Net 60",
      "notes": "Bosch eBike Systems is headquartered near Reutlingen, Germany. Our drive units ship from the Miskolc plant. Allocation is set quarterly."
    },
    {
      "supplier_id": "S03",
      "supplier_name": "Bafang",
      "parts_supplied": "Rear hub motor kits, displays",
      "factory_site": "Main plant",
      "factory_city": "Suzhou",
      "factory_region": "Jiangsu",
      "factory_country": "China",
      "website": "https://www.bafang-e.com",
      "shipping_route": "Ocean from Shanghai to Savannah, truck to Hendersonville",
      "us_port_of_entry": "Savannah, GA",
      "lead_time_days": 84,
      "on_time_delivery_pct_last_12_months": 91,
      "annual_spend_usd": 855000,
      "contract_end": "2027-03-31",
      "payment_terms": "30% deposit, balance before shipment",
      "notes": ""
    },
    {
      "supplier_id": "S04",
      "supplier_name": "Giant Manufacturing",
      "parts_supplied": "Aluminum frames (all three models)",
      "factory_site": "Dajia plant",
      "factory_city": "Taichung",
      "factory_region": "Taichung City",
      "factory_country": "Taiwan",
      "website": "https://www.giant-bicycles.com",
      "shipping_route": "Ocean from Taichung Port to Savannah, truck to Hendersonville",
      "us_port_of_entry": "Savannah, GA",
      "lead_time_days": 98,
      "on_time_delivery_pct_last_12_months": 93,
      "annual_spend_usd": 1610000,
      "contract_end": "2027-09-30",
      "payment_terms": "Net 45",
      "notes": "Frames are built to our designs under an OEM contract."
    },
    {
      "supplier_id": "S05",
      "supplier_name": "Fox Factory",
      "parts_supplied": "Suspension forks",
      "factory_site": "Fox Taiwan facility",
      "factory_city": "Taichung",
      "factory_region": "Taichung City",
      "factory_country": "Taiwan",
      "website": "https://www.ridefox.com",
      "shipping_route": "Ocean from Taichung Port to Savannah, truck to Hendersonville",
      "us_port_of_entry": "Savannah, GA",
      "lead_time_days": 91,
      "on_time_delivery_pct_last_12_months": 86,
      "annual_spend_usd": 780000,
      "contract_end": "2027-06-30",
      "payment_terms": "Net 45",
      "notes": "Fox Factory is headquartered in Duluth, Georgia. Our forks ship from its Taiwan facility."
    },
    {
      "supplier_id": "S06",
      "supplier_name": "Shimano",
      "parts_supplied": "Drivetrain groups (8- and 11-speed)",
      "factory_site": "Shimano Components (Malaysia)",
      "factory_city": "Pekan Nanas, Pontian",
      "factory_region": "Johor",
      "factory_country": "Malaysia",
      "website": "https://bike.shimano.com",
      "shipping_route": "Ocean from Tanjung Pelepas to Savannah, truck to Hendersonville",
      "us_port_of_entry": "Savannah, GA",
      "lead_time_days": 105,
      "on_time_delivery_pct_last_12_months": 84,
      "annual_spend_usd": 705000,
      "contract_end": "2027-12-31",
      "payment_terms": "Net 60",
      "notes": "Shimano is headquartered in Sakai, Japan. Our groups ship from its Malaysia factory."
    },
    {
      "supplier_id": "S07",
      "supplier_name": "KMC Chain",
      "parts_supplied": "E-bike chains",
      "factory_site": "Headquarters",
      "factory_city": "Tainan",
      "factory_region": "Tainan City",
      "factory_country": "Taiwan",
      "website": "https://www.kmcchain.com",
      "shipping_route": "Ocean from Kaohsiung to Savannah, truck to Hendersonville",
      "us_port_of_entry": "Savannah, GA",
      "lead_time_days": 70,
      "on_time_delivery_pct_last_12_months": 95,
      "annual_spend_usd": 108000,
      "contract_end": "2027-03-31",
      "payment_terms": "Net 45",
      "notes": ""
    },
    {
      "supplier_id": "S08",
      "supplier_name": "Tektro",
      "parts_supplied": "Hydraulic disc brake sets",
      "factory_site": "Headquarters and factory",
      "factory_city": "Taichung",
      "factory_region": "Taichung City",
      "factory_country": "Taiwan",
      "website": "https://www.tektro.com",
      "shipping_route": "Ocean from Taichung Port to Savannah, truck to Hendersonville",
      "us_port_of_entry": "Savannah, GA",
      "lead_time_days": 77,
      "on_time_delivery_pct_last_12_months": 92,
      "annual_spend_usd": 510000,
      "contract_end": "2027-06-30",
      "payment_terms": "Net 45",
      "notes": ""
    },
    {
      "supplier_id": "S09",
      "supplier_name": "Continental",
      "parts_supplied": "Bicycle tires",
      "factory_site": "Korbach plant",
      "factory_city": "Korbach",
      "factory_region": "Hesse",
      "factory_country": "Germany",
      "website": "https://www.continental-tires.com",
      "shipping_route": "Truck to Bremerhaven, ocean to Charleston, truck to Hendersonville",
      "us_port_of_entry": "Charleston, SC",
      "lead_time_days": 63,
      "on_time_delivery_pct_last_12_months": 96,
      "annual_spend_usd": 336000,
      "contract_end": "2027-12-31",
      "payment_terms": "Net 60",
      "notes": ""
    },
    {
      "supplier_id": "S10",
      "supplier_name": "DT Swiss",
      "parts_supplied": "Wheelsets (Ridgeline Trail)",
      "factory_site": "Headquarters and factory",
      "factory_city": "Biel/Bienne",
      "factory_region": "Bern",
      "factory_country": "Switzerland",
      "website": "https://www.dtswiss.com",
      "shipping_route": "Truck to Rotterdam, ocean to Charleston, truck to Hendersonville",
      "us_port_of_entry": "Charleston, SC",
      "lead_time_days": 56,
      "on_time_delivery_pct_last_12_months": 94,
      "annual_spend_usd": 440000,
      "contract_end": "2027-06-30",
      "payment_terms": "Net 60",
      "notes": ""
    },
    {
      "supplier_id": "S11",
      "supplier_name": "Busch & Muller",
      "parts_supplied": "Front and rear light sets",
      "factory_site": "Headquarters and factory",
      "factory_city": "Meinerzhagen",
      "factory_region": "North Rhine-Westphalia",
      "factory_country": "Germany",
      "website": "https://www.bumm.de",
      "shipping_route": "Truck to Hamburg, ocean to Charleston, truck to Hendersonville",
      "us_port_of_entry": "Charleston, SC",
      "lead_time_days": 70,
      "on_time_delivery_pct_last_12_months": 90,
      "annual_spend_usd": 380000,
      "contract_end": "2027-03-31",
      "payment_terms": "Net 60",
      "notes": ""
    },
    {
      "supplier_id": "S12",
      "supplier_name": "Selle Royal",
      "parts_supplied": "Saddles",
      "factory_site": "Headquarters",
      "factory_city": "Pozzoleone",
      "factory_region": "Veneto",
      "factory_country": "Italy",
      "website": "https://www.selleroyal.com",
      "shipping_route": "Truck to Genoa, ocean to Charleston, truck to Hendersonville",
      "us_port_of_entry": "Charleston, SC",
      "lead_time_days": 63,
      "on_time_delivery_pct_last_12_months": 93,
      "annual_spend_usd": 132000,
      "contract_end": "2027-09-30",
      "payment_terms": "Net 60",
      "notes": ""
    },
    {
      "supplier_id": "S13",
      "supplier_name": "Uline",
      "parts_supplied": "Shipping cartons and packaging",
      "factory_site": "Headquarters (ships from regional branch)",
      "factory_city": "Pleasant Prairie",
      "factory_region": "Wisconsin",
      "factory_country": "United States",
      "website": "https://www.uline.com",
      "shipping_route": "Truck",
      "us_port_of_entry": "None (domestic)",
      "lead_time_days": 3,
      "on_time_delivery_pct_last_12_months": 99,
      "annual_spend_usd": 84000,
      "contract_end": "No contract (catalog purchases)",
      "payment_terms": "Net 30",
      "notes": ""
    }
  ],
  "parts": [
    {
      "part_number": "P-100",
      "description": "Battery pack, 625 Wh",
      "supplier_id": "S01",
      "supplier_name": "Cataloochee Cell Works",
      "only_source": "Yes",
      "unit_cost_usd": 410.0,
      "annual_volume": 6000
    },
    {
      "part_number": "P-200",
      "description": "Mid-drive motor and controller",
      "supplier_id": "S02",
      "supplier_name": "Bosch eBike Systems",
      "only_source": "Yes",
      "unit_cost_usd": 780.0,
      "annual_volume": 3000
    },
    {
      "part_number": "P-201",
      "description": "Handlebar display and remote (Bosch)",
      "supplier_id": "S02",
      "supplier_name": "Bosch eBike Systems",
      "only_source": "Yes",
      "unit_cost_usd": 160.0,
      "annual_volume": 3000
    },
    {
      "part_number": "P-210",
      "description": "Rear hub motor kit with controller",
      "supplier_id": "S03",
      "supplier_name": "Bafang",
      "only_source": "Yes",
      "unit_cost_usd": 240.0,
      "annual_volume": 3000
    },
    {
      "part_number": "P-211",
      "description": "Handlebar display (Bafang)",
      "supplier_id": "S03",
      "supplier_name": "Bafang",
      "only_source": "Yes",
      "unit_cost_usd": 45.0,
      "annual_volume": 3000
    },
    {
      "part_number": "P-300",
      "description": "Frame, Ridgeline Trail",
      "supplier_id": "S04",
      "supplier_name": "Giant Manufacturing",
      "only_source": "Yes",
      "unit_cost_usd": 310.0,
      "annual_volume": 2000
    },
    {
      "part_number": "P-301",
      "description": "Frame, Mill River Commuter",
      "supplier_id": "S04",
      "supplier_name": "Giant Manufacturing",
      "only_source": "Yes",
      "unit_cost_usd": 190.0,
      "annual_volume": 3000
    },
    {
      "part_number": "P-302",
      "description": "Frame, Haywood Cargo",
      "supplier_id": "S04",
      "supplier_name": "Giant Manufacturing",
      "only_source": "Yes",
      "unit_cost_usd": 420.0,
      "annual_volume": 1000
    },
    {
      "part_number": "P-400",
      "description": "Suspension fork, 140 mm",
      "supplier_id": "S05",
      "supplier_name": "Fox Factory",
      "only_source": "Yes",
      "unit_cost_usd": 390.0,
      "annual_volume": 2000
    },
    {
      "part_number": "P-500",
      "description": "Drivetrain group, 11-speed",
      "supplier_id": "S06",
      "supplier_name": "Shimano",
      "only_source": "Yes",
      "unit_cost_usd": 165.0,
      "annual_volume": 3000
    },
    {
      "part_number": "P-501",
      "description": "Drivetrain group, 8-speed",
      "supplier_id": "S06",
      "supplier_name": "Shimano",
      "only_source": "No",
      "unit_cost_usd": 70.0,
      "annual_volume": 3000
    },
    {
      "part_number": "P-510",
      "description": "Chain, e-bike rated",
      "supplier_id": "S07",
      "supplier_name": "KMC Chain",
      "only_source": "No",
      "unit_cost_usd": 18.0,
      "annual_volume": 6000
    },
    {
      "part_number": "P-600",
      "description": "Hydraulic disc brake set, front and rear",
      "supplier_id": "S08",
      "supplier_name": "Tektro",
      "only_source": "Yes",
      "unit_cost_usd": 85.0,
      "annual_volume": 6000
    },
    {
      "part_number": "P-700",
      "description": "Tire (sold singly)",
      "supplier_id": "S09",
      "supplier_name": "Continental",
      "only_source": "No",
      "unit_cost_usd": 28.0,
      "annual_volume": 12000
    },
    {
      "part_number": "P-710",
      "description": "Wheelset",
      "supplier_id": "S10",
      "supplier_name": "DT Swiss",
      "only_source": "Yes",
      "unit_cost_usd": 220.0,
      "annual_volume": 2000
    },
    {
      "part_number": "P-800",
      "description": "Light set, front and rear",
      "supplier_id": "S11",
      "supplier_name": "Busch & Muller",
      "only_source": "No",
      "unit_cost_usd": 95.0,
      "annual_volume": 4000
    },
    {
      "part_number": "P-810",
      "description": "Saddle",
      "supplier_id": "S12",
      "supplier_name": "Selle Royal",
      "only_source": "No",
      "unit_cost_usd": 22.0,
      "annual_volume": 6000
    },
    {
      "part_number": "P-900",
      "description": "Shipping carton and packing kit",
      "supplier_id": "S13",
      "supplier_name": "Uline",
      "only_source": "No",
      "unit_cost_usd": 14.0,
      "annual_volume": 6000
    }
  ],
  "products": [
    {
      "product_id": "LR-TRL",
      "product_name": "Ridgeline Trail",
      "category": "Electric mountain bike",
      "drive_system": "Bosch mid-drive",
      "annual_units": 2000,
      "weekly_build_rate": 40,
      "retail_price_usd": 5200
    },
    {
      "product_id": "LR-COM",
      "product_name": "Mill River Commuter",
      "category": "Electric commuter bike",
      "drive_system": "Bafang rear hub motor",
      "annual_units": 3000,
      "weekly_build_rate": 60,
      "retail_price_usd": 2400
    },
    {
      "product_id": "LR-CGO",
      "product_name": "Haywood Cargo",
      "category": "Electric cargo bike",
      "drive_system": "Bosch mid-drive",
      "annual_units": 1000,
      "weekly_build_rate": 20,
      "retail_price_usd": 4800
    }
  ],
  "bom": [
    {
      "product_id": "LR-TRL",
      "part_number": "P-100",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-TRL",
      "part_number": "P-200",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-TRL",
      "part_number": "P-201",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-TRL",
      "part_number": "P-300",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-TRL",
      "part_number": "P-400",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-TRL",
      "part_number": "P-500",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-TRL",
      "part_number": "P-510",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-TRL",
      "part_number": "P-600",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-TRL",
      "part_number": "P-700",
      "qty_per_bike": 2
    },
    {
      "product_id": "LR-TRL",
      "part_number": "P-710",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-TRL",
      "part_number": "P-810",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-TRL",
      "part_number": "P-900",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-COM",
      "part_number": "P-100",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-COM",
      "part_number": "P-210",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-COM",
      "part_number": "P-211",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-COM",
      "part_number": "P-301",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-COM",
      "part_number": "P-501",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-COM",
      "part_number": "P-510",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-COM",
      "part_number": "P-600",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-COM",
      "part_number": "P-700",
      "qty_per_bike": 2
    },
    {
      "product_id": "LR-COM",
      "part_number": "P-800",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-COM",
      "part_number": "P-810",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-COM",
      "part_number": "P-900",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-CGO",
      "part_number": "P-100",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-CGO",
      "part_number": "P-200",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-CGO",
      "part_number": "P-201",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-CGO",
      "part_number": "P-302",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-CGO",
      "part_number": "P-500",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-CGO",
      "part_number": "P-510",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-CGO",
      "part_number": "P-600",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-CGO",
      "part_number": "P-700",
      "qty_per_bike": 2
    },
    {
      "product_id": "LR-CGO",
      "part_number": "P-800",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-CGO",
      "part_number": "P-810",
      "qty_per_bike": 1
    },
    {
      "product_id": "LR-CGO",
      "part_number": "P-900",
      "qty_per_bike": 1
    }
  ],
  "inventory": [
    {
      "part_number": "P-100",
      "description": "Battery pack, 625 Wh",
      "on_hand_units": 360,
      "safety_stock_units": 240,
      "weekly_usage_units": 120,
      "weeks_of_cover": 3.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-200",
      "description": "Mid-drive motor and controller",
      "on_hand_units": 540,
      "safety_stock_units": 240,
      "weekly_usage_units": 60,
      "weeks_of_cover": 9.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-201",
      "description": "Handlebar display and remote (Bosch)",
      "on_hand_units": 600,
      "safety_stock_units": 240,
      "weekly_usage_units": 60,
      "weeks_of_cover": 10.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-210",
      "description": "Rear hub motor kit with controller",
      "on_hand_units": 300,
      "safety_stock_units": 180,
      "weekly_usage_units": 60,
      "weeks_of_cover": 5.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-211",
      "description": "Handlebar display (Bafang)",
      "on_hand_units": 420,
      "safety_stock_units": 120,
      "weekly_usage_units": 60,
      "weeks_of_cover": 7.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-300",
      "description": "Frame, Ridgeline Trail",
      "on_hand_units": 280,
      "safety_stock_units": 120,
      "weekly_usage_units": 40,
      "weeks_of_cover": 7.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-301",
      "description": "Frame, Mill River Commuter",
      "on_hand_units": 240,
      "safety_stock_units": 180,
      "weekly_usage_units": 60,
      "weeks_of_cover": 4.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-302",
      "description": "Frame, Haywood Cargo",
      "on_hand_units": 60,
      "safety_stock_units": 60,
      "weekly_usage_units": 20,
      "weeks_of_cover": 3.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-400",
      "description": "Suspension fork, 140 mm",
      "on_hand_units": 200,
      "safety_stock_units": 120,
      "weekly_usage_units": 40,
      "weeks_of_cover": 5.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-500",
      "description": "Drivetrain group, 11-speed",
      "on_hand_units": 420,
      "safety_stock_units": 180,
      "weekly_usage_units": 60,
      "weeks_of_cover": 7.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-501",
      "description": "Drivetrain group, 8-speed",
      "on_hand_units": 480,
      "safety_stock_units": 120,
      "weekly_usage_units": 60,
      "weeks_of_cover": 8.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-510",
      "description": "Chain, e-bike rated",
      "on_hand_units": 900,
      "safety_stock_units": 240,
      "weekly_usage_units": 120,
      "weeks_of_cover": 7.5,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-600",
      "description": "Hydraulic disc brake set, front and rear",
      "on_hand_units": 480,
      "safety_stock_units": 360,
      "weekly_usage_units": 120,
      "weeks_of_cover": 4.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-700",
      "description": "Tire (sold singly)",
      "on_hand_units": 1920,
      "safety_stock_units": 480,
      "weekly_usage_units": 240,
      "weeks_of_cover": 8.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-710",
      "description": "Wheelset",
      "on_hand_units": 160,
      "safety_stock_units": 80,
      "weekly_usage_units": 40,
      "weeks_of_cover": 4.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-800",
      "description": "Light set, front and rear",
      "on_hand_units": 640,
      "safety_stock_units": 160,
      "weekly_usage_units": 80,
      "weeks_of_cover": 8.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-810",
      "description": "Saddle",
      "on_hand_units": 1200,
      "safety_stock_units": 240,
      "weekly_usage_units": 120,
      "weeks_of_cover": 10.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    },
    {
      "part_number": "P-900",
      "description": "Shipping carton and packing kit",
      "on_hand_units": 360,
      "safety_stock_units": 240,
      "weekly_usage_units": 120,
      "weeks_of_cover": 3.0,
      "location": "Hendersonville, NC warehouse",
      "as_of": "2026-11-02"
    }
  ],
  "openOrders": [
    {
      "po_number": "PO-26-1187",
      "supplier_id": "S01",
      "part_number": "P-100",
      "quantity": 240,
      "order_date": "2026-10-13",
      "promised_ship_date": "2026-11-09",
      "promised_arrival_date": "2026-11-10",
      "ship_mode": "Truck",
      "us_port_of_entry": "",
      "status": "Confirmed"
    },
    {
      "po_number": "PO-26-1203",
      "supplier_id": "S01",
      "part_number": "P-100",
      "quantity": 240,
      "order_date": "2026-10-27",
      "promised_ship_date": "2026-11-23",
      "promised_arrival_date": "2026-11-24",
      "ship_mode": "Truck",
      "us_port_of_entry": "",
      "status": "Confirmed"
    },
    {
      "po_number": "PO-26-1215",
      "supplier_id": "S01",
      "part_number": "P-100",
      "quantity": 480,
      "order_date": "2026-11-02",
      "promised_ship_date": "2026-12-07",
      "promised_arrival_date": "2026-12-08",
      "ship_mode": "Truck",
      "us_port_of_entry": "",
      "status": "Confirmed"
    },
    {
      "po_number": "PO-26-1042",
      "supplier_id": "S02",
      "part_number": "P-200",
      "quantity": 720,
      "order_date": "2026-08-04",
      "promised_ship_date": "2026-10-26",
      "promised_arrival_date": "2026-12-01",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Charleston, SC",
      "status": "In transit"
    },
    {
      "po_number": "PO-26-1043",
      "supplier_id": "S02",
      "part_number": "P-201",
      "quantity": 720,
      "order_date": "2026-08-04",
      "promised_ship_date": "2026-10-26",
      "promised_arrival_date": "2026-12-01",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Charleston, SC",
      "status": "In transit"
    },
    {
      "po_number": "PO-26-1098",
      "supplier_id": "S03",
      "part_number": "P-210",
      "quantity": 900,
      "order_date": "2026-09-01",
      "promised_ship_date": "2026-10-20",
      "promised_arrival_date": "2026-11-25",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Savannah, GA",
      "status": "In transit"
    },
    {
      "po_number": "PO-26-1099",
      "supplier_id": "S03",
      "part_number": "P-211",
      "quantity": 900,
      "order_date": "2026-09-01",
      "promised_ship_date": "2026-10-20",
      "promised_arrival_date": "2026-11-25",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Savannah, GA",
      "status": "In transit"
    },
    {
      "po_number": "PO-26-1110",
      "supplier_id": "S04",
      "part_number": "P-300",
      "quantity": 480,
      "order_date": "2026-09-08",
      "promised_ship_date": "2026-11-05",
      "promised_arrival_date": "2026-12-15",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Savannah, GA",
      "status": "Awaiting shipment"
    },
    {
      "po_number": "PO-26-1111",
      "supplier_id": "S04",
      "part_number": "P-301",
      "quantity": 720,
      "order_date": "2026-09-08",
      "promised_ship_date": "2026-10-29",
      "promised_arrival_date": "2026-12-08",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Savannah, GA",
      "status": "In transit"
    },
    {
      "po_number": "PO-26-1112",
      "supplier_id": "S04",
      "part_number": "P-302",
      "quantity": 240,
      "order_date": "2026-09-08",
      "promised_ship_date": "2026-10-29",
      "promised_arrival_date": "2026-12-08",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Savannah, GA",
      "status": "In transit"
    },
    {
      "po_number": "PO-26-1121",
      "supplier_id": "S05",
      "part_number": "P-400",
      "quantity": 480,
      "order_date": "2026-09-15",
      "promised_ship_date": "2026-11-12",
      "promised_arrival_date": "2026-12-17",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Savannah, GA",
      "status": "Awaiting shipment"
    },
    {
      "po_number": "PO-26-1130",
      "supplier_id": "S06",
      "part_number": "P-500",
      "quantity": 720,
      "order_date": "2026-08-25",
      "promised_ship_date": "2026-11-02",
      "promised_arrival_date": "2026-12-08",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Savannah, GA",
      "status": "Awaiting shipment"
    },
    {
      "po_number": "PO-26-1131",
      "supplier_id": "S06",
      "part_number": "P-501",
      "quantity": 720,
      "order_date": "2026-08-25",
      "promised_ship_date": "2026-11-02",
      "promised_arrival_date": "2026-12-08",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Savannah, GA",
      "status": "Awaiting shipment"
    },
    {
      "po_number": "PO-26-1150",
      "supplier_id": "S07",
      "part_number": "P-510",
      "quantity": 1440,
      "order_date": "2026-09-22",
      "promised_ship_date": "2026-11-03",
      "promised_arrival_date": "2026-12-01",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Savannah, GA",
      "status": "Awaiting shipment"
    },
    {
      "po_number": "PO-26-1151",
      "supplier_id": "S08",
      "part_number": "P-600",
      "quantity": 1440,
      "order_date": "2026-09-22",
      "promised_ship_date": "2026-10-27",
      "promised_arrival_date": "2026-12-01",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Savannah, GA",
      "status": "In transit"
    },
    {
      "po_number": "PO-26-1160",
      "supplier_id": "S09",
      "part_number": "P-700",
      "quantity": 2880,
      "order_date": "2026-10-06",
      "promised_ship_date": "2026-11-10",
      "promised_arrival_date": "2026-12-08",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Charleston, SC",
      "status": "Confirmed"
    },
    {
      "po_number": "PO-26-1171",
      "supplier_id": "S10",
      "part_number": "P-710",
      "quantity": 320,
      "order_date": "2026-10-06",
      "promised_ship_date": "2026-11-04",
      "promised_arrival_date": "2026-12-01",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Charleston, SC",
      "status": "Confirmed"
    },
    {
      "po_number": "PO-26-1175",
      "supplier_id": "S11",
      "part_number": "P-800",
      "quantity": 960,
      "order_date": "2026-10-13",
      "promised_ship_date": "2026-11-16",
      "promised_arrival_date": "2026-12-22",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Charleston, SC",
      "status": "Confirmed"
    },
    {
      "po_number": "PO-26-1180",
      "supplier_id": "S12",
      "part_number": "P-810",
      "quantity": 1440,
      "order_date": "2026-10-13",
      "promised_ship_date": "2026-11-12",
      "promised_arrival_date": "2026-12-15",
      "ship_mode": "Ocean",
      "us_port_of_entry": "Charleston, SC",
      "status": "Confirmed"
    },
    {
      "po_number": "PO-26-1220",
      "supplier_id": "S13",
      "part_number": "P-900",
      "quantity": 600,
      "order_date": "2026-11-02",
      "promised_ship_date": "2026-11-04",
      "promised_arrival_date": "2026-11-05",
      "ship_mode": "Truck",
      "us_port_of_entry": "",
      "status": "Confirmed"
    }
  ]
};
