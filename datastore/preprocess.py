import pandas as pd
import os

# Extract data from CSV by ignoring last column
def extract_csv(filepath):
    df = pd.read_csv(filepath, nrows=1)
    columns = df.columns.tolist()
    cols_to_use = columns[:len(columns)-1]
    df = pd.read_csv(filepath, usecols=cols_to_use)
    return df

def main():
    print("Loading CSV Files...")
    tables = {
        'WDICountry': extract_csv("WDI_csv/WDICountry.csv"),
        'WDISeries': extract_csv("WDI_csv/WDISeries.csv"),
        'WDICountry-Series': extract_csv("WDI_csv/WDICountry-Series.csv"),
        'WDIData': extract_csv("WDI_csv/WDIData.csv"),
        'WDIFootNote': extract_csv("WDI_csv/WDIFootNote.csv"),
        'WDISeries-time': extract_csv("WDI_csv/WDISeries-time.csv")
    }

    print("Removing stray trailing whitespaces on all data points...")
    # Remove stray trailing whitespaces on all data points
    for key in tables.keys():
        tables[key] = tables[key].applymap(lambda x: x.strip() if isinstance(x, str) else x)

    print("Ensuring all codes are uppercase...")
    # Make all Country/Indicator Codes upper case
    tables['WDICountry']['Country Code'] = tables['WDICountry']['Country Code'].map(lambda x: x.upper())
    tables['WDISeries']['Series Code'] = tables['WDISeries']['Series Code'].map(lambda x: x.upper())
    tables['WDICountry-Series']['CountryCode'] = tables['WDICountry-Series']['CountryCode'].map(lambda x: x.upper())
    tables['WDICountry-Series']['SeriesCode'] = tables['WDICountry-Series']['SeriesCode'].map(lambda x: x.upper())
    tables['WDIData']['Country Code'] = tables['WDIData']['Country Code'].map(lambda x: x.upper())
    tables['WDIData']['Indicator Code'] = tables['WDIData']['Indicator Code'].map(lambda x: x.upper())
    tables['WDIFootNote']['CountryCode'] = tables['WDIFootNote']['CountryCode'].map(lambda x: x.upper())
    tables['WDIFootNote']['SeriesCode'] = tables['WDIFootNote']['SeriesCode'].map(lambda x: x.upper())
    tables['WDISeries-time']['SeriesCode'] = tables['WDISeries-time']['SeriesCode'].map(lambda x: x.upper())

    print("Ensuring all year values are lowercase...")
    # Make all Year values lower case
    tables['WDISeries-time']['Year'] = tables['WDISeries-time']['Year'].map(lambda x: x.lower())
    tables['WDIFootNote']['Year'] = tables['WDIFootNote']['Year'].map(lambda x: x.lower())

    print("Patching duplicate primary keys...")
    # Group duplicate primary keys in the 'Footnote' table
    tables['WDIFootNote'] = tables['WDIFootNote'].groupby(['CountryCode', 'SeriesCode', 'Year'])['DESCRIPTION'].apply(' '.join).reset_index()

    print("Exporting...")
    # Export to processed 
    if not os.path.exists('processed'):
        os.makedirs('processed')

    for key in tables.keys():
        pathname = f'processed/{key}.csv'
        tables[key].to_csv(pathname, index=False)
    print("Preprocessing completed!")

if __name__ == "__main__":
    main()
