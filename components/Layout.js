import React, { createRef } from "react";
import HeadInfo from "./HeadInfo";
import NaviBar from "./NaviBar";
import { Container, Visibility, Grid, Sticky, Ref, Divider, Segment } from "semantic-ui-react";
import nprogress from "nprogress";
import Router from "next/router";
import SideMenu from "./SideMenu";
import Search from "./Search";

function Layout({ children, user }) {
    const contextRef = createRef()
    // Router.onRouteChangeStart=()=>nprogress.start();
    // Router.onRouteChangeComplete=()=>nprogress.done();
    // Router.onRouteChangeError=()=>nprogress.done();


    return (
        <>
            <HeadInfo />
            {user ? (
                <>
                <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
                  <Ref innerRef={contextRef}>
                    <Grid>

                        <Grid.Column floated="left" width={2}>
                            <Sticky context={contextRef}>
                                <SideMenu user={user} />
                            </Sticky>
                        </Grid.Column>
                        
                    </Grid>
                  </Ref>
                </div>
                </>
            ) : (
                <>
                <NaviBar />
                <Container style={{ paddingTop: "1rem" }} text>
                    {children}
                </Container>
                </>
            )}
        </>
    );
}

export default Layout;





