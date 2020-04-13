import React from "react";
import {Box, CircularProgress, Container, CssBaseline, Fab, Typography, withStyles} from "@material-ui/core";
import MicNoneIcon from '@material-ui/icons/MicNone';
import SpeechRecognition from "react-speech-recognition";
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
    micFab: {
        backgroundColor: '#21D4FD0',
        backgroundImage: 'linear-gradient(19deg, ' + theme.palette.secondary.main + ' 0%, ' + theme.palette.primary.main + ' 100%)', //  #21D4FD 0%, #B721FF 100%
        width: 100,
        height: 100,
    },
    micFabIcon: {
        fontSize: 80
    },
    fabProgress: {
        color: theme.palette.primary.main,
        position: 'absolute',
        top: -10,
        left: -10,
        zIndex: -1
    },
    centerBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
});

const speechOptions = {
    autoStart: false,
    continuous: false
};

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            surname: '',
            pendingBookings: 0,
        };
    }

    async componentDidMount() {
        const auth = await this.auth();
        this.setState({
            pendingBookings: auth.pendingBookings,
            name: auth.name,
            surname: auth.surname
        });
    }

    async auth() {
        const url = 'http://localhost:3000/auth';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        const response = await fetch(url, options);
        return await response.json();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {transcript, resetTranscript, history} = this.props;
        if (transcript.includes('go to my booking') || transcript.includes('show me my booking')) {
            resetTranscript();
            history.push('/bookings');
        } else if (transcript.includes('create')) {
            resetTranscript();
            history.push('/storages/new');
        } else if (transcript.includes('search')) {
            resetTranscript();
            history.push('/search');
        } else if (transcript.includes('manage')) {
            resetTranscript();
            history.push('/storages');
        }
    }

    toggleListening() {
        const {listening, startListening, stopListening} = this.props;
        if (!listening) {
            startListening();
        } else {
            stopListening();
        }
    }

    render() {
        const {classes, listening, transcript, recognition, browserSupportsSpeechRecognition} = this.props;
        if (browserSupportsSpeechRecognition)
            recognition.lang = 'en-US';
        return (
            <Container maxWidth="xs">
                <div className={classes.paper}>
                    <CssBaseline/>
                    <Typography variant="h2" color="textPrimary">Hi {this.state.name}!</Typography>
                    <Typography variant="h6" component="p" color="textSecondary">What would you like to do
                        today?</Typography>
                    {browserSupportsSpeechRecognition && <>
                        <Box style={{position: 'relative'}} mt={5}>
                            <Fab color="secondary" onClick={() => this.toggleListening()} className={classes.micFab}>
                                <MicNoneIcon className={classes.micFabIcon}/>
                            </Fab>
                            {listening && <CircularProgress size={120} className={classes.fabProgress}/>}
                        </Box>
                        <Box mt={3}>
                            <Typography variant="caption" color="textSecondary">
                                Try "Show me my bookings"...
                            </Typography>
                        </Box>
                        <Box className={classes.centerBox} mt={1}>
                            {transcript !== '' &&
                            <Typography variant="h6" color="textSecondary">You said...</Typography>}
                            <Typography variant="h6">{transcript}</Typography>
                        </Box>
                    </>}
                    {!browserSupportsSpeechRecognition &&
                    <>
                        <Box style={{position: 'relative'}} mt={5}>
                            <Fab disabled color="secondary" onClick={() => this.toggleListening()}
                                 className={classes.micFab}>
                                <MicNoneIcon className={classes.micFabIcon}/>
                            </Fab>
                        </Box>
                        <Box mt={3} className={classes.centerBox}>
                            <Typography variant="caption" color="textSecondary" align="center">
                                Vocal commands aren't available on your browser. Try the latest version of Chrome!
                            </Typography>
                        </Box>
                    </>
                    }
                </div>
            </Container>
        );
    }
}

export default withRouter(withStyles(styles)(SpeechRecognition(speechOptions)(Home)));