import React from "react";
import {
    Button,
    Container,
    Dialog,
    DialogContent,
    Grid,
    Slider,
    TextField,
    Typography,
    withStyles
} from "@material-ui/core";
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import MomentUtils from '@date-io/moment';
import {withRouter} from "react-router-dom";
import SlotPicker from "../utils/slot-picker";
import moment from "moment";
import InputAdornment from "@material-ui/core/InputAdornment";

const styles = theme => ({
    root: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    textField: {
        marginTop: theme.spacing(3)
    }
});

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.props.setBottomNav('search');
        this.state = {
            address: '',
            startDate: new Date(),
            endDate: moment(new Date()).add(1, 'd'),
            slots: 1,
            addressError: '',
            checkinTimeError: '',
            checkoutTimeError: '',
            openFilterDialog: false,
            filterPriceRange: [0, 100],
            filterDistanceRange: [0, 100]
        }
    }

    handleSearchButton() {
        if (this.state.address !== '') {
            const checkin = Math.round(new Date(this.state.startDate).getTime() / 1000);
            const checkout = Math.round(new Date(this.state.endDate).getTime() / 1000);
            if (moment(this.state.endDate) < moment(this.state.startDate).add(1, 'hours')) {
                this.setState({
                    checkoutTimeError: 'Select a checkout date at least an hour after checkin'
                })
            } else {
                this.props.history.push('/s/' + this.state.address + '/' + checkin + '/' + checkout + '/' + this.state.slots);
            }
        } else {
            this.setState({addressError: 'Please enter a location!'});
        }
    }

    handleAddressFieldChange(value) {
        this.setState({address: value});
        if (value === '') {
            this.setState({addressError: 'Please enter a location!'});
        } else {
            this.setState({addressError: ''});
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <Container maxWidth="xs" className={classes.root}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <Typography variant="h6" color="textPrimary">Let's find the perfect storage!</Typography>
                    <form noValidate autoComplete="off">
                        <TextField label="Address"
                                   variant="outlined"
                                   fullWidth
                                   value={this.state.address}
                                   placeholder="Via Roma 10, Turin"
                                   onChange={(e) => this.handleAddressFieldChange(e.target.value)}
                                   className={classes.textField}
                                   error={this.state.addressError !== ''}
                                   helperText={this.state.addressError}/>
                        <KeyboardDateTimePicker
                            fullWidth
                            error={this.state.checkinTimeError !== ''}
                            helperText={this.state.checkinTimeError}
                            minDate={new Date()}
                            invalidDateMessage="Invalid date format"
                            minDateMessage="You picked a date in the past!"
                            ampm={false}
                            inputVariant="outlined"
                            label="Start date"
                            format="DD/MM/YYYY HH:mm"
                            value={this.state.startDate}
                            onChange={(date) => this.setState({startDate: date})}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            className={classes.textField}
                        />
                        <KeyboardDateTimePicker
                            fullWidth
                            error={this.state.checkoutTimeError !== ''}
                            helperText={this.state.checkoutTimeError}
                            invalidDateMessage="Invalid date format."
                            minDateMessage="You picked a date before checkin!"
                            minDate={new Date(this.state.startDate)}
                            ampm={false}
                            inputVariant="outlined"
                            label="End date"
                            format="DD/MM/YYYY HH:mm"
                            value={this.state.endDate}
                            onChange={(date) => this.setState({endDate: date})}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            className={classes.textField}
                        />
                        <SlotPicker value={this.state.slots}
                                    handleSlotSelection={(slots) => this.setState({slots})}
                                    className={classes.textField}/>
                        <Button variant="contained"
                                color="secondary"
                                className={classes.textField}
                                fullWidth
                                onClick={() => this.setState({openFilterDialog: true})}>
                            Filters
                        </Button>
                        <Dialog fullWidth
                                maxWidth="sm"
                                onClose={() => this.setState({openFilterDialog: false})}
                                open={this.state.openFilterDialog}>
                            <DialogContent>
                                <Grid container justify="space-between">
                                    <Grid item direction="row">
                                        <Typography gutterBottom>
                                            <b>Price range</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">
                                            {this.state.filterPriceRange[0]}€ - {this.state.filterPriceRange[1]}€ per day
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Slider value={this.state.filterPriceRange}
                                        onChange={(e, newValue) => this.setState({filterPriceRange: newValue})}
                                        valueLabelDisplay="auto"/>

                                <Grid container justify="space-between">
                                    <Grid item direction="row">
                                        <Typography gutterBottom>
                                            <b>Distance from address</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">
                                            {this.state.filterDistanceRange[0]}km - {this.state.filterDistanceRange[1]}km
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Slider value={this.state.filterDistanceRange}
                                        onChange={(e, newValue) => this.setState({filterDistanceRange: newValue})}
                                        valueLabelDisplay="auto"/>

                                <Button variant="outlined"
                                        color="primary"
                                        fullWidth
                                        onClick={() => this.setState({openFilterDialog: false})}>
                                    Done
                                </Button>
                            </DialogContent>
                        </Dialog>
                        <Button variant="contained"
                                color="primary"
                                className={classes.textField}
                                fullWidth
                                onClick={() => this.handleSearchButton()}>
                            Search
                        </Button>
                    </form>
                </MuiPickersUtilsProvider>
            </Container>
        );
    }
}

export default withRouter(withStyles(styles)(Search));