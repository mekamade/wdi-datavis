import pandas as pd
import os

def extract_csv(filepath):
    df = pd.read_csv(filepath, nrows=1)
    columns = df.columns.tolist()
    cols_to_use = columns[:len(columns)-1]
    df = pd.read_csv(filepath, usecols=cols_to_use)
    return df

tables = {
    'WDICountry': extract_csv("WDI_csv/WDICountry.csv"),
    'WDISeries': extract_csv("WDI_csv/WDISeries.csv"),
    'WDICountry-Series': extract_csv("WDI_csv/WDICountry-Series.csv"),
    'WDIData': extract_csv("WDI_csv/WDIData.csv"),
    'WDIFootNote': extract_csv("WDI_csv/WDIFootNote.csv"),
    'WDISeries-time': extract_csv("WDI_csv/WDISeries-time.csv")
}

for key in tables.keys():
    tables[key] = tables[key].applymap(lambda x: x.strip() if isinstance(x, str) else x)

tables['WDICountry']['Country Code'] = tables['WDICountry']['Country Code'].map(lambda x: x.upper())
tables['WDISeries']['Series Code'] = tables['WDISeries']['Series Code'].map(lambda x: x.upper())
tables['WDICountry-Series']['CountryCode'] = tables['WDICountry-Series']['CountryCode'].map(lambda x: x.upper())
tables['WDICountry-Series']['SeriesCode'] = tables['WDICountry-Series']['SeriesCode'].map(lambda x: x.upper())
tables['WDIData']['Country Code'] = tables['WDIData']['Country Code'].map(lambda x: x.upper())
tables['WDIData']['Indicator Code'] = tables['WDIData']['Indicator Code'].map(lambda x: x.upper())
tables['WDIFootNote']['CountryCode'] = tables['WDIFootNote']['CountryCode'].map(lambda x: x.upper())
tables['WDIFootNote']['SeriesCode'] = tables['WDIFootNote']['SeriesCode'].map(lambda x: x.upper())
tables['WDISeries-time']['SeriesCode'] = tables['WDISeries-time']['SeriesCode'].map(lambda x: x.upper())

tables['WDISeries-time']['Year'] = tables['WDISeries-time']['Year'].map(lambda x: x.lower())
tables['WDIFootNote']['Year'] = tables['WDIFootNote']['Year'].map(lambda x: x.lower())

tables['WDIFootNote'] = tables['WDIFootNote'].groupby(['CountryCode', 'SeriesCode', 'Year'])['DESCRIPTION'].apply(' '.join).reset_index()

if not os.path.exists('processed'):
    os.makedirs('processed')

for key in tables.keys():
    pathname = f'processed/{key}.csv'
    tables[key].to_csv(pathname, index=False)
