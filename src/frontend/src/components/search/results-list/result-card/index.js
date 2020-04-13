import React from "react";
import {Card, CardActionArea, CardContent, CardMedia, Grid, Typography, withStyles} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import PlaceIcon from '@material-ui/icons/Place';
import FavoriteIcon from '@material-ui/icons/Favorite';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import {Link} from "react-router-dom";

const styles = theme => ({
    cardContent: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: '100%'
    },
    icon: {
        verticalAlign: 'middle',
    },
    distance: {
        marginLeft: 'auto'
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


class ResultCard extends React.Component {
    getLabelText(value) {
        return `${value} Heart${value !== 1 ? 's' : ''}`;
    }

    render() {
        const {classes, storage} = this.props;
        const {checkin, checkout, slots} = this.props.searchParams;
        return (
            <Card className={this.props.className}>
                <CardActionArea component={Link} to={`/storage/${storage._id}/${checkin}/${checkout}/${slots}`}>
                    <CardMedia component="img" height="100"
                               src={`http://localhost:3000/${storage.imagePath}`}/>
                    <CardContent className={classes.cardContent}>
                        <Typography variant="h6" component="h2" noWrap>
                            {storage.name}
                        </Typography>
                        <Grid container alignItems="flex-start" justify="space-between" direction="row">
                            <Grid item>
                                <StyledRating
                                    readOnly
                                    name="customized-color"
                                    value={storage.ratingAverage}
                                    getLabelText={this.getLabelText}
                                    icon={<FavoriteIcon fontSize="inherit"/>}
                                />
                            </Grid>
                            <Grid item>
                                <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <PlaceIcon className={classes.icon}/>
                                        </Grid>
                                        <Grid item>
                                            {storage.distanceToOrigin.text}
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <EuroSymbolIcon className={classes.icon}/>
                                        </Grid>
                                        <Grid item>
                                            {storage.price}€/{storage.priceFrequency}
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Typography variant="caption" color="textSecondary">{storage.address}</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    }
}

export default withStyles(styles)(ResultCard);