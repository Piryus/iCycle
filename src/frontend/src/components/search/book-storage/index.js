import React from "react";
import {
    Box,
    Button,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    withStyles,
    Tooltip
} from "@material-ui/core";
import Axios from "axios";
import {withRouter} from "react-router-dom";
import Moment from 'moment';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import EventIcon from '@material-ui/icons/Event';
import LocalParkingIcon from '@material-ui/icons/LocalParking';
import LockIcon from '@material-ui/icons/Lock';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const styles = theme => ({
    storageImage: {
        height: '100px',
        width: '100%',
        objectFit: 'cover',
        marginBottom: theme.spacing(1)
    },
    divider: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    bookingField: {
        marginTop: theme.spacing(2),
        zIndex: 0
    },
    totalPrice: {
        marginLeft: 'auto'
    },
    arrowIcon: {
        marginTop: 'auto',
        marginBottom: 'auto'
    }
});

class BookStorage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setBottomNav('search');
        this.state = {
            storage: null,
            checkin: new Date(),
            checkout: new Date(),
            slots: 1,
            paymentMethod: 'paypal',
            subtotalPrice: 0,
            totalPrice: 0
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
                slots
            });
            this.computePrices(checkinDate, checkoutDate, slots);
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

    async bookStorage() {
        const {storage, checkin, checkout, slots, totalPrice} = this.state;
        const response = await Axios.post('http://localhost:3000/booking', {
            storageId: storage._id,
            checkin,
            checkout,
            slots,
            price: totalPrice
        });
        if (response.data.success)
            this.props.history.push('/bookings');
    }

    computePrices(checkin, checkout, slots) {
        const {storage} = this.state;
        if (storage !== null) {
            const checkinMoment = Moment(checkin);
            const checkoutMoment = Moment(checkout);
            let subtotalPrice = 0;
            if (storage.priceFrequency === 'day') {
                subtotalPrice = checkoutMoment.diff(checkinMoment, 'minutes') / 24 / 60 * slots * storage.price;
            } else if (storage.priceFrequency === 'hour') {
                subtotalPrice = checkoutMoment.diff(checkinMoment, 'minutes') / 60 * slots * storage.price;
            }
            subtotalPrice = Math.round((subtotalPrice + Number.EPSILON) * 100) / 100;
            this.setState({
                subtotalPrice,
                totalPrice: subtotalPrice + 1
            })
        }
    }

    render() {
        const {classes} = this.props;
        const {checkin, checkout, storage, slots} = this.state;
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        return (
            <>
                {this.state.storage !== null &&
                <>
                    <Box>
                        <img
                            src={`http://localhost:3000/${storage.imagePath}`}
                            className={classes.storageImage}
                            alt={storage.name}
                        />
                    </Box>
                    <Container fluid maxWidth="xs" className={classes.root}>
                        <Typography variant="h5" component="h1"><b>{storage.name}</b></Typography>
                        <Divider variant="middle" className={classes.divider}/>

                        <Typography variant="body1">
                            <Grid container spacing={1}>
                                <Grid item><EventIcon/></Grid>
                                <Grid item>{Moment(checkinDate).format('DD/MM HH:mm')}</Grid>
                                <Grid item><ArrowForwardIcon/></Grid>
                                <Grid item>{Moment(checkoutDate).format('DD/MM HH:mm')}</Grid>
                            </Grid>
                        </Typography>

                        <Typography variant="body1">
                            <Grid container spacing={1}>
                                <Grid item><LocalParkingIcon/></Grid>
                                <Grid item>{this.state.slots} slots</Grid>
                            </Grid>
                        </Typography>

                        <Divider variant="middle" className={classes.divider}/>

                        <Typography variant="h6">Cost</Typography>
                        <Grid container>
                            <Grid item>
                                <Typography variant={"body1"}>Subtotal ({storage.price}€ per {storage.priceFrequency} x {slots} slots)</Typography>
                                <Typography variant={"body1"}>Booking fees</Typography>
                                <Typography variant={"body1"}><b>Total</b></Typography>
                            </Grid>
                            <Grid item className={classes.totalPrice}>
                                <Typography variant={"body1"} color="textSecondary">{this.state.subtotalPrice}€</Typography>
                                <Typography variant={"body1"} color="textSecondary">1€</Typography>
                                <Typography variant={"body1"}><b>{this.state.totalPrice}€</b></Typography>
                            </Grid>
                        </Grid>
                        <Divider variant="middle" className={classes.divider}/>

                        <Typography variant="h6">Payment method</Typography>
                        <FormControl component="fieldset">
                            <RadioGroup arialabel="payment-method"
                                        value={this.state.paymentMethod}
                                        onChange={(e) => this.setState({paymentMethod: e.target.value})}>
                                <FormControlLabel value="cash" control={<Radio/>} label="Cash"/>
                                <FormControlLabel value="paypal" control={<Radio/>} label="PayPal"/>
                                <FormControlLabel value="card" control={<Radio/>} label="Credit card"/>
                            </RadioGroup>
                        </FormControl>

                        {this.state.paymentMethod === 'card' &&
                        <>
                            <TextField
                                className={classes.bookingField}
                                fullWidth
                                label="Card number"
                                value={this.state.cardNumber}
                                onChange={(e) => this.setState({cardNumber: e.target.value})}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton edge="end">
                                            <LockIcon/>
                                        </IconButton>
                                    </InputAdornment>,
                                }}
                            />
                            <TextField
                                className={classes.bookingField}
                                fullWidth
                                label="Name on card"
                                value={this.state.cardName}
                                onChange={(e) => this.setState({cardName: e.target.value})}
                                variant="outlined"
                            />
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <TextField
                                        className={classes.bookingField}
                                        label="MM/YY"
                                        value={this.state.cardExpiration}
                                        onChange={(e) => this.setState({cardExpiration: e.target.value})}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        className={classes.bookingField}
                                        label="CVV"
                                        value={this.state.cardCvv}
                                        onChange={(e) => this.setState({cardCvv: e.target.value})}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </>
                        }

                        <Button variant="contained"
                                color="primary"
                                className={classes.bookingField}
                                fullWidth
                                onClick={() => this.bookStorage()}
                        >
                            Finalize booking
                        </Button>
                    </Container>
                </>
                }
            </>
        );
    }
}

export default withRouter(withStyles(styles)(BookStorage));