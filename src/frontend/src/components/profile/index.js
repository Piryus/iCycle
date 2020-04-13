import React from "react";
import {Avatar, withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {withRouter} from "react-router-dom";

const styles = theme => ({
    paper: {
        margin: theme.spacing(8, 0, 6),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    margin: {
        marginTop: theme.spacing(2)
    },
    badge: {
        marginTop: theme.spacing(2),
        width: '100%'
    },
    mainContainer: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    editButtonBox: {
        marginTop: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center'
    }
});

class Profile extends React.Component {
    render() {
        const {classes, auth} = this.props;
        return (
            <Dialog onClose={() => this.props.handleClose()} open={this.props.open}>
                {auth !== null &&
                <Container fluid className={classes.mainContainer}>
                    <Grid container direction="row" alignItems="center" spacing={2}>
                        <Grid item>
                            <Avatar alt={auth.name} src={auth.picturePath}/>
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1" color="textPrimary">{auth.name} {auth.surname}</Typography>
                            <Typography variant="caption" color="textPrimary">{auth.email}</Typography>
                        </Grid>
                    </Grid>
                    <Box className={classes.editButtonBox}>
                        <Button variant="outlined"
                                color="primary"
                                onClick={() => {
                                    this.props.history.push('/profile');
                                    this.props.handleClose();
                                }}>
                            Edit profile
                        </Button>
                    </Box>
                </Container>
                }
            </Dialog>
        );
    }
}

export default withRouter(withStyles(styles)(Profile));