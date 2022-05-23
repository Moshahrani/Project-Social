import React from "react";
import HeadInfo from "./HeadInfo";
import NaviBar from  "./NaviBar";
import { Container } from "semantic-ui-react";

function Layout() {
    return (
        <div>
            <HeadInfo />
            <NaviBar />
            <Container ></Container>
        </div>
    )
}

export default Layout;





