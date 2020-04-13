import React from "react";
import {Card, CardActionArea, CardContent, Grid, Typography, withStyles, Divider} from "@material-ui/core";
import moment from "moment";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import {withRouter} from "react-router-dom";

const styles = theme => ({
    storagePhoto: {
        height: '100%',
        width: '100%',
        objectFit: 'cover'
    },
    icon: {
        marginRight: theme.spacing(1)
    },
    divider: {
        height: '20px',
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2)
    }
});

class BookingCard extends React.Component {
    render() {
        const {classes, booking} = this.props;
        const checkinDate = moment(booking.startDate).format('DD/MM/YYYY');
        const checkinHour = moment(booking.startDate).format('HH:mm');
        const checkoutDate = moment(booking.endDate).format('DD/MM/YYYY');
        const checkoutHour = moment(booking.endDate).format('HH:mm');
        return (
            <Card>
                <CardActionArea onClick={() => this.props.history.push(`/booking/${booking._id}`)}>
                    <CardContent>
                        <Typography variant="subtitle1" component="p" color="textPrimary" noWrap>
                            <b>{booking.storage.name}</b>
                        </Typography>
                        <Typography variant="body1" component="p" align="center">
                            <Grid container justify="center">
                                <Grid item>
                                    <DirectionsBikeIcon color="primary" className={classes.icon}/>
                                </Grid>
                                <Grid item>
                                    {booking.bookedSlots} bicycle{booking.bookedSlots > 1 ? 's' : ''}
                                </Grid>
                                <Grid item style={{alignSelf: 'center'}}>
                                    <Divider orientation="vertical" className={classes.divider} />
                                </Grid>
                                <Grid item>
                                    <EuroSymbolIcon color="primary" className={classes.icon}/>
                                </Grid>
                                <Grid item>
                                    {booking.amount}€
                                </Grid>
                            </Grid>
                        </Typography>
                        <Grid container alignItems="center">
                            <Grid item xs={5}>
                                <Typography variant="subtitle2" component="p" align="center">
                                    {checkinDate}
                                </Typography>
                                <Typography variant="subtitle2" component="p" align="center" color="textSecondary">
                                    {checkinHour}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" component="p" align="center" color="secondary">
                                    <ArrowForwardIosIcon/>
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography variant="subtitle2" component="p" align="center">
                                    {checkoutDate}
                                </Typography>
                                <Typography variant="subtitle2" component="p" align="center" color="textSecondary">
                                    {checkoutHour}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant="overline" component="p" color="secondary" align="center">
                            <b>{booking.status}</b>
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }
}

export default withRouter(withStyles(styles)(BookingCard));