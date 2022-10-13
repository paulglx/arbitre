import axios from '../api/axios';
import useAuth from './useAuth';

const LOGOUT_URL = 'api/auth/logout/';

const useLogout = () => {
    const { auth, setAuth } = useAuth();

    const logout = async () => {
        console.log("auth:", auth);
        const refreshToken = auth?.refreshToken;
        setAuth({});
        try {
            const response = await axios.post(
                LOGOUT_URL,
                JSON.stringify({refreshToken})
            );
        } catch (err) {
            console.error(err);
        }
    }

    return logout;
}

export default useLogout;