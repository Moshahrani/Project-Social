import React from "react";
import HeadInfo from "./HeadInfo";
import NaviBar from "./NaviBar";
import { Container } from "semantic-ui-react";
import nprogress from "nprogress";
import Router from "next/router";

function Layout({ children }) {

Router.onRouteChangeStart=()=>nprogress.start();
Router.onRouteChangeComplete=()=>nprogress.done();
Router.onRouteChangeError=()=>nprogress.done();
 

    return (
        <div>
            <HeadInfo />
            <NaviBar />
            <Container style={{ paddingTop: "1rem" }} text>
                {children}
            </Container>
        </div>
    )
}

export default Layout;





