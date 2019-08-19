import axios from 'axios';


const currentUser = async () => {
    let cu;
    if(sessionStorage.getItem('access_token')){
        console.log("in yes, there's an access token")
        try {
            let response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/current`, {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('access_token')
                }
            })
            if(response.status === 200 && response.data) {
               cu = response.data
               return cu
            }
        } catch(e){
            console.log(e);
        }
    }
}

export { currentUser };