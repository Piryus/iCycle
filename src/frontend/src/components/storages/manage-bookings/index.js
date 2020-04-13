import React from "react";
import {Box, CircularProgress, Typography, withStyles} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import StorageBookingCard from "./storage-booking-card";
import axios from "axios";
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

const styles = theme => ({
    root: {
        marginTop: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center'
    },
    textNoBooking: {
        marginTop: theme.spacing(5),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }
});

class ManageBookings extends React.Component {
    constructor(props) {
        super(props);
        this.props.setBottomNav('storages');
        this.state = {
            bookings: [],
            isLoading: true
        }
    }

    async componentDidMount() {
        const storageId = this.props.match.params.storageId;
        let bookings = await this.fetchBookings();
        if (storageId !== undefined) {
            bookings = bookings.filter((booking) => {
                return booking.storage._id === storageId;
            })
        }
        bookings = bookings.filter((booking) => {
            return booking.booker._id !== '5debe9f875d521ba44b677aa';
        });
        this.setState({
            bookings,
            isLoading: false
        });
    }

    async fetchBookings() {
        const response = await axios.get('http://localhost:3000/storages-bookings', {
            params: {
                storageId: this.props.match.params.storageId
            }
        });
        return response.data.bookings;
    }

    async updateBookings() {
        const storageId = this.props.match.params.storageId;
        let bookings = await this.fetchBookings();
        if (storageId !== undefined) {
            bookings = bookings.filter((booking) => {
                return booking.storage._id === storageId;
            })
        }
        bookings = bookings.filter((booking) => {
            return booking.booker._id !== '5debe9f875d521ba44b677aa';
        });
        this.setState({bookings});
    }

    render() {
        const {classes} = this.props;
        return (
            <Container maxWidth="xs" className={classes.root}>
                {this.state.isLoading && <CircularProgress color="secondary" size={80}/>}
                {!this.state.isLoading &&
                <>
                    <Grid container spacing={2}>
                        {this.state.bookings.map(booking =>
                            <Grid item xs={12} key={booking._id}>
                                <StorageBookingCard booking={booking}
                                                    updateBookings={async () => await this.updateBookings()}/>
                            </Grid>
                        )}
                    </Grid>
                    {this.state.bookings.length === 0 &&
                    <Box className={classes.textNoBooking}>
                        <SentimentVeryDissatisfiedIcon style={{fontSize: 200}} color="disabled"/>
                        <Typography variant="h6"
                                    component="p"
                                    color="textSecondary"
                                    align="center">
                            {this.props.match.params.storageId !== undefined && "There isn't any booking for this storage!"}
                            {this.props.match.params.storageId === undefined && "Your storages don't have any bookings yet!"}
                        </Typography>
                    </Box>
                    }
                </>
                }
            </Container>
        );
    }
}

export default withStyles(styles)(ManageBookings);