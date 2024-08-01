// src/lib/db/database.ts
import { Database } from "bun:sqlite";

const db = new Database("seasonal_assignments.sqlite", { create: true });

export function initializeDatabase() {
	db.run(`
    CREATE TABLE IF NOT EXISTS seasonal_assignments (
      company_code TEXT PRIMARY KEY,
      name TEXT,
      brand TEXT,
      brand_name TEXT,
      style_season_code TEXT,
      channels TEXT,
      sales_organization_codes TEXT,
      fms_year TEXT,
      created_on TEXT,
      modified_on TEXT
    )
  `);

	db.run(`
    CREATE TABLE IF NOT EXISTS divisions (
      company_code TEXT,
      division_code TEXT,
      division_name TEXT,
      is_active INTEGER,
      PRIMARY KEY (company_code, division_code),
      FOREIGN KEY (company_code) REFERENCES seasonal_assignments(company_code)
    )
  `);

	db.run(`
    CREATE TABLE IF NOT EXISTS fms_seasons (
      company_code TEXT,
      season_code TEXT,
      season_name TEXT,
      PRIMARY KEY (company_code, season_code),
      FOREIGN KEY (company_code) REFERENCES seasonal_assignments(company_code)
    )
  `);
}

export { db };