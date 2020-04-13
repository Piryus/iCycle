import React from "react";
import {Button, Card, CardActions, CardContent, CardMedia, Typography, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";

const styles = theme => ({
    badge: {
        marginTop: theme.spacing(2),
        width: '100%'
    },
    actionArea: {
        marginTop: -theme.spacing(2)
    }
});

class StorageCard extends React.Component {
    render() {
        const {classes} = this.props;
        return (
            <Card className={this.props.className}>
                <CardMedia
                    component='img'
                    src={`http://localhost:3000/${this.props.storage.imagePath}`}
                    height={100}/>
                <CardContent>
                    <Typography variant="h6" component="h2" noWrap>
                        {this.props.storage.name}
                    </Typography>
                    <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                        {this.props.storage.address}
                    </Typography>
                </CardContent>
                <CardActions className={classes.actionArea}>
                    <Button size="small" color="primary" component={Link}
                            to={`/storages/bookings/${this.props.storage._id}`}>
                        Manage bookings ({this.props.storage.bookings})
                    </Button>
                    <Button size="small" color="primary" component={Link}
                            to={`/storages/edit/${this.props.storage._id}`}>
                        Edit
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

export default withStyles(styles)(StorageCard);