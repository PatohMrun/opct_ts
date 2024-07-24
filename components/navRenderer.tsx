"use client"
import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import GlobalNav from "./globalNav";
import { isLoggedIn } from "@/utils/auth";

const NavRender = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = () => {
            const loginStatus = isLoggedIn();
            console.log("Is logged in:", loginStatus);
            setLoggedIn(loginStatus);
        };

        // Check login status when the component mounts
        checkLoginStatus();

        // Set up an interval to periodically check login status
        const interval = setInterval(checkLoginStatus, 60000); // Check every minute

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);

    // This useEffect will log whenever loggedIn changes
    useEffect(() => {
        console.log("loggedIn state updated:", loggedIn);
    }, [loggedIn]);

    return (  
        <div>
            {loggedIn ? <GlobalNav /> : <Navbar />}
        </div>
    );
}
 
export default NavRender;