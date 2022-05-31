import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import cookie from "js-cookie";
import { Router } from "express";

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
    setLoading(true);
    try {
        const result = await axios.post(`${baseUrl}/api/authorization`, { user });
        setToken(result.data);
    } catch (error) {
        const errorMessage = catchErrors(error);
        setError(errorMessage);
    }
    setLoading(false);
};

export const redirectUser = (ctx, location) => {
    // if user is on server-side
    if (ctx.req) {
        ctx.res.writeHead(302, { Location: location })
        ctx.res.end();
    } 
    // user is on client-side
    else {
        Router.push(location);
    }
};

// function to set cookie and push user to homepage

const setToken = token => {
    cookie.set("token", token);
    window.location.href = "/";
};