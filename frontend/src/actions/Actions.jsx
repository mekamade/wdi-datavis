// import { gql, useQuery } from '@apollo/client';

// const GET_ALL_COUNTRIES = gql`
//     query allCountries {
//         countryCode
//         tableName
//     }`;

// const GET_ALL_INDICATORS = gql`
//     query allIndicators {
//         seriesCode
//         indicatorName
//     }`;

// export function handleFormInit(state) {
//     const { loading, error, data } = useQuery(GET_ALL_COUNTRIES);
//     return {...state, reference: {...state.reference, all_countries: data}};
// }

// useRequest.js
// import { useQuery } from "react-query";
// import { GraphQLClient, gql } from "graphql-request";

// const API_URL = `0.0.0.0:5000/graphql`;

// const graphQLClient = new GraphQLClient(API_URL);

// export function useHandleFormInit(state) {
//   return useQuery("get-countries", async () => {
//     const { getCountryList } = await graphQLClient.request(gql`
//     query allCountries {
//         countryCode
//         tableName
//     }`);
//     return {...state, reference: {...state.reference, all_countries: getCountryList}};
// });
// }
