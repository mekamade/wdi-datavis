import { gql } from '@apollo/client';
// List of GraphQL queries

export const GET_FORM_DATA = gql`
    query {
        allCountries {
            countryCode
            tableName
        }
        allIndicators {
            seriesCode
            indicatorName
        }
    }`;


export const GET_DATA = gql`
    query (
        $indicatorCode: String!
        $countryCodes: [String!]!
    ) {
        indicatorData (
            indicatorCode: $indicatorCode
            countryCodes: $countryCodes
        ) {
            countryCode
            countryName
            yr1960
            yr1961
            yr1962
            yr1963
            yr1964
            yr1965
            yr1966
            yr1967
            yr1968
            yr1969
            yr1970
            yr1971
            yr1972
            yr1973
            yr1974
            yr1975
            yr1976
            yr1977
            yr1978
            yr1979
            yr1980
            yr1981
            yr1982
            yr1983
            yr1984
            yr1985
            yr1986
            yr1987
            yr1988
            yr1989
            yr1990
            yr1991
            yr1992
            yr1993
            yr1994
            yr1995
            yr1996
            yr1997
            yr1998
            yr1999
            yr2000
            yr2001
            yr2002
            yr2003
            yr2004
            yr2005
            yr2006
            yr2007
            yr2008
            yr2009
            yr2010
            yr2011
            yr2012
            yr2013
            yr2014
            yr2015
            yr2016
            yr2017
            yr2018
            yr2019
            yr2020
        }
    }`;