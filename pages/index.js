import React, { useEffect } from "react";
import axios from "axios"
import baseUrl from "../utilities/baseUrl";

function Index({ user, userFollowInfo }) {
    
  useEffect(() => {
      document.title = `Welcome, ${user.name.split(" ")[0]}`;
  }, []);


    return <div>Home</div>
}

export default Index;
