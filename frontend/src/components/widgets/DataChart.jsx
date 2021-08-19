import React from 'react';

import Typography from '@material-ui/core/Typography';
import { useDataStoreContext } from 'utils/DataStore';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { 
    LineChart, 
    XAxis, 
    YAxis, 
    BarChart, 
    Bar,
    ResponsiveContainer,
    CartesianGrid,
    Tooltip,
    Line,
    Legend,
 } from 'recharts';

import { randomRGB } from 'utils/Utils';
import TimelineIcon from '@material-ui/icons/Timeline';
import EqualizerIcon from '@material-ui/icons/Equalizer';
  
export default function DataChart() {
    const [state, dispatch] = useDataStoreContext();

    return (
        <React.Fragment>
            <Typography variant="h5">
                {state.query.indicator ? state.query.indicator.indicatorName : "No Indicator Selected"}
            </Typography>
            <Typography variant="h6">
                {state.query.indicator ? `(${state.query.indicator.seriesCode})` : " "}
            </Typography>            
                {state.settings.chart_type === 'bar' &&
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={
                        (state.chart_data.length !== 0 && state.query.start_year && state.query.end_year) ?
                            state.chart_data.slice(state.query.start_year.key, state.query.end_year.key+1)
                        : []
                        } 
                        margin={{ top: 20, right: 0, left: 30, bottom: 0 }}
                        >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {state.query.countries.map((x) => (
                        <Bar dataKey={x.countryCode} fill={randomRGB(x.countryCode)} />
                ))}
                    </BarChart>
                </ResponsiveContainer>

                }
                
                {state.settings.chart_type === 'line' &&
                <ResponsiveContainer width="100%" height="80%">
                    <LineChart data={
                        (state.chart_data.length !== 0 && state.query.start_year && state.query.end_year) ?
                            state.chart_data.slice(state.query.start_year.key, state.query.end_year.key+1)
                        : []
                        } 
                        margin={{ top: 20, right: 0, left: 30, bottom: 0 }}
                        >
                        <XAxis dataKey="year" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        {state.query.countries.map((x) => (
                        <Line type="monotone" dataKey={x.countryCode} stroke={randomRGB(x.countryCode)} />
                ))}
                    </LineChart>
                </ResponsiveContainer>
                }
                    <ToggleButtonGroup
                        value={state.settings.chart_type}
                        exclusive
                        onChange={(e, newValue) => {
                            if (newValue !== null) {
                                dispatch({type: 'set_chart_type', payload: newValue})
                            }
                        }}
                        aria-label="chart type"
                        >
                    <ToggleButton value="bar" aria-label="bar chart">
                        <EqualizerIcon />
                    </ToggleButton>
                    <ToggleButton value="line" aria-label="line chart">
                        <TimelineIcon />
                    </ToggleButton>
                    </ToggleButtonGroup>
        </React.Fragment>
        
    );
}