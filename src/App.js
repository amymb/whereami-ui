import React, { Component } from 'react';
import GoogleMap from 'google-map-react';
import Pusher from 'pusher-js';
import { toast } from 'react-toastify';
import axios from 'axios';
import { UserContext } from './UserContext';

const mapStyles = {
  width: '100%',
  height: '100%',
  position: 'absolute'
}

const markerStyle = {
  height: '50px',
  width: '50px',
  marginTop: '-50px'
}

const imgStyle = {
  height: '100%'
}

const textStyle= {
  height: '20%',
  margin: '4%',
  position: 'absolute'
}

const Marker = ({ title }) => (
  <div 
      style={markerStyle}
  >
    <img style={imgStyle} src="https://res.cloudinary.com/og-tech/image/upload/s--OpSJXuvZ--/v1545236805/map-marker_hfipes.png" alt={title} />
    <h3>{title}</h3>
  </div>
);

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      center: {lat: 40.01, lng: -105.28},
      locations: {},
      users_online: [],
      current_user: ''
    }
  }

  componentDidMount() {
    const current_user = this.context.currentUser.username;
    this.setState({
      current_user: { 'username': current_user }    
    })
    let pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      authEndpoint: `${process.env.REACT_APP_SERVER_URL}/pusher/auth`,
      cluster: "us3",
      auth: {
        headers: {
          'Authorization': sessionStorage.getItem('access_token')
        }
      }
    })
    this.presenceChannel = pusher.subscribe('presence-channel');
    this.presenceChannel.bind('pusher:subscription_error', function(status) {
      console.log('there was an error subscribing')
      console.log(status);
    });
    
    this.presenceChannel.bind('pusher:subscription_succeeded', members => {
      this.setState({
        users_online: members.members,
        current_user: members.me.info
      });
      this.getLocation();
      this.notify();
    })

    this.presenceChannel.bind('location-update', body => {
      this.setState((prevState, props) => {
        const newState = { ...prevState }
        newState.locations[`${body.username}`] = body.location;
        return newState;
      });
    });

    this.presenceChannel.bind('pusher:member_removed', member => {
      this.setState((prevState, props) => {
        const newState = { ...prevState };
        delete newState.locations[`${member.id}`];
        delete newState.users_online[`${member.id}`];
        return newState;
      })
      this.notify();
    })

    this.presenceChannel.bind('pusher:member_added', member => {
      this.notify();
    })

  }

  notify = () => toast(`Users online : ${Object.keys(this.state.users_online).length}`, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    type: 'info'
  });


  getLocation = () => {
    if("geolocation" in navigator) {
      navigator.geolocation.watchPosition(position => {
        let location = { lat: position.coords.latitude, lng: position.coords.longitude, altitude: position.coords.altitude };
        this.setState((prevState, props) => {
          let newState = {...prevState };
          newState.center = location;
          newState.locations[`${prevState.current_user.username}`] = location;
          return newState;
        });
        axios({ method: 'POST', 
          url: `${process.env.REACT_APP_SERVER_URL}/location`,
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
            'Content-Type': 'application/json'
          },
          data: {
            username: this.state.current_user.username,
            location: location
          }
        }).then(res => {
          if (res.status === 200) {
          }
        });
      });
    } else {
      alert("Sorry, geolocation is not available on your device.")
    }
  }

  render() {
    let locationMarkers = Object.keys(this.state.locations).map((username, id) => {
      return (
        <Marker
        key={id}
        title={`${username === this.state.current_user.username ? 'My location' : username + "'s location"}`}
        lat={this.state.locations[`${username}`].lat}
        lng={this.state.locations[`${username}`].lng}
      >
        </Marker>
      );
    });
    let locationData = this.state.current_user && this.state.locations && this.state.locations[`${this.state.current_user.username}`]  ?
    ( <div style={textStyle}>
      <p>latitude: {this.state.locations[`${this.state.current_user.username}`].lat}</p>
      <p>longitude: {this.state.locations[`${this.state.current_user.username}`].lng}</p>
      <p>altitude: {this.state.locations[`${this.state.current_user.username}`].altitude}</p>
    </div>) : <div></div>; 
    return (
      <div>
        <GoogleMap
          style={mapStyles}
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
          center={ this.state.center }
          zoom={20}
        >
          {locationMarkers}
        </GoogleMap>
        {locationData}
      </div>
    )
  }
}

App.contextType = UserContext;
export default App;
