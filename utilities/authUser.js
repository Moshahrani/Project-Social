import axios from "axios"
import baseUrl from "./baseUrl"
import catchErrors from "./catchErrors"
import cookie from "js-cookie"

export const registerUser = async (user, profilePicUrl, setError, setLoading) => {

    try {
        const result = await axios.post(`${baseUrl}/api/signup`, { user, profilePicUrl });
        setToken(result.data);
    } catch (error) {
        const errorMessage = catchErrors(error);
        setError(errorMessage);
    }
    setLoading(false);
};

export const loginUser = async (user, setError, setLoading) => {
    setLoading(true)
    try {
        const result = await axios.post(`${baseUrl}/api/authorization`, { user });
        setToken(result.data);
    } catch (error) {
        const errorMessage = catchErrors(error);
        setError(errorMessage);
    }
    setLoading(false);
};

// function to set cookie and push user to homepage

const setToken = token => {
    cookie.set("token", token);
    window.location.href = "/";
};