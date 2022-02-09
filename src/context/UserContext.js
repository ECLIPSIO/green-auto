import {createContext, useState, useEffect} from 'react'
import axios from 'axios'

export const UserContext = createContext();

export const Axios = axios.create({
    baseURL: (window.location.protocol== "http:" ? "http://ec2-50-112-66-106.us-west-2.compute.amazonaws.com" : "https://doubleclutch.com") + "/bridge/gas/"
});

export const UserContextProvider = ({children}) => {

    const [userData, setUserData] = useState(null);
    const [wait, setWait] = useState(false);

    const registerUser = async ({name,signin_username,signin_password}) => {
        setWait(true);
        try{
            const {data} = await Axios.post('register.php',{
                name,
                signin_username,
                signin_password 
            });
            setWait(false);
            return data;
        }
        catch(err){
            setWait(false);
            return {success:0, message:'Server Error!'};
        }
    }

    const loginUser = async ({signin_username,signin_password}) => {
        setWait(true);
        try{
            const {data} = await Axios.post('login.php',{
                signin_username,
                signin_password 
            });

            console.log(data);
            if(data.success && data.token){
                localStorage.setItem('loginToken', data.token);
                setWait(false);
                return {success:1};
            }
            setWait(false);
            return {success:0, message:data.message};
        }
        catch(err){
            setWait(false);
            return {success:0, message:'Server Error!'};
        }

    }

    const loggedInCheck = async () => {
        const loginToken = localStorage.getItem('loginToken');
        Axios.defaults.headers.common['Authorization'] = 'Bearer '+loginToken;
        if(loginToken){
            const {data} = await Axios.get('getUser.php');
            console.log(data);
            if(data.success && data.user){
                setUserData(data.user);
                return;
            }
            setUserData(null);
        }
    }

    const changeUserDealership = (dealership_id,dealership) => {
        const tempUserData = userData;
        tempUserData.dealership_id = dealership_id;
        tempUserData.dealership = dealership;

        setUserData(tempUserData);

        console.log(userData);
    }

    useEffect(() => {
        async function asyncCall(){
            await loggedInCheck();
        }
        asyncCall();
    },[]);

    const logout = () => {
        localStorage.removeItem('loginToken');
        setUserData(null);
    }

    return (
        <UserContext.Provider value={{registerUser,loginUser,wait, user:userData,loggedInCheck,logout,changeUserDealership}}>
            {children}
        </UserContext.Provider>
    );

}

export default UserContextProvider;