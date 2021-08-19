import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default function Header(){
    return(
        <AppBar position="static" color="primary">
            <Container maxwidth="md">
                <Toolbar>
                    <Typography variant="h6" color="inherit">
                        <strong>
                            World Bank Data Visualizer
                        </strong>
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
}