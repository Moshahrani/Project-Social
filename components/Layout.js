import React from "react";
import HeadInfo from "./HeadInfo";
import NaviBar from "./NaviBar";
import { Container } from "semantic-ui-react";

function Layout({ children }) {
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





