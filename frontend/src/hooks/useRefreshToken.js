import axios from "../api/axios";
import useAuth from "./useAuth";
import { useContext } from "react";

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();
    const refreshToken = auth?.refreshToken;

    const refresh = async () => {
        const response = await axios.post('api/auth/token/refresh/', 
        JSON.stringify({refresh:refreshToken}),
        {
            withCredentials: true
        });
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return { ...prev, accessToken: response.data.accessToken };
        });
        return response.data.accessToken;
    }

    return refresh;
};

export default useRefreshToken;