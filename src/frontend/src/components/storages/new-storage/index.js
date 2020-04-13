import React from "react";
import {withStyles} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {withRouter} from "react-router-dom";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Axios from "axios";
import SlotPicker from "../../utils/slot-picker";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

const styles = theme => ({
    root: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    textField: {
        marginTop: theme.spacing(3)
    },
    divider: {
        height: 28,
        margin: 4,
    }
});

class NewStorage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setBottomNav('storages');
        this.state = {
            name: '',
            address: '',
            price: '',
            priceFrequency: '',
            slots: 1,
            description: '',
            image: null,
            nameError: '',
            descriptionError: '',
            addressError: '',
            priceError: '',
            frequencyError: ''
        }
    }

    async createStorage() {
        let error = false;
        if (this.state.name === '') {
            this.setState({
                nameError: 'Please enter a name for your storage.'
            });
            error = true;
        }
        if (this.state.description === '') {
            this.setState({
                descriptionError: 'Please enter a description for your storage.'
            });
            error = true;
        }
        if (this.state.address === '') {
            this.setState({
                addressError: 'Please enter an address for your storage.'
            });
            error = true;
        }
        if (this.state.price === '' || isNaN(this.state.price)) {
            this.setState({
                priceError: 'Please enter a price for your storage.'
            });
            error = true;
        }
        if (this.state.priceFrequency === '') {
            this.setState({
                frequencyError: 'Please enter a frequency for the price.'
            });
            error = true;
        }
        if (this.state.image === null) {
            this.setState({
                imageError: 'Please insert a photo for your storage.'
            });
            error = true;
        }
        if (!error) {
            let formData = new FormData();
            formData.set('name', this.state.name);
            formData.set('description', this.state.description);
            formData.set('price', this.state.price);
            formData.set('priceFrequency', this.state.priceFrequency);
            formData.set('address', this.state.address);
            formData.set('slots', this.state.slots);
            formData.append('image', this.state.image);
            const response = await Axios.post('http://localhost:3000/storages/new', formData);
            if (response.data.success) {
                this.props.history.goBack();
            }
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <Container maxWidth="xs" className={classes.root}>
                <form noValidate autoComplete="off">
                    <TextField label="Name"
                               variant="outlined"
                               fullWidth
                               value={this.state.name}
                               onChange={(e) => this.setState({
                                   nameError: e.target.value === '' ? 'Please enter a name for your storage.' : '',
                                   name: e.target.value
                               })}
                               error={this.state.nameError !== ''}
                               helperText={this.state.nameError || "A name describing your storage and/or its location"}/>
                    <TextField label="Description"
                               multiline
                               rows="4"
                               className={classes.textField}
                               value={this.state.description}
                               onChange={(e) => this.setState({
                                   descriptionError: e.target.value === '' ? 'Please enter a description for your storage.' : '',
                                   description: e.target.value
                               })}
                               placeholder="Describe your storage, its location, if it's locked, who has access to it apart from you, ..."
                               variant="outlined"
                               fullWidth
                               error={this.state.descriptionError !== ''}
                               helperText={this.state.descriptionError}
                    />
                    <TextField label="Address"
                               variant="outlined"
                               fullWidth
                               value={this.state.address}
                               placeholder="Via Roma 10, Turin"
                               onChange={(e) => this.setState({
                                   addressError: e.target.value === '' ? 'Please enter an address for your storage.' : '',
                                   address: e.target.value
                               })}
                               className={classes.textField}
                               error={this.state.addressError !== ''}
                               helperText={this.state.addressError || "The precise address of your storage"}/>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField label="Price"
                                       variant="outlined"
                                       fullWidth
                                       value={this.state.price}
                                       onChange={(e) => this.setState({
                                           priceError: e.target.value === '' ? 'Please enter a price for your storage.' : '',
                                           price: e.target.value
                                       })}
                                       className={classes.textField}
                                       InputProps={{
                                           endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                       }}
                                       error={this.state.priceError !== ''}
                                       helperText={this.state.priceError}/>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField select
                                       label="Frequency"
                                       variant="outlined"
                                       fullWidth
                                       onChange={(e) => this.setState({
                                           descriptionError: e.target.value === '' ? 'Please enter a frequency for the price.' : '',
                                           priceFrequency: e.target.value
                                       })}
                                       className={classes.textField}
                                       value={this.state.priceFrequency}
                                       error={this.state.frequencyError !== ''}
                                       helperText={this.state.frequencyError}>
                                <MenuItem value='hour'>per hour</MenuItem>
                                <MenuItem value='day'>per day</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                    <SlotPicker value={this.state.slots}
                                handleSlotSelection={(slots) => this.setState({slots})}
                                className={classes.textField}/>
                    <input
                        accept="image/*"
                        hidden
                        id="raised-button-file"
                        type="file"
                        onChange={(e) => this.setState({image: e.target.files[0]})}
                    />
                    <label htmlFor="raised-button-file">
                        <Button fullWidth variant="raised" component="span" className={classes.textField}>
                            Upload photos
                        </Button>
                    </label>
                    <Box style={{display: 'flex', justifyContent: 'center'}}>
                        <Typography variant="caption" color="error" fullWidth align="center">{this.state.imageError}</Typography>
                    </Box>
                    <Button variant="contained"
                            color="primary"
                            className={classes.textField}
                            fullWidth
                            onClick={() => this.createStorage()}>
                        Create
                    </Button>
                </form>
            </Container>
        );
    }
}

export default withRouter(withStyles(styles)(NewStorage));