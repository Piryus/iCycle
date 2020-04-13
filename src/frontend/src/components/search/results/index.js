import React from "react";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import Map from "../../utils/map";
import Axios from "axios";

const styles = theme => ({
    root: {
        height: 'calc(100% - 120px)'
    },
    listButton: {
        position: 'absolute',
        bottom: 100,
        left: '50%',
        transform: 'translate(-50%)',
        textAlign: 'center'
    }
});

class SearchResults extends React.Component {
    constructor(props) {
        super(props);
        this.props.setBottomNav('search');
        this.state = {
            location: {
                lat: 0,
                lng: 0
            },
            results: []
        };
    }

    async componentDidMount() {
        const {address, checkin, checkout, slots} = this.props.match.params;
        const response = await this.fetchResults(address, checkin, checkout, slots);
        this.setState({
            location: response.geometry,
            results: response.storages
        });
    }

    async fetchResults(address, checkin, checkout, slots) {
        const response = await Axios.get('http://localhost:3000/search-map/', {
            params: {
                address,
                checkin,
                checkout,
                slots
            }
        });
        return response.data;
    }

    render() {
        const {address, checkin, checkout, slots} = this.props.match.params;
        const {classes} = this.props;
        return (
            <>
                <Map googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyB0okxLztMwm-VYp8sRJtQNsGUVvmEfgrs"
                     loadingElement={<div style={{height: `100%`}}/>}
                     containerElement={<div className={classes.root}/>}
                     mapElement={<div style={{height: `100%`}}/>}
                     center={this.state.location}
                     storages={this.state.results}
                     searchParams={this.props.match.params}
                />
                <Button variant="contained"
                        color="primary"
                        className={classes.listButton}
                        component={Link}
                        to={'/s/list/' + address + '/' + checkin + '/' + checkout + '/' + slots}>
                    Switch to list view
                </Button>
            </>
        );
    }
}

export default withStyles(styles)(SearchResults);