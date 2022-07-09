import React from "react";
import { Container, Dropdown, Icon, Menu } from "semantic-ui-react";
import { useRouter } from "next/router";
import Link from "next/link";
import { logoutUser } from "../utilities/authUser";

function ResponsiveLayout({ user: { unreadNotification, email, unreadMessage, username } }) {

    const router = useRouter();
    // will keep track of pathname and if active
    const isActive = route => router.pathname === route;

    return (
        <>
            <Menu fluid borderless>
                <Container text>
                    <Link href="/">
                        <Menu.Item header active={isActive("/")}>
                            <Icon name="rss" size="large" />
                        </Menu.Item>
                    </Link>

                    {/* if unread messages = true or isActive on messages path */}
                    <Link href="/messages">
                        <Menu.Item header active={isActive("/messages") || unreadMessage}>
                            <Icon
                                name={unreadMessage ? "hand point right" : "mail outline"}
                                size="large"
                            />
                        </Menu.Item>
                    </Link>
                    {/* if unread notification = true or notifications = isActive */}
                    <Link href="/notifications">
                        <Menu.Item header active={isActive("/notifications") || unreadNotification}>
                            <Icon
                                name={unreadNotification ? "hand point right" : "bell outline"}
                                size="large"
                            />
                        </Menu.Item>
                    </Link>

                    <Dropdown item icon="bars" direction="left">
                        <Dropdown.Menu>
                            <Link href={`/${username}`}>
                                <Dropdown.Item active={isActive(`/${username}`)}>
                                    <Icon name="user" size="large" />
                                    Account
                                </Dropdown.Item>
                            </Link>

                            <Link href="/search">
                                <Dropdown.Item active={isActive("/search")}>
                                    <Icon name="search" size="large" />
                                    Search
                                </Dropdown.Item>
                            </Link>

                            <Dropdown.Item onClick={() => logoutUser(email)}>
                                <Icon name="sign out alternate" size="large" />
                                Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>
            </Menu>
        </>
    );
}

export default ResponsiveLayout;