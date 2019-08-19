import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { UserContext } from './UserContext';
import { login } from './services/AuthService';
import './Login.css';

class Login extends Component {

    constructor(){
        super()
        this.state = {
            redirectToReferrer: false,
          }
    }

    componentWillMount(){
        if(sessionStorage.getItem('access_token')) {
            console.log('setting state')
            this.setState({
                redirectToReferrer: true
            })
            console.log('state set')
        }
    }

    handleChange = (e) => {
        this.setState( {[e.target.name]: e.target.value})
    }

    handleFormSubmit = (e) => {
        console.log("this got called")
        e.preventDefault();
        login(this.state.username, this.state.password)
            .then((user) => {
                console.log('this is the user', user)
                this.context.setUser(user)
                this.setState({
                    redirectToReferrer: true
                })
            })
            .catch(err => {
                alert(err);
            })
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } }

        const { redirectToReferrer } = this.state
        console.log('rendering login')
        if (redirectToReferrer === true) {
          return <Redirect to={from} />
        }
        return(
            <div className="center">
                <div className="card">
                    <h1>Login</h1>
                    <form>
                        <input
                            className="form-item"
                            placeholder="Username"
                            name="username"
                            type="text"
                            onChange={this.handleChange}                            
                        />
                        <input
                            className="form-item"
                            placeholder="Password"
                            name="password"
                            type="text"
                            onChange={this.handleChange}
                        />
                        <input
                            className="form-submit"
                            value="SUBMIT"
                            type="submit"
                            onClick={this.handleFormSubmit}
                        />
                     </form>
                </div>
            </div>
        )
    }

}
Login.contextType = UserContext;
export default Login;