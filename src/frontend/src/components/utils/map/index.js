import React from 'react';
import {GoogleMap, withGoogleMap, withScriptjs} from "react-google-maps"
import {Marker} from "react-google-maps";
import MarkerWithInfobox from "./marker-with-infobox";


class Map extends React.Component {
    render() {
        return (
            <GoogleMap defaultZoom={15} center={this.props.center}>
                {this.props.storages !== null && this.props.storages !== undefined && this.props.storages.map(storage =>
                    <MarkerWithInfobox storage={storage} searchParams={this.props.searchParams}/>
                )}
                {this.props.marker !== null && this.props.marker !== undefined &&
                    <Marker position={{lat: this.props.marker.lat, lng: this.props.marker.lng}}/>
                }
            </GoogleMap>
        );
    }
}

export default withScriptjs(withGoogleMap(Map));