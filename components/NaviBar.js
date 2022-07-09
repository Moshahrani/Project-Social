import React from "react";
import { Menu, Container, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";
import Link from "next/link";

function NaviBar() {
    const router = useRouter()

    // function to check which page we are on
    const isActive = route => router.pathname === route;

    return (
        <Menu fluid borderless>
            <Container text>
                <Link href="/login">
                    <Menu.Item header active={isActive('/login')}>
                        <Icon size="big" name="sign in" />
                        Login
                    </Menu.Item>
                </Link>

                <Link href="/signup">
                    <Menu.Item header active={isActive('/signup')}>
                        <Icon size="big" name="signup" />
                        Sign Up
                    </Menu.Item>
                </Link>

            </Container>
        </Menu>
    )
}

export default NaviBar;
