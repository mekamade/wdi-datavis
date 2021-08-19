import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useDataStoreContext } from 'utils/DataStore';
import Paper from '@material-ui/core/Paper';


// const useStyles = makeStyles({
//     table: {
//       minWidth: 650,
//     },
//   });

export default function DataTable() {
    const [state, dispatch] = useDataStoreContext();
    // const classes = useStyles();
    const options = { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    };

    return (
        <TableContainer component={Paper}>
        <Table aria-label="data table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Countries/Regions</strong></TableCell>
              {state.query.years.map((x) =>(
                  <TableCell align="right"><strong>{x.year}</strong></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* {state.table_data.map((row) => (
              <TableRow key={row.countryCode}>
                <TableCell component="th" scope="row">
                  {row.countryName} ({row.countryCode})
                </TableCell>
                {state.query.years.map((x) => (
                    
                    <TableCell align="right">
                      { row[`yr${x.year}`] ? Number(row[`yr${x.year}`]).toLocaleString('en', options) : "-" }
                      </TableCell>
                ))}
              </TableRow>
            ))} */}
          {state.query.countries.map((row) => {
            const data_row = state.table_data.filter(x => {return x.countryCode === row.countryCode})[0];
            return(
              <TableRow key={row.countryCode}>
                <TableCell component="th" scope="row">
                  {row.tableName} ({row.countryCode})
                </TableCell>
                {state.query.years.map((x) => (
                    
                    <TableCell align="right">
                      { (data_row !== undefined) ?
                      (data_row[`yr${x.year}`] ? Number(data_row[`yr${x.year}`]).toLocaleString('en', options) : "-" )
                      : ""
                      }
          </TableCell>
                ))}
              </TableRow>
          )})}
          </TableBody>
        </Table>
      </TableContainer>
    );
}