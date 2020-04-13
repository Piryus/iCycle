import React from 'react';
import Home from '../home';
import {BottomNavigation, BottomNavigationAction, CssBaseline, withStyles, Paper, Badge} from "@material-ui/core";
import Bookings from "../bookings";
import {Link, Route, Switch, withRouter} from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import EventIcon from '@material-ui/icons/Event';
import ArchiveIcon from '@material-ui/icons/Archive';
import Search from "../search";
import SearchResults from "../search/results";
import SearchResultsList from "../search/results-list";
import Storages from "../storages";
import NewStorage from "../storages/new-storage";
import ManageBookings from '../storages/manage-bookings';
import Storage from "../search/storage";
import AppBar from "../utils/appbar";
import BookStorage from "../search/book-storage";
import EditStorage from "../storages/edit-storage";
import Booking from "../bookings/booking";
import Profile from "../profile";
import EditProfile from "../profile/edit-profile"
import Success from "../profile/success"

const styles = theme => ({
    bottomNav: {
        position: 'fixed',
        width: '100%',
        bottom: 0,
    },
    marginNavBar: {
        height: '64px', // 56 px (navbar height + 8 px theme spacing)
    }
});

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bottomNavValue: 'home',
            topBarTitle: 'iCycle',
            auth: {},
        };
    }

    async componentDidMount() {
        const auth = await this.fetchAuthData();
        this.setState({
            auth
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        const auth = await this.fetchAuthData();
        if (JSON.stringify(prevState.auth) !== JSON.stringify(auth)) {
            this.setState({auth});
        }
    }

    async fetchAuthData() {
        const url = 'http://localhost:3000/auth';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        };
        const response = await fetch(url, options);
        const json = await response.json();
        return json;
    }

    setBottomNav(bottomNavValue) {
        if (bottomNavValue !== this.state.bottomNavValue) {
            this.setState({
                bottomNavValue
            });
        }
    }

    setTopBarTitle(title) {
        if (title !== this.state.topBarTitle) {
            this.setState({
                topBarTitle: title
            });
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <>
                <CssBaseline/>
                <AppBar auth={this.state.auth} title={this.state.topBarTitle} toggleProfileModal={() => this.setState({profileModalOpen: true})}/>

                <Profile auth={this.state.auth} open={this.state.profileModalOpen} handleClose={() => this.setState({profileModalOpen: false})}/>

                <Switch>
                    <Route exact path="/" render={() => {
                        this.setTopBarTitle('iCycle');
                        this.setBottomNav('home');
                        return  <Home/>
                    }
                    }/>
                    {/* Bookings routes */}
                    <Route exact path="/bookings" render={() => {
                        this.setTopBarTitle('iCycle');
                        return <Bookings setBottomNav={(bottomNavValue) => this.setBottomNav(bottomNavValue)}/>
                    }
                    }/>
                    <Route exact path="/booking/:id" render={(props) => {
                        this.setTopBarTitle('Booking details');
                        this.setBottomNav('bookings');
                        return <Booking {...props}/>
                    }
                    }/>
                    {/* Search routes */}
                    <Route exact path="/search" render={() => {
                        this.setTopBarTitle('iCycle');
                        return <Search setBottomNav={(bottomNavValue) => this.setBottomNav(bottomNavValue)}/>
                    }
                    }/>
                    <Route
                        exact path="/s/:address/:checkin/:checkout/:slots"
                        render={(props) => {
                            this.setTopBarTitle('Search results');
                            return <SearchResults
                                {...props}
                                setBottomNav={(bottomNavValue) => this.setBottomNav(bottomNavValue)}
                            />
                        }
                        }
                    />
                    <Route
                        exact path="/s/list/:address/:checkin/:checkout/:slots"
                        render={(props) => {
                            this.setTopBarTitle('Search results');
                            return <SearchResultsList
                                {...props}
                                setBottomNav={(bottomNavValue) => this.setBottomNav(bottomNavValue)}
                            />
                        }
                        }
                    />
                    <Route
                        exact path="/storage/:id/:checkin/:checkout/:slots"
                        render={(props) => {
                            this.setTopBarTitle('Storage');
                            return <Storage
                                {...props}
                                setBottomNav={(bottomNavValue) => this.setBottomNav(bottomNavValue)}
                            />;
                        }
                        }
                    />
                    <Route
                        exact path="/book/:id/:checkin/:checkout/:slots"
                        render={(props) => {
                            this.setTopBarTitle('Book storage');
                            return <BookStorage
                                {...props}
                                setBottomNav={(bottomNavValue) => this.setBottomNav(bottomNavValue)}
                            />;
                        }
                        }
                    />
                    {/* Storages routes */}
                    <Route exact path="/storages" render={() => {
                        return <Storages setBottomNav={(bottomNavValue) => this.setBottomNav(bottomNavValue)}/>;
                    }
                    }/>
                    <Route exact path="/storages/new" render={() => {
                        this.setTopBarTitle('Create a storage');
                        return <NewStorage setBottomNav={(bottomNavValue) => this.setBottomNav(bottomNavValue)}
                        />;
                    }
                    }/>
                    <Route exact path="/storages/edit/:storageId" render={() => {
                        this.setTopBarTitle('Edit a storage');
                        return <EditStorage setBottomNav={(bottomNavValue) => this.setBottomNav(bottomNavValue)}
                        />;
                    }
                    }/>
                    <Route path='/storages/bookings/:storageId?'
                           render={(props) => {
                               this.setTopBarTitle('Manage bookings');
                               return <ManageBookings
                                   {...props}
                                   setBottomNav={(bottomNavValue) => this.setBottomNav(bottomNavValue)}
                               />;
                           }}
                    />
                    {/* Profile routes */}
                    <Route exact path="/profile" render={(props) => {
                        this.setTopBarTitle('Edit profile');
                        this.setBottomNav('home');
                        return <EditProfile {...props} />;
                    }
                    }/>
                    <Route exact path="/profile/success" render={(props) => {
                        this.setTopBarTitle('Congratulations');
                        this.setBottomNav('home');
                        return <Success {...props} />;
                    }
                    }/>
                </Switch>

                <div className={classes.marginNavBar}/>

                <Paper elevation={4} className={classes.bottomNav}>
                <BottomNavigation showLabels value={this.state.bottomNavValue}
                                  onChange={(e, newValue) => this.setState({bottomNavValue: newValue})}
                                  >
                    <BottomNavigationAction component={Link} to='/' label="Home" value="home" icon={<HomeIcon/>}/>
                    <BottomNavigationAction component={Link} to='/search' label="Search" value="search"
                                            icon={<SearchIcon/>}/>
                    <BottomNavigationAction component={Link} to='/bookings' label="Bookings" value="bookings"
                                            icon={<EventIcon/>}/>
                    <BottomNavigationAction component={Link} to='/storages' label="Storages" value="storages"
                                            icon={<Badge badgeContent={this.state.auth.pendingBookings} color="secondary"><ArchiveIcon/></Badge>}/>
                </BottomNavigation>
                </Paper>
            </>
        );
    }
}

export default withRouter(withStyles(styles)(App));
