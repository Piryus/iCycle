import React from "react";
import {withStyles} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Axios from "axios";
import ResultCard from "./result-card";

const styles = theme => ({
    root: {
        marginTop: theme.spacing(2)
    },
    resultCard: {
        marginBottom: theme.spacing(2)
    }
});

class SearchResultsList extends React.Component {
    constructor(props) {
        super(props);
        this.props.setBottomNav('search');
        this.state = {
            results: []
        };
    }

    async componentDidMount() {
        const {address, checkin, checkout, slots} = this.props.match.params;
        const response = await this.fetchResults(address, checkin, checkout, slots);
        this.setState({
            results: response.storages
        });
    }

    async fetchResults(address, checkin, checkout, slots) {
        const response = await Axios.get('http://localhost:3000/search', {
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
        const {classes} = this.props;
        const {checkin, checkout, slots} = this.props.match.params;
        return (
            <Container maxWidth="xs" className={classes.root}>
                {this.state.results.map(result =>
                    <ResultCard className={classes.resultCard} storage={result} searchParams={{checkin, checkout, slots}}/>
                )}
            </Container>
        );
    }
}

export default withStyles(styles)(SearchResultsList);