import React from "react";
import {Avatar, IconButton, Slide, Toolbar, Typography, withStyles} from "@material-ui/core";
import AppBarMUI from "@material-ui/core/AppBar";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {withRouter} from "react-router-dom";

const styles = theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    }
});

class AppBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hide: false,
            elevated: false
        };
        this.lastScroll = null;
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, {passive: true});
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }


    handleScroll = () => {
        const lastScroll = window.scrollY;
        if (lastScroll === this.lastScroll) {
            return;
        }
        const elevated = lastScroll > 0;
        const hide = (this.lastScroll !== null) ? (lastScroll > this.lastScroll && window.scrollY > 56) : false;
        if (hide !== this.state.hide || elevated !== this.state.elevated) {
            this.setState({
                hide,
                elevated
            });
        }
        this.lastScroll = lastScroll;
    };


    render() {
        const {classes, title, auth} = this.props;
        const pathnames = ['/search', '/bookings', '/storages', '/', '/profile/success'];
        const reverse = !pathnames.includes(this.props.history.location.pathname);

        return (
            <Slide in={!this.state.hide} direction="down">
                <AppBarMUI position="sticky" color={reverse ? "white" : "primary"} elevation={this.state.elevated ? 4 : 0}>
                    <Toolbar>
                        {reverse &&
                        <IconButton edge="start"
                                    className={classes.menuButton}
                                    color="inherit"
                                    aria-label="menu"
                                    onClick={() => this.props.history.goBack()}>
                            <ArrowBackIcon/>
                        </IconButton>
                        }
                        <Typography variant="h6" className={classes.title}>
                            {title}
                        </Typography>
                        {!reverse &&
                        <Avatar alt={auth.name} src={auth.picturePath} onClick={() => this.props.toggleProfileModal()} />
                        }
                    </Toolbar>
                </AppBarMUI>
            </Slide>
        );
    }
}

export default withRouter(withStyles(styles)(AppBar));