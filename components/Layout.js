import React, { createRef } from "react";
import HeadInfo from "./HeadInfo";
import NaviBar from "./NaviBar";
import { Container, Visibility, Grid, Sticky, Ref, Divider, Segment } from "semantic-ui-react";
import nprogress from "nprogress";
import Router, { useRouter } from "next/router";
import SideMenu from "./SideMenu";
import Search from "./Search";
import ResponsiveLayout from "./ResponsiveLayout";
import { createMedia } from "@artsy/fresnel";

// artsy works well with nextjs due to its ability 
// on server-rendering, improves performance for users

// estimated sizes for phones/tablets/laptops/desktops etc..
const AppMedia = createMedia({
    breakpoints: { sm: 0, md: 650, lg: 850, xl: 1080 }
});

// render markup for all breakpoints on the server by using artsy 
// will start rendering the expected visual for any viewport width
// the browswer is at

// Generate CSS to be injected into the head
const mediaStyles = AppMedia.createMediaStyle();
const { Media, MediaContextProvider } = AppMedia;


function Layout({ children, user }) {
    const contextRef = createRef()
    const router = useRouter();

    const messagesRoute = router.pathname === "/messages";

    // Router.onRouteChangeStart=()=>nprogress.start();
    // Router.onRouteChangeComplete=()=>nprogress.done();
    // Router.onRouteChangeError=()=>nprogress.done();


    return (
        <>
            <HeadInfo />
            {user ? (
                <>
                    <style>{mediaStyles}</style>

                    <MediaContextProvider>
                        <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
                            <Media greaterThanOrEqual="xl">
                                <Ref innerRef={contextRef}>
                                    <Grid>
                                        {!messagesRoute ? (
                                            <>
                                                <Grid.Column floated="left" width={2}>
                                                    <Sticky context={contextRef}>
                                                        <SideMenu user={user} comp />
                                                    </Sticky>
                                                </Grid.Column>

                                                <Grid.Column width={10}>
                                                    <Visibility context={contextRef}>{children}</Visibility>
                                                </Grid.Column>

                                                <Grid.Column floated="left" width={4}>
                                                    <Sticky context={contextRef}>
                                                        <Segment basic>
                                                            <Search />
                                                        </Segment>
                                                    </Sticky>
                                                </Grid.Column>
                                            </>
                                        ) : (
                                            <>
                                                <Grid.Column floated="left" width={1} />
                                                <Grid.Column width={15}>{children}</Grid.Column>
                                            </>
                                        )}
                                    </Grid>
                                </Ref>
                            </Media>
                            {/* will render if device viewport width is between 850 - 1080  */}
                            <Media between={["lg", "xl"]}>
                                <Ref innerRef={contextRef}>
                                    <Grid>
                                        {!messagesRoute ? (
                                            <>
                                                <Grid.Column floated="left" width={1}>
                                                    <Sticky context={contextRef}>
                                                        <SideMenu user={user} comp={false} />
                                                    </Sticky>
                                                </Grid.Column>

                                                <Grid.Column width={15}>
                                                    <Visibility context={contextRef}>{children}</Visibility>
                                                </Grid.Column>
                                            </>
                                        ) : (
                                            <>
                                                <Grid.Column floated="left" width={1} />
                                                <Grid.Column width={15}>{children}</Grid.Column>
                                            </>
                                        )}
                                    </Grid>
                                </Ref>
                            </Media>
                             {/* will render if device viewport width is between 650 - 850  */}               
                            <Media between={["md", "lg"]}>
                                <Ref innerRef={contextRef}>
                                    <Grid>
                                        {!messagesRoute ? (
                                            <>
                                                <Grid.Column floated="left" width={2}>
                                                    <Sticky context={contextRef}>
                                                        <SideMenu user={user} comp={false} />
                                                    </Sticky>
                                                </Grid.Column>

                                                <Grid.Column width={14}>
                                                    <Visibility context={contextRef}>{children}</Visibility>
                                                </Grid.Column>
                                            </>
                                        ) : (
                                            <>
                                                <Grid.Column floated="left" width={1} />
                                                <Grid.Column width={15}>{children}</Grid.Column>
                                            </>
                                        )}
                                    </Grid>
                                </Ref>
                            </Media>
                              {/* will render if device viewport width is between 0 - 650  */}              
                            <Media between={["sm", "md"]}>
                                <ResponsiveLayout user={user} />
                                <Grid>
                                    <Grid.Column>{children}</Grid.Column>
                                </Grid>
                            </Media>
                        </div>
                    </MediaContextProvider>
                </>
            ) : (
                <>
                    <NaviBar />
                    <Container text style={{ paddingTop: "1rem" }}>
                        {children}
                    </Container>
                </>
            )}
        </>
    );
}

export default Layout;





