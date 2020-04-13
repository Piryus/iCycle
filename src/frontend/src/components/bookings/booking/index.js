import React from "react";
import {
    Avatar,
    Box,
    Button,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    TextField,
    Typography,
    withStyles
} from "@material-ui/core";
import axios from "axios";
import {withRouter} from "react-router-dom";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Rating from "@material-ui/lab/Rating";
import FavoriteIcon from "@material-ui/icons/Favorite";

const styles = theme => ({
    root: {
        marginTop: theme.spacing(2)
    },
    storageImage: {
        height: '100px',
        width: '100%',
        objectFit: 'cover',
        marginBottom: theme.spacing(1)
    },
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    },
    storageTitle: {
        marginBottom: theme.spacing(1)
    },
    sectionTitle: {
        marginBottom: theme.spacing(1)
    },
    status: {
        fontSize: '20px'
    },
    boxCenter: {
        display: 'flex',
        justifyContent: 'center'
    },
    avatar: {
        backgroundColor: theme.palette.primary.main
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    fullWidth: {
        width: '100%'
    }
});

const StyledRating = withStyles({
    iconFilled: {
        color: '#ff394d',
    },
    iconHover: {
        color: '#ff0024',
    },
})(Rating);

class Booking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            booking: null,
            openReviewDialog: false,
            reviewRating: 0,
            reviewComment: ''
        };
    }

    async componentDidMount() {
        const booking = await this.fetchBooking();
        this.setState({booking});
    }

    async fetchBooking() {
        const {id} = this.props.match.params;
        const response = await axios.get('http://localhost:3000/booking', {
            params: {
                id
            }
        });
        return response.data.booking;
    }

    async cancelBooking() {
        await axios.patch('http://localhost:3000/booking/', {
            bookingId: this.state.booking._id,
            status: 'cancelled'
        });
        const booking = await this.fetchBooking();
        this.setState({booking});
    }

    async sendReview() {
        await axios.post('http://localhost:3000/review/', {
            bookingId: this.state.booking._id,
            rating: this.state.reviewRating,
            comment: this.state.reviewComment
        });
        const booking = await this.fetchBooking();
        this.setState({
            openReviewDialog: false,
            booking
        });
    }

    render() {
        const {classes} = this.props;
        const {booking} = this.state;
        let checkinDate, checkinHour, checkoutDate, checkoutHour;
        if (booking !== null) {
            checkinDate = moment(booking.startDate).format('DD/MM/YYYY');
            checkinHour = moment(booking.startDate).format('HH:mm');
            checkoutDate = moment(booking.endDate).format('DD/MM/YYYY');
            checkoutHour = moment(booking.endDate).format('HH:mm');
        }

        return (
            <>
                {booking !== null &&
                <>
                    <Box>
                        <img
                            src={`http://localhost:3000/${booking.storage.imagePath}`}
                            className={classes.storageImage}
                            alt={booking.storage.name}
                        />
                    </Box>
                    <Container maxWidth="xs">
                        <Typography variant="h5" component="h1"
                                    className={classes.storageTitle}><b>{booking.storage.name}</b></Typography>
                        <Typography variant="overline" color="primary" align="center" display="block"
                                    className={classes.status}>{booking.status}</Typography>
                        <Box className={classes.boxCenter}>
                            <Button variant="outlined"
                                    color="secondary"
                                    onClick={() => {
                                        const checkinEpoch = Math.round(new Date(booking.startDate).getTime() / 1000);
                                        const checkoutEpoch = Math.round(new Date(booking.endDate).getTime() / 1000);
                                        this.props.history.push(`/storage/${booking.storage._id}/${checkinEpoch}/${checkoutEpoch}/${booking.bookedSlots}`)
                                    }}>
                                Storage page
                            </Button>
                        </Box>
                        <Typography variant="h6" component="h2">Dates</Typography>
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

                        <Divider variant="middle" className={classes.divider}/>

                        <Typography variant="h6" component="h2">Cost</Typography>
                        <Grid container alignItems="center">
                            <Grid item xs={5}>
                                <Typography variant="subtitle1" component="p"
                                            align="center">{booking.bookedSlots} bicycle{booking.bookedSlots > 1 ? 's' : ''}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Typography variant="subtitle2" component="p" align="center" color="secondary">
                                    <ArrowForwardIosIcon/>
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography variant="subtitle1" component="p"
                                            align="center">{booking.amount}€</Typography>
                            </Grid>
                        </Grid>

                        <Divider variant="middle" className={classes.divider}/>

                        <Typography variant="h6" component="h2">Owner</Typography>
                        <Grid container direction='column' alignItems='center' spacing={1}>
                            <Grid item>
                                <Avatar className={classes.avatar}
                                        alt={booking.storage.owner.name}
                                        src={`http://localhost:3000/${booking.storage.owner.picturePath}`}/>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1"
                                            align="center">{booking.storage.owner.name} {booking.storage.owner.surname}</Typography>
                                <Typography variant="caption" align="center"
                                            display="block">{booking.storage.owner.email}</Typography>
                                <Typography variant="caption" align="center"
                                            display="block">{booking.storage.owner.phone}</Typography>
                            </Grid>
                        </Grid>

                        {booking.status !== 'cancelled' &&
                        <Box className={classes.boxCenter} mt={2}>
                            {booking.status !== 'cancelled' && booking.status !== 'refused' &&
                            moment(booking.startDate).isAfter(Date.now(), 'minute') &&
                            <Button variant="outlined"
                                    color="secondary"
                                    onClick={async () => {
                                        await this.cancelBooking();
                                    }}>
                                Cancel your booking...
                            </Button>
                            }
                            {moment(booking.startDate).isBefore(Date.now(), 'minute') && !booking.reviewLeft &&
                                <Button variant="outlined"
                                        color="secondary"
                                        onClick={async () => {
                                            this.setState({openReviewDialog: true});
                                        }}>
                                    Add a review...
                                </Button>
                            }
                        </Box>
                        }

                        <Dialog open={this.state.openReviewDialog}
                                fullWidth
                                maxWidth="sm"
                                onClose={() => this.setState({openReviewDialog: false})}>
                            <DialogTitle>
                                <Typography variant="h6">Leave a review</Typography>
                                <IconButton className={classes.closeButton}
                                            onClick={() => this.setState({openReviewDialog: false})}>
                                    <CloseIcon/>
                                </IconButton>
                            </DialogTitle>
                            <DialogContent dividers>
                                <Grid container direction="column" alignItems="center" spacing={2}>
                                    <Grid item className={classes.fullWidth}>
                                        <TextField variant="outlined"
                                                   value={this.state.reviewComment}
                                                   onChange={(e) => this.setState({reviewComment: e.target.value})}
                                                   fullWidth
                                                   multiline
                                                   rows="4"
                                                   placeholder={`Tell us about your experience with ${booking.storage.owner.name} at ${booking.storage.name}...`}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <StyledRating value={this.state.reviewRating}
                                                      icon={<FavoriteIcon fontSize="inherit"/>}
                                                      size="large"
                                                      onChange={(e, newValue) => this.setState({reviewRating: newValue})}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained"
                                                color="primary"
                                                onClick={async () => await this.sendReview()}>
                                            Send review
                                        </Button>
                                    </Grid>
                                </Grid>
                            </DialogContent>
                        </Dialog>
                    </Container>
                </>
                }
            </>
        );
    }
}

export default withRouter(withStyles(styles)(Booking));
