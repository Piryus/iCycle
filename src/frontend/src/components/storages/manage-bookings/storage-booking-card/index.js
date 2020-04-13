import React from "react";
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    Typography,
    withStyles
} from "@material-ui/core";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import moment from "moment";
import axios from "axios";
import {withRouter} from "react-router-dom";

const styles = theme => ({
    card: {
        minWidth: '100%'
    },
    content: {
        marginTop: '-16px !important'
    },
    dates: {
        marginBottom: 16,
    },
    arrowIcon: {
        marginTop: 'auto',
        marginBottom: 'auto'
    }
});

class StorageBookingCard extends React.Component {
    async handleAccept(bookingId) {
        await axios.patch('http://localhost:3000/booking/', {
           bookingId,
           status: 'accepted'
        });
        await this.props.updateBookings();
    }

    async handleRefuse(bookingId) {
        await axios.patch('http://localhost:3000/booking/', {
            bookingId,
            status: 'refused'
        });
        await this.props.updateBookings();
    }

    render() {
        const {booking, classes} = this.props;
        const checkinDate = moment(booking.startDate).format('DD/MM/YYYY');
        const checkinHour = moment(booking.startDate).format('HH:mm');
        const checkoutDate = moment(booking.endDate).format('DD/MM/YYYY');
        const checkoutHour = moment(booking.endDate).format('HH:mm');
        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar alt={booking.booker.name} src={`http://localhost:3000/${booking.booker.picturePath}`}/>
                    }
                    title={booking.booker.name}
                    subheader={booking.storage.name}
                />
                <CardContent className={classes.content}>
                    {booking.status === 'refused' &&
                    <Typography variant="body1" color="error" align="center"><b>REFUSED</b></Typography>
                    }
                    {booking.status === 'accepted' &&
                    <Typography variant="body1" color="error" align="center"><b>ACCEPTED</b></Typography>
                    }
                    {booking.status === 'cancelled' &&
                    <Typography variant="body1" color="error" align="center"><b>CANCELLED</b></Typography>
                    }
                    <Grid container spacing={2} className={classes.dates}>
                        <Grid item xs={5}>
                            <Typography variant="h6" component="p" align="center">
                                Checkin
                            </Typography>
                            <Typography variant="subtitle2" component="p" align="center">
                                {checkinDate}
                            </Typography>
                            <Typography variant="subtitle2" component="p" align="center">
                                {checkinHour}
                            </Typography>
                        </Grid>
                        <Grid item xs={1} className={classes.arrowIcon}>
                            <ArrowForwardIcon/>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography variant="h6" component="p" align="center">
                                Checkout
                            </Typography>
                            <Typography variant="subtitle2" component="p" align="center">
                                {checkoutDate}
                            </Typography>
                            <Typography variant="subtitle2" component="p" align="center">
                                {checkoutHour}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="body2" color="textSecondary" component="p">
                        I'm looking for a storage for my nice bicycle. My number : +39 06 xxxxxxxx.
                    </Typography>
                </CardContent>
                {booking.status === 'pending' &&
                <CardActions>
                    <Button size="small" color="primary" onClick={async () => await this.handleAccept(booking._id)}>
                        Accept
                    </Button>
                    <Button size="small" color="primary" onClick={async () => await this.handleRefuse(booking._id)}>
                        Refuse
                    </Button>
                </CardActions>
                }
            </Card>
        );
    }
}

export default withRouter(withStyles(styles)(StorageBookingCard));