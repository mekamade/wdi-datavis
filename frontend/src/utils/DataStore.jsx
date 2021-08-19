import React, { createContext, useContext, useReducer } from 'react';

const DataStoreContext = createContext(null);

// Global State Data Store with useContext & useReduce

export function useDataStoreContext() {
    return useContext(DataStoreContext);
}

const initialState = {
    query: {
        indicator: null,
        countries: [],
        start_year: null,
        end_year: null,
        years: [],
        // year_stepper: 1
    },
    chart_data: [],
    table_data: [],
    settings: {
        chart_type: 'bar'
    }
}

function reducer(state, action) {
    switch (action.type) {
        case 'set_query_indicator':
            return {
                ...state,
                query: {
                    ...state.query,
                    indicator: action.payload
                }
            }
        case 'set_query_countries':
            return {
                ...state,
                query: {
                    ...state.query,
                    countries: action.payload
                }
            }
        case 'set_query_start_year':
            return {
                ...state,
                query: {
                    ...state.query,
                    start_year: action.payload
                }
            }
        case 'set_query_end_year':
            return {
                ...state,
                query: {
                    ...state.query,
                    end_year: action.payload
                }
            }
        // case 'set_query_year_stepper':
        //     return {
        //         ...state,
        //         query: {
        //             ...state.query,
        //             year_stepper: action.payload
        //         }
        //     }
        case 'set_query_years':
            return {
                ...state,
                query: {
                    ...state.query,
                    years: action.payload
                }
            }
        case 'set_chart_type':
            return {...state, settings: {chart_type: action.payload}}
        case 'set_table_data':
            return {
                ...state,
                table_data: action.payload
            }
        case 'set_chart_data':
            return {
                ...state,
                chart_data: action.payload
            }
        default: throw new Error("Valid Action Type must be specified.")

    }
}

export function DataStoreScope({children}) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <DataStoreContext.Provider value={[state, dispatch]}>
            {children}
        </DataStoreContext.Provider>
    )
}
