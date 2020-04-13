import React from "react";
import {withStyles} from "@material-ui/core";
import Axios from "axios";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";


const styles = theme => ({
    root: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    message:{
        marginTop: theme.spacing(4),
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
});

class Success extends React.Component {
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

    render() {
        const {classes} = this.props;
        return (
            <Container maxWidth="xs" className={classes.root}>
                <Container className={classes.message}>
                    <h2>Congratulations!</h2>
                    <h3>Your profile was successfully updated!</h3>
                </Container>

                <Button variant="contained"
                        color="primary"
                        className={classes.textField}
                        fullWidth
                        onClick={() => this.props.history.push("/")}>
                    Go home
                </Button>
            </Container>
        );
    }
}

export default withStyles(styles)(Success);

