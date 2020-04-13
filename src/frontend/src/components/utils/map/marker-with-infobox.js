import React from "react";
import {Marker} from "react-google-maps";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import {Card, CardContent, CardMedia, CardActions, Button, Typography, withStyles} from "@material-ui/core";
import EuroIcon from '@material-ui/icons/Euro';
import Grid from "@material-ui/core/Grid";
import {withRouter} from "react-router-dom";

const styles = theme => ({
    card: {
        opacity: 0.75,
        maxWidth: '300px'
    },
    media: {
        height: '70px'
    },
    cardContent: {
        paddingBottom: '0px !important'
    }
});

class MarkerWithInfobox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infoBoxOpen: false
        };
    }

    handleToggleOpen() {
        this.setState({
            infoBoxOpen: !this.state.infoBoxOpen
        });
    }

    handleClickStorage(storage) {
        const {checkin, checkout, slots} = this.props.searchParams;
        this.props.history.push(`/storage/${storage._id}/${checkin}/${checkout}/${slots}`);
    }

    render() {
        const {storage, classes} = this.props;
        return (
            <Marker position={{lat: storage.geometry.lat, lng: storage.geometry.lng}}
                    onClick={() => this.handleToggleOpen()}>
                {this.state.infoBoxOpen &&
                <InfoBox options={{closeBoxURL: ``, enableEventPropagation: true}}>
                    <Card className={classes.card}>
                        <CardMedia
                            className={classes.media}
                            image={`http://localhost:3000/${storage.imagePath}`}
                        />
                        <CardContent className={classes.cardContent}>
                            <Typography variant='h5'>{storage.name}</Typography>
                            <Typography variant='body1'>
                                <Grid container spacing={1}>
                                    <Grid item>
                                        <EuroIcon/>
                                    </Grid>
                                    <Grid item>
                                        {storage.price}€ {storage.priceFrequency === 'day' ? 'per day' : 'per hour'}
                                    </Grid>
                                </Grid>
                            </Typography>
                        </CardContent>
                        <CardActions>
                                <Button size="small" color="primary" onClick={() => this.handleClickStorage(storage)}>
                                    See more
                                </Button>
                        </CardActions>
                    </Card>
                </InfoBox>
                }
            </Marker>
        );
    }
}

export default withRouter(withStyles(styles)(MarkerWithInfobox));