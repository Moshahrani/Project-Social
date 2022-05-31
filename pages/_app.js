import App from "next/app";
import Layout from "../components/Layout";
import axios from "axios";
import baseUrl from "../utilities/baseUrl";
import { parseCookies, destroyCookie } from "nookies";
import { redirectUser } from "../utilities/authUser";
import "semantic-ui-css/semantic.min.css";

class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {

        // parsing token
        const { token } = parseCookies(ctx)
        let pageProps = {};

        // variable for protected routes
        const protectedRoutes = ctx.pathname === "/"
        
        // if there's no token and user is trying to access protectedRoutes
        // we will redirect user back to login page

        if (!token) {
            protectedRoutes && redirectUser(ctx, "/login");
        } else {
            if (Component.getInitialProps) {
                pageProps = await Component.getInitialProps(ctx);
            }
        }

         // making request to backend for user information only 
         // when token is in storage
        try {

            const result = await axios.get(`${baseUrl}/api/authorization`,
                { headers: { Authorization: token } });

            const { user, userFollowInfo } = result.data

           // redirect user to Home Page if logged in
            if (user) !protectedRoutes && redirectUser(ctx, "/");

            pageProps.user = user;
            pageProps.userFollowInfo = userFollowInfo;

        } catch (error) {
            destroyCookie(ctx, "token")
            redirectUser(ctx, "/login")
        }

        return { pageProps };
    }
     
    // spreading the pageProps helps us receive it in all pages  

    render() {
        const { Component } = this.props;

        return (
            <Layout  {...pageProps}>
                <Component {...pageProps}/>
            </Layout>
        );
    }
}

export default MyApp;

