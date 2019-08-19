import React from 'react';
import { UserConsumer } from './UserContext';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute({ component: Component, ...rest }) {
    console.log('this is the private route function')
    return (
        <UserConsumer>
        { ({currentUser}) => <Route {...rest} render={(props)=> ( 
            currentUser ? 
            <Component { ...props} />
            : <Redirect to={{pathname: '/login'}} />
        )}
    /> }
        </UserConsumer>
    );
}