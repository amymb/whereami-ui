import axios from 'axios';
const SERVER_URL = process.env.REACT_APP_SERVER_URL

const login = async (username, password) => {
    const LOGIN_ENDPOINT = `${SERVER_URL}/authenticate`

    try {

        let response = await axios.post(LOGIN_ENDPOINT, {username: username, password: password});
        console.log('i am in the auth service', response.data)
        if(response.status === 200 && response.data.auth_token) {
            console.log('ifs work')
            let jwt = response.data.auth_token;
            let expire_at = response.data.expireAtl
            sessionStorage.setItem("access_token", jwt);
            sessionStorage.setItem("expire_at", expire_at);
            console.log('here is user', response.data.user)
            return response.data.user
        }
    } catch(e){
        console.log(e);
    }

}

const logout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("expire_at");
}

export { login, logout }