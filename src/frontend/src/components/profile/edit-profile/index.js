import React from "react";
import {withStyles} from "@material-ui/core";
import Axios from "axios";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";

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
    },
    avatar: {
        width: theme.spacing(15),
        height: theme.spacing(15),
    }
});

class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            surname: '',
            email: '',
            image: null,
            phone: ''
        };
    }

    async componentDidMount() {
        const user = await this.fetchData();
        this.setState({
            name: user.name,
            surname: user.surname,
            email: user.email,
            phone: user.phone,
            imagePath: user.picturePath,
            imageFile: null
        });
    }

    async fetchData() {
        const response = await Axios.get('http://localhost:3000/auth');
        return response.data;
    }

    async modifyProfile() {
        let formData = new FormData();
        formData.set('name', this.state.name);
        formData.set('surname', this.state.surname);
        formData.set('email', this.state.email);
        formData.set('phone', this.state.phone);
        if (this.state.imageFile !== null)
            formData.append('image', this.state.imageFile);
        const response = await Axios.patch('http://localhost:3000/user', formData);
        if (response.data.success) {
            this.props.history.push("profile/success");
        }
    }


    render() {
        const {classes} = this.props;
        const {user} = this.state;
        console.log(this.state.imagePath)
        return (
            <Container maxWidth="xs" className={classes.root}>
                {user !== null &&
                <form noValidate autoComplete="off">
                    <Grid container spacing={3}>
                        <Grid container item direction="column" alignItems="center">
                            <Avatar className={classes.avatar} src={this.state.imagePath}/>
                            <input
                                accept="image/*"
                                hidden
                                id="raised-button-file"
                                type="file"
                                onChange={(e) =>
                                    this.setState({
                                        imageFile: e.target.files[0],
                                        imagePath: URL.createObjectURL(e.target.files[0])
                                    })
                                }
                            />
                            <label htmlFor="raised-button-file">
                                <Button fullWidth variant="raised" component="span" className={classes.textField}>
                                    Change Profile Picture
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                value={this.state.name}
                                onChange={(e) => this.setState({name: e.target.value})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Surname"
                                variant="outlined"
                                value={this.state.surname}
                                onChange={(e) => this.setState({surname: e.target.value})}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                value={this.state.email}
                                onChange={(e) => this.setState({email: e.target.value})}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Phone"
                                variant="outlined"
                                value={this.state.phone}
                                onChange={(e) => this.setState({phone: e.target.value})}
                                fullWidth
                            />
                        </Grid>
                    </Grid>

                    <Button variant="contained"
                            color="primary"
                            className={classes.textField}
                            fullWidth
                            onClick={() => this.modifyProfile()}>
                        Update
                    </Button>
                </form>
                }
            </Container>
        );
    }
}

export default withStyles(styles)(EditProfile);

