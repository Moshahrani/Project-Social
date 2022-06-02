import React from 'react';
import { List, Icon } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";

function SideMenu({ user: {username, email, unreadNotification, unreadMessage }}) {
    const router = useRouter();

    const isActive = route => router.pathname === route;

  return <>
     <List 
     style={{ paddingTop: "1rem" }} 
     size="big" 
     verticalAlign="middle"
     selection>
        
     <Link href="/">
         <List.Item active={isActive("/")}>
             <Icon name="home" size="large" color={isActive("/") && "green" } />
             <List.Content>
                 <List.Header content="Home" />
             </List.Content>
         </List.Item>
     </Link>
      
     <Link href="/messages">
         <List.Item active={isActive("/messages")}>
             <Icon name={unreadMessage ? "hand point right" : "mail outline"}
              size="large" 
              color={(isActive("/messages") && "teal") || (unreadMessage && "orange")
              }
               />
             <List.Content>
                 <List.Header content="Messages" />
             </List.Content>
         </List.Item>
     </Link>




     </List>
     </>
}

export default SideMenu