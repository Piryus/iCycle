import React from "react";
import {Avatar, Box, Button, Container, Divider, Grid, Typography, withStyles} from "@material-ui/core";
import Axios from "axios";
import EuroIcon from '@material-ui/icons/Euro';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import LocalParkingIcon from '@material-ui/icons/LocalParking';
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import SlotPicker from "../../utils/slot-picker";
import {Link} from "react-router-dom";
import moment from "moment";
import Map from "../../utils/map";

const styles = theme => ({
    storageImage: {
        height: '100px',
        width: '100%',
        objectFit: 'cover',
        marginBottom: theme.spacing(1)
    },
    infoBox: {
        marginTop: theme.spacing(1)
    },
    divider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    dateBox: {
        marginTop: theme.spacing(2)
    },
    bookingField: {
        marginTop: theme.spacing(2),
        zIndex: 0
    },
    ownerBox: {
        marginLeft: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
});

class Storage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setBottomNav('search');
        this.state = {
            storage: null,
            checkin: new Date(),
            checkout: new Date(),
            slots: 1,
            checkinTimeError: '',
            checkoutTimeError: '',
            price: 0
        }
    }

    computeTotalPrice(checkin, checkout, slots) {
        const {storage} = this.state;
        if (storage !== null) {
            const checkinMoment = moment(checkin);
            const checkoutMoment = moment(checkout);
            let totalPrice = 0;
            if (storage.priceFrequency === 'day') {
                totalPrice = checkoutMoment.diff(checkinMoment, 'minutes') / 24 / 60 * slots * storage.price;
            } else if (storage.priceFrequency === 'hour') {
                totalPrice = checkoutMoment.diff(checkinMoment, 'minutes') / 60 * slots * storage.price;
            }
            totalPrice = Math.round((totalPrice + Number.EPSILON) * 100) / 100;
            this.setState({price: totalPrice})
        }
    }

    async componentDidMount() {
        const {checkin, checkout, slots} = this.props.match.params;
        const storage = await this.fetchStorage();
        if (checkin && checkout && slots) {
            const checkinDate = new Date(checkin * 1000);
            const checkoutDate = new Date(checkout * 1000);
            this.setState({
                storage,
                checkin: checkinDate,
                checkout: checkoutDate,
                slots: Number(slots)
            });
            this.computeTotalPrice(checkinDate, checkoutDate, Number(slots));
        } else {
            this.setState({
                storage
            });
        }
    }

    async fetchStorage() {
        const {id} = this.props.match.params;
        const response = await Axios.get('http://localhost:3000/storage', {
            params: {
                id
            }
        });
        return response.data.storage;
    }

    handleCheckinChange(checkin) {
        if (!checkin.isValid()) {
            this.setState({
                checkinTimeError: 'Invalid date format'
            })
        } else {
            if (moment(this.state.checkout) < moment(checkin).add(1, 'hours')) {
                this.setState({
                    checkoutTimeError: 'Select a checkout date at least an hour after checkin'
                })
            } else {
                this.setState({
                    checkinTimeError: '',
                    checkoutTimeError: ''
                })
            }
            this.setState({checkin});
            this.computeTotalPrice(checkin, this.state.checkout, this.state.slots);
        }
    }

    handleCheckoutChange(checkout) {
        if (!checkout.isValid()) {
            this.setState({
                checkoutTimeError: 'Invalid date format'
            })
        } else {
            if (moment(checkout) < moment(this.state.checkin).add(1, 'hours')) {
                this.setState({
                    checkoutTimeError: 'Select a checkout date at least an hour after checkin'
                })
            } else {
                this.setState({
                    checkoutTimeError: ''
                })
            }
            this.setState({checkout});
            this.computeTotalPrice(this.state.checkin, checkout, this.state.slots);
        }
    }

    render() {
        const {classes} = this.props;
        const {checkin, checkout, slots, storage} = this.state;
        const checkinEpoch = Math.round(new Date(checkin).getTime() / 1000);
        const checkoutEpoch = Math.round(new Date(checkout).getTime() / 1000);
        let ratingAverage = 0;
        if (storage !== null) {
            storage.reviews.forEach(review => ratingAverage += review.rating);
            if (storage.reviews.length > 0)
                ratingAverage /= storage.reviews.length;
                ratingAverage = Math.round((ratingAverage + Number.EPSILON) * 100) / 100;
        }
        return (
            <>
                {storage !== null &&
                <>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        <Box>
                            <img
                                src={`http://localhost:3000/${storage.imagePath}`}
                                className={classes.storageImage}
                                alt={storage.name}
                            />
                        </Box>
                        <Container fluid maxWidth="xs" className={classes.root}>
                            <Typography variant="h5" component="h1"><b>{storage.name}</b></Typography>
                            <Grid container className={classes.infoBox}>
                                <Grid item>
                                    <Typography variant="body1" component="p">
                                        <Grid container>
                                            <Grid item>
                                                <EuroIcon/>
                                            </Grid>
                                            <Grid item>
                                                {storage.price}€ {storage.priceFrequency === 'day' ? 'per day' : 'per hour'}
                                            </Grid>
                                        </Grid>
                                    </Typography>
                                    <Typography variant="body1" component="p">
                                        <Grid container>
                                            <Grid item>
                                                <StarHalfIcon/>
                                            </Grid>
                                            {storage.reviews.length > 0 &&
                                            <Grid item>
                                                {ratingAverage}/5
                                                ({storage.reviews.length} review{storage.reviews.length > 1 ? 's' : ''})
                                            </Grid>
                                            }
                                            {storage.reviews.length === 0 &&
                                            <Grid item>
                                                No review yet!
                                            </Grid>
                                            }
                                        </Grid>
                                    </Typography>
                                    <Typography variant="body1" component="p">
                                        <Grid container>
                                            <Grid item>
                                                <LocalParkingIcon/>
                                            </Grid>
                                            <Grid item>
                                                3 free spaces
                                            </Grid>
                                        </Grid>
                                    </Typography>
                                </Grid>
                                <Grid item className={classes.ownerBox}>
                                    <Avatar alt={storage.owner.name}
                                            src={`http://localhost:3000/${storage.owner.picturePath}`}/>
                                    <Typography variant="caption"
                                                color="textSecondary">{storage.owner.name}</Typography>
                                </Grid>
                            </Grid>
                            <Divider variant="middle" className={classes.divider}/>
                            <Typography variant="h6">Description</Typography>
                            <Typography variant="body1" component="p">{storage.description}</Typography>

                            <Divider variant="middle" className={classes.divider}/>

                            <Typography variant="h6">Location</Typography>
                            <Map
                                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyB0okxLztMwm-VYp8sRJtQNsGUVvmEfgrs"
                                loadingElement={<div style={{height: `100%`}}/>}
                                containerElement={<div style={{height: `150px`}}/>}
                                mapElement={<div style={{height: `100%`}}/>}
                                center={storage.geometry}
                                marker={storage.geometry}
                            />
                            <Typography variant="caption" color="textSecondary">{storage.address}</Typography>

                            <Divider variant="middle" className={classes.divider}/>

                            <KeyboardDateTimePicker
                                fullWidth
                                error={this.state.checkinTimeError !== ''}
                                helperText={this.state.checkinTimeError}
                                minDate={new Date()}
                                invalidDateMessage="Invalid date format"
                                minDateMessage="You picked a date in the past!"
                                ampm={false}
                                inputVariant="outlined"
                                label="Checkin"
                                format="DD/MM/YYYY HH:mm"
                                value={checkin}
                                onChange={(checkin) => this.handleCheckinChange(checkin)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                className={classes.bookingField}
                            />
                            <KeyboardDateTimePicker
                                fullWidth
                                error={this.state.checkoutTimeError !== ''}
                                helperText={this.state.checkoutTimeError}
                                invalidDateMessage="Invalid date format."
                                minDateMessage="You picked a date before checkin!"
                                minDate={new Date(this.state.checkin)}
                                ampm={false}
                                inputVariant="outlined"
                                label="Checkout"
                                format="DD/MM/YYYY HH:mm"
                                value={checkout}
                                onChange={(checkout) => this.handleCheckoutChange(checkout)}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                className={classes.bookingField}
                            />
                            <SlotPicker value={slots}
                                        handleSlotSelection={(slots) => {
                                            this.setState({slots});
                                            this.computeTotalPrice(checkin, checkout, slots);
                                        }}
                                        className={classes.bookingField}/>
                            <Button variant="contained"
                                    color="primary"
                                    className={classes.bookingField}
                                    fullWidth
                                    component={Link}
                                    to={`/book/${storage._id}/${checkinEpoch}/${checkoutEpoch}/${slots}/`}>
                                Book ({this.state.price}€)
                            </Button>
                        </Container>
                    </MuiPickersUtilsProvider>
                </>
                }
            </>
        );
    }
}

export default withStyles(styles)(Storage);