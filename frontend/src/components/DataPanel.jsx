import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { DataStoreScope } from 'utils/DataStore';
import DataForm from 'components/widgets/DataForm';
import DataTable from 'components/widgets/DataTable';
import DataChart from 'components/widgets/DataChart';

const useStyles = makeStyles((theme) => ({
    root: {
        height: "calc(100vh - 64px)",
    },
    mainGrid: {
        height: "100%",
    },
    paper: {
        padding: theme.spacing(3),
        textAlign: 'center',
        minHeight: "100%",
        maxHeight: "100%",
        height: "100%",
        boxSizing: "border-box",
    },
}));

export default function DataPanel() {
    const classes = useStyles();

    return (
        <DataStoreScope>

        <div className={classes.root}>
            <Grid container className={classes.mainGrid}>
                <Grid item container xs={4}>
                    <Grid item xs={12}>
                        <Paper variant='outlined' square height="100%" className={classes.paper}>
                            <DataForm/>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid item container xs={8}>
                    <Grid item xs={12}>
                        <Paper variant='outlined' square className={classes.paper}>
                            <DataChart />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper variant='outlined' square className={classes.paper}>
                            <DataTable />
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </div>
        </DataStoreScope>

    );
}