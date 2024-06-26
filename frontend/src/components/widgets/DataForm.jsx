import React, { useState, useEffect } from 'react';

import Alert from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ShareIcon from '@material-ui/icons/Share';            
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

import qs from "qs";
import { createBrowserHistory } from "history";
import { useQuery, useLazyQuery } from '@apollo/client';

import { generateYearList } from 'utils/Utils';
import { GET_DATA, GET_FORM_DATA } from 'utils/GraphQL';
import { useDataStoreContext } from 'utils/DataStore';

// Defining range of year selection
const MIN_YEAR = 1960;
const MAX_YEAR = 2020;

const useStyles = makeStyles((theme) => ({
    typography: {
      padding: theme.spacing(2),
    },
  }));
  

export default function DataForm() {
    const classes = useStyles();
    const [state, dispatch] = useDataStoreContext();
    const history = createBrowserHistory();

    const [formData, setFormData] = useState({
        allCountries: [],
        allIndicators: []
    });
    const {error} = useQuery(GET_FORM_DATA, {
        onCompleted: data => setFormData(data)
    });
    const [ getGraphData, { data } ] = useLazyQuery(GET_DATA);
    const allYearOptions = generateYearList({startYear: MIN_YEAR, endYear: MAX_YEAR})
    const [startYearOptions, setStartYearOptions] = useState(allYearOptions)
    const [endYearOptions, setEndYearOptions] = useState(allYearOptions)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    // Interpret parameters from URL
    useEffect(() => {
        const filterParams = history.location.search.substr(1);
        const params = qs.parse(filterParams);
        if (params.ind) {
            const indicator = formData.allIndicators.filter(x => {return x.seriesCode === params.ind})[0];
            if (indicator) {
                dispatch({type: 'set_query_indicator', payload: indicator});
            }
        }
        if (params.ctry) {
            const country_codes = params.ctry.split(',');
            const countries = country_codes.map((code) => (formData.allCountries.filter(x => {return x.countryCode === code})[0]));
            if (!countries.includes(undefined)){
                dispatch({type: 'set_query_countries', payload: countries});
            }
        }
        if (params.start) {
            const start_year = Number(params.start)
            if (MIN_YEAR <= start_year && start_year <= MAX_YEAR){
                dispatch({type: 'set_query_start_year', payload: {
                    key: start_year-MIN_YEAR, year: start_year
                }});
            }
        }
        if (params.end) {
            const end_year = Number(params.end)
            if (MIN_YEAR <= end_year && end_year <= MAX_YEAR){
                dispatch({type: 'set_query_end_year', payload: {
                    key: end_year-MIN_YEAR, year: end_year
                }});
            }
        }
        if (params.start && params.end) {
            if (Number(params.end) < Number(params.start)){
                dispatch({type: 'set_query_start_year', payload: null});
                dispatch({type: 'set_query_end_year', payload: null});
            }
        }
        if (params.chart) {
            if (['line', 'bar'].includes(params.chart)){
                dispatch({type: 'set_chart_type', payload: params.chart});
            }
        }
    }, [formData]);

    // Update options for end year, once start year is selected. 
    useEffect(() => {
        if (state.query.start_year) {
            setEndYearOptions(allYearOptions.slice(state.query.start_year.key))
        } else {
            setEndYearOptions(allYearOptions)
        }
    }, [state.query.start_year])

    // Update options for start year, once end year is selected. 
    useEffect(() => {
        if (state.query.end_year) {
            setStartYearOptions(allYearOptions.slice(0, state.query.end_year.key+1))
        } else {
            setStartYearOptions(allYearOptions)
        }
    }, [state.query.end_year])

    // Fetch indicatorData when indicatorCode / countries is modified & is valid.
    useEffect(() => {
        if (state.query.indicator && state.query.countries){
            const payload = { 
                variables: {
                    indicatorCode: state.query.indicator.seriesCode,
                    countryCodes: state.query.countries.map(x => x.countryCode)
                }
            };
            getGraphData(payload);
        } else {
            dispatch({type: 'set_table_data', payload: []});
            dispatch({type: 'set_chart_data', payload: []});
        }
    }, [state.query.indicator, state.query.countries])

    // Once data is returned from fetch, process it and store it in table_data & chart_data. 
    useEffect(() => {
        if (data) {
            let chart_data = generateYearList({startYear: MIN_YEAR, endYear: MAX_YEAR});
            chart_data.forEach(function (element) {
                data.indicatorData.map(x => element[x.countryCode] = x[`yr${element.year}`])
            });
            dispatch({type: 'set_table_data', payload: data.indicatorData})
            dispatch({type: 'set_chart_data', payload: chart_data})
        }
    }, [data])

    // If start year / end year is modified, update range of years. 
    useEffect(() => {
        if (state.query.start_year && state.query.end_year) {
            const payload = allYearOptions.slice(state.query.start_year.key, state.query.end_year.key+1)
            dispatch({type: 'set_query_years', payload: payload})
        } else {
            dispatch({type: 'set_query_years', payload: []})
        }
    }, [state.query.start_year, state.query.end_year])

    // Generate share url from global state. 
    const generateUrl = (event) => {
        const baseUrl = window.location.origin;
        const indicatorCode = state.query.indicator.seriesCode;
        const countryCodes = state.query.countries.map((x) => x.countryCode).join(',');
        const startYear = state.query.start_year.year;
        const endYear = state.query.end_year.year;
        const chartType = state.settings.chart_type;
        const url = `${baseUrl}/?ind=${indicatorCode}&ctry=${countryCodes}&start=${startYear}&end=${endYear}&chart=${chartType}`
        navigator.clipboard.writeText(url);
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
      };

    return (
        <React.Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                <Typography variant="h5">
                <strong>World Development Indicators</strong>
            </Typography>
            <Typography variant="h6">
                across various countries & regions <br /> ({MIN_YEAR}-{MAX_YEAR})
            </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        autoHighlight
                        options={formData.allIndicators}
                        getOptionLabel={(option) => ( option ? option.indicatorName : "")}
                        getOptionSelected={(option, value) =>(option.seriesCode === value.seriesCode) }
                        fullWidth
                        value={state.query.indicator}
                        onChange={(e, newValue) => {
                            dispatch({type: 'set_query_indicator', payload: newValue})
                        }}
                        renderInput={(params) =>
                            <TextField
                                label="Indicator Name"
                                variant="outlined"
                                {...params}
                            />
                        }
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        multiple
                        value={state.query.countries}
                        onChange={(event, newValue) => {
                            dispatch({type: 'set_query_countries', payload: newValue});
                        }}
                        options={formData.allCountries}
                        getOptionLabel={(option) => ( option ? option.tableName : "")}
                        renderTags={(tagValue, getTagProps) =>
                            tagValue.map((option, index) => (
                                <Chip
                                    label={option.tableName}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        fullWidth
                        renderInput={(params) => (
                            <TextField
                                label="Countries/Regions"
                                variant="outlined"
                                {...params}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Autocomplete
                        options={startYearOptions}
                        getOptionLabel={(option) => option.year.toString()}
                        getOptionSelected={(option, value) =>(option.year === value.year) }
                        fullWidth
                        value={state.query.start_year}
                        onChange={(event, newValue) => {
                            dispatch({type: 'set_query_start_year', payload: newValue})
                        }}
                        renderInput={(params) =>
                            <TextField
                                label="Start Year"
                                variant="outlined"
                                {...params}
                            />
                        }
                    />
                </Grid>
                <Grid item xs={6}>
                    <Autocomplete
                        options={endYearOptions}
                        getOptionLabel={(option) => option.year.toString()}
                        getOptionSelected={(option, value) =>(option.year === value.year) }
                        fullWidth
                        value={state.query.end_year}
                        onChange={(event, newValue) => {
                            dispatch({type: 'set_query_end_year', payload: newValue})
                        }}
                        renderInput={(params) =>
                            <TextField
                                label="End Year"
                                variant="outlined"
                                {...params}
                            />
                        }
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button disabled={!(state.query.indicator && state.query.countries.length && state.query.start_year && state.query.end_year)} onClick={generateUrl} style={{minHeight: '56px'}} fullWidth size='large' variant="outlined" color="default" startIcon={<ShareIcon />} >
                    Share Chart
                        </Button>

                </Grid>
                <Grid item xs={6}>
                <Button style={{minHeight: '56px'}} fullWidth size='large' variant="contained" color="primary" disabled
                startIcon={<TrendingUpIcon />} 
                >
                    Auto Build
                </Button>
                </Grid>
                <Grid item xs={12}>
                {error &&
                <Alert severity="error">
                    Unable to connect to the API server.
                    </Alert>}
                </Grid>
            </Grid>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
            <Typography className={classes.typography}>Copied! 🎉</Typography>
        </Popover>
            </React.Fragment>

    );
}