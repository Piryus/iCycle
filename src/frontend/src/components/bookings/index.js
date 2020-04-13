import React from "react";
import {Box, Container, Grid, Typography, withStyles, CircularProgress} from "@material-ui/core";
import BookingCard from "./booking-card";
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import axios from 'axios';

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

class Bookings extends React.Component {
    constructor(props) {
        super(props);
        this.props.setBottomNav('bookings');
        this.state = {
            bookings: [],
            isLoading: true,
        }
    }

    async componentDidMount() {
        const bookings = await this.fetchBookings();
        this.setState({
            bookings,
            isLoading: false
        });
    }

    async fetchBookings() {
        const response = await axios.get('http://localhost:3000/bookings');
        return response.data.bookings;
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
                            <Grid item key={booking._id} xs={12}>
                                <BookingCard booking={booking}/>
                            </Grid>
                        )}
                    </Grid>
                    {this.state.bookings.length === 0 &&
                    <Box className={classes.textNoBooking}>
                        <SentimentVeryDissatisfiedIcon style={{fontSize: 200}} color="disabled"/>
                        <Typography variant="h6"
                                    component="p"
                                    color="textSecondary"
                                    align="center">You don't have any booking yet!</Typography>
                    </Box>
                    }
                </>
                }
            </Container>
        );
    }
}

export default withStyles(styles)(Bookings);