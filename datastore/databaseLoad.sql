-- 'country' Table ("WDICountry.csv")
-- 266 rows x 30 columns (+1 Row after preprocessing)
CREATE TABLE country (
    country_code CHAR(3) UNIQUE NOT NULL,
    short_name VARCHAR(64) UNIQUE NOT NULL,
    table_name VARCHAR(64) UNIQUE NOT NULL,
    long_name VARCHAR(256) UNIQUE NOT NULL,
    two_alpha_code CHAR(2),
    currency_unit VARCHAR(64),
    spl_notes TEXT,
    region VARCHAR(64),
    income_group VARCHAR(64),
    wb2_code CHAR(2),
    national_accounts_base_year VARCHAR(64),
    national_accounts_ref_year VARCHAR(64),
    sna_price_valuation VARCHAR(64),
    lending_category VARCHAR(64),
    other_groups VARCHAR(64),
    sys_of_national_accounts VARCHAR(64),
    alt_conversion_factor VARCHAR(64),
    ppp_survey_year VARCHAR(64),
    bal_of_payments_manual_in_use VARCHAR(64),
    ext_debt_reporting_status VARCHAR(64),
    sys_of_trade VARCHAR(64),
    govt_accounting_concept VARCHAR(64),
    imf_data_dissemination_standard VARCHAR(64),
    latest_pop_census VARCHAR(256),
    latest_household_survey VARCHAR(256),
    src_of_most_recent_income_and_expend_data VARCHAR(256),
    vital_registration_complete VARCHAR(64),
    latest_agri_census VARCHAR(256),
    latest_indus_data VARCHAR(64),
    latest_trade_data VARCHAR(64),
    PRIMARY KEY (country_code)
);

-- 'series' Table ("WDISeries.csv")
-- 1443 rows x 20 columns
CREATE TABLE series (
    series_code VARCHAR(64) UNIQUE NOT NULL,
    topic VARCHAR(256) NOT NULL,
    indicator_name VARCHAR(256) UNIQUE NOT NULL,
    short_def TEXT,
    long_def TEXT,
    unit_of_measure VARCHAR(64),
    periodicity VARCHAR(64),
    base_period VARCHAR(64),
    other_notes VARCHAR(256),
    aggr_method VARCHAR(64),
    lim_and_exceps TEXT,
    notes_from_org_src TEXT,
    gen_comments TEXT,
    source TEXT,
    stat_concept_and_methodol TEXT,
    dev_relevance TEXT,
    rel_src_links VARCHAR(256),
    other_web_links VARCHAR(256),
    rel_indicators VARCHAR(256),
    license_type VARCHAR(256),
    PRIMARY KEY (series_code)
);

-- 'country_series' Table ("WDICountry-Series.csv")
-- 8003 rows x 3 columns
CREATE TABLE country_series (
    country_code CHAR(3) NOT NULL,
    series_code VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (country_code) REFERENCES country(country_code),
    FOREIGN KEY (series_code) REFERENCES series(series_code),
    PRIMARY KEY (country_code, series_code)
);

-- 'data' Table ("WDIData.csv")
-- 383838 rows x 65 columns
CREATE TABLE data (
    country_name VARCHAR(64) NOT NULL,
    country_code CHAR(3) NOT NULL,
    indicator_name VARCHAR(256) NOT NULL,
    indicator_code VARCHAR(64) NOT NULL,
    FOREIGN KEY (country_code) REFERENCES country(country_code),
    FOREIGN KEY (indicator_code) REFERENCES series(series_code),
    PRIMARY KEY (country_code, indicator_code)
);

-- Adding 61 new columns for years (1960-2020)
CREATE TABLE year_column (year INT);

INSERT INTO year_column(year)
SELECT serial
FROM generate_series(1960, 2020, 1) AS serial;

DO
$do$
	DECLARE col_names TEXT;
BEGIN
	FOR col_names IN SELECT year FROM year_column
	LOOP
		EXECUTE 'ALTER TABLE data ADD COLUMN yr' || col_names || ' FLOAT';
	END LOOP;
END;
$do$;

DROP TABLE year_column;


-- 'footnote' Table ("WDIFootNote.csv")
-- 686635 rows x 4 columns (-3 Rows after preprocessing)
CREATE TABLE footnote (
    country_code CHAR(3) NOT NULL,
    series_code VARCHAR(64) NOT NULL,
    year VARCHAR(6) NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (country_code) REFERENCES country(country_code),
    FOREIGN KEY (series_code) REFERENCES series(series_code),
    PRIMARY KEY (country_code, series_code, year)
);

-- 'series_time' Table ("WDISeries-time.csv")
-- 501 rows x 3 columns
CREATE TABLE series_time (
    series_code VARCHAR(64) NOT NULL,
    year VARCHAR(6) NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (series_code) REFERENCES series(series_code),
    PRIMARY KEY (series_code, year)
);


COPY country FROM '/data/WDICountry.csv' DELIMITER ',' CSV HEADER;
INSERT INTO country(country_code, short_name, table_name, long_name)
VALUES ('INX', 'Not classified', 'Not classified', 'Not classified');
COPY series FROM '/data/WDISeries.csv' DELIMITER ',' CSV HEADER;
COPY country_series FROM '/data/WDICountry-Series.csv' DELIMITER ',' CSV HEADER;
COPY data FROM '/data/WDIData.csv' DELIMITER ',' CSV HEADER;
COPY footnote FROM '/data/WDIFootNote.csv' DELIMITER ',' CSV HEADER;
COPY series_time FROM '/data/WDISeries-time.csv' DELIMITER ',' CSV HEADER;
