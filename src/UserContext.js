import React, { createContext } from 'react';
import { currentUser } from './services/UserService';

export const UserContext = createContext({
    currentUser: '',
    setUser: () => {}
});

export class UserProvider extends React.Component {
    constructor(props){
        super()
        this.state = {
            currentUser: '',
            setUser: this.setUser
        }
    }
    setUser = user => {
        console.log(user)
        this.setState({ currentUser: user });
    };

    componentDidMount() {
        console.log('in user provider component mount')
        if(sessionStorage.getItem('access_token')){
            currentUser()
            .then((currentUser)=> {
                console.log('component mounted and user gotten')
                this.setState({
                    currentUser: currentUser
                })
            })
        }
    }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export const UserConsumer = UserContext.Consumer;