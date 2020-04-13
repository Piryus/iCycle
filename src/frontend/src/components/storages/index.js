import React from "react";
import {Button, CircularProgress, Container, Fab, withStyles} from "@material-ui/core";
import StorageCard from './storage-card';
import AddIcon from '@material-ui/icons/Add';
import {Link} from "react-router-dom";

const styles = theme => ({
    root: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    manageButton: {
        marginBottom: theme.spacing(1)
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(8),
        right: theme.spacing(2),
    },
    card: {
        marginBottom: theme.spacing(2),
        width: '100%'
    }
});

class Storages extends React.Component {
    constructor(props) {
        super(props);
        this.props.setBottomNav('storages');
        this.state = {
            storages: [],
            isLoading: true
        }
    }

    async componentDidMount() {
        const storages = await this.fetchStorages();
        this.setState({
            storages,
            isLoading: false
        });
    }

    async fetchStorages() {
        const url = 'http://localhost:3000/storages';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        const response = await fetch(url, options);
        return await response.json();
    }

    render() {
        const {classes} = this.props;
        return (
            <Container maxWidth="xs" className={classes.root}>
                {this.state.isLoading && <CircularProgress color="secondary" size={80}/>}
                {!this.state.isLoading &&
                <>
                    <Button className={classes.manageButton}
                            color="primary"
                            variant="contained"
                            component={Link}
                            to='/storages/bookings/'>Manage bookings</Button>
                    {this.state.storages.map(storage =>
                        <StorageCard key={storage._id} storage={storage} className={classes.card}/>
                    )}
                    <Fab className={classes.fab}
                         aria-label="Add storage"
                         color='primary'
                         component={Link}
                         to='/storages/new'>
                        <AddIcon/>
                    </Fab>
                </>
                }
            </Container>
        );
    }
}

export default withStyles(styles)(Storages);