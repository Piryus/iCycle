import React from "react";
import {withStyles} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {withRouter} from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Divider from '@material-ui/core/Divider';
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Axios from "axios";

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

class EditStorage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setBottomNav('storages');
        this.state = {
            name: '',
            price: '',
            priceFrequency: '',
            slots: 1,
            description: '',
            image: null,
            nameError: '',
            descriptionError: '',
            priceError: '',
            frequencyError: ''
        }
    }

    async componentDidMount() {
        const data = await this.getStorageData();
        this.setState({
            name: data.name,
            description: data.description,
            price: data.price,
            priceFrequency: data.priceFrequency,
            slots: data.slots
        });
    }

    changeSlot(value) {
        if (typeof value == 'number' && value > 0 && value < 100) {
            this.setState({slots: value});
        }
    }

    async editStorage() {
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
        if (!error) {
            let formData = new FormData();
            formData.set('id', this.props.match.params.storageId);
            formData.set('name', this.state.name);
            formData.set('description', this.state.description);
            formData.set('price', this.state.price);
            formData.set('priceFrequency', this.state.priceFrequency);
            formData.set('slots', this.state.slots);
            formData.append('image', this.state.image);
            const response = await Axios.patch('http://localhost:3000/storages/edit', formData);
            if (response.data.success) {
                this.props.history.goBack();
            }
        }
    }

    async getStorageData() {
        const {storageId} = this.props.match.params;
        const response = await Axios.get(`http://localhost:3000/storage`, {
            params: {
                id: storageId
            }
        });
        return response.data.storage;
    }

    render() {
        const {classes} = this.props;
        return (
            <Container maxWidth="xs" className={classes.root}>
                <form noValidate autoComplete="off">
                    <TextField
                               label="Name"
                               variant="outlined"
                               fullWidth
                               value={this.state.name}
                               onChange={(e) => this.setState({
                                   nameError: e.target.value === '' ? 'Please enter a name for your storage.' : '',
                                   name: e.target.value
                               })}
                               error={this.state.nameError !== ''}
                               helperText={this.state.nameError || "A name describing your storage and/or its location"}/>
                    <TextField
                        label="Description"
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
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                       label="Price"
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
                                           priceFrequencyError: e.target.value === '' ? 'Please enter a price for your storage.' : '',
                                           priceFrequency: e.target.value
                                       })}
                                       className={classes.textField}
                                       value={this.state.priceFrequency}
                                       error={this.state.frequencyError !== ''}
                                       helperText={this.state.frequencyError}>>
                                <MenuItem value='hour'>per hour</MenuItem>
                                <MenuItem value='day'>per day</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                    <FormControl className={classes.textField} variant="outlined" fullWidth>
                        <InputLabel htmlFor="slot-picker">Slots</InputLabel>
                        <OutlinedInput
                            value={this.state.slots}
                            onChange={(e) => this.changeSlot(e.target.value)}
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconButton
                                        aria-label="Decrement slot"
                                        onClick={() => this.changeSlot(this.state.slots - 1)}
                                        edge="start"
                                    >
                                        <RemoveIcon/>
                                    </IconButton>
                                    <Divider className={classes.divider} orientation="vertical"/>
                                </InputAdornment>
                            }
                            endAdornment={
                                <InputAdornment position="end">
                                    <Divider className={classes.divider} orientation="vertical"/>
                                    <IconButton
                                        aria-label="Increment slot"
                                        onClick={() => this.changeSlot(this.state.slots + 1)}
                                        edge="end"
                                    >
                                        <AddIcon/>
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={70}
                        />
                    </FormControl>
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
                    <Button variant="contained"
                            color="primary"
                            className={classes.textField}
                            fullWidth
                            onClick={() => this.editStorage()}>
                        Update
                    </Button>
                </form>
            </Container>
        );
    }
}

export default withRouter(withStyles(styles)(EditStorage));