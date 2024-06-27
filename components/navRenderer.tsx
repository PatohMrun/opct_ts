"use client"
import React, { useState } from "react";
import Navbar from "./navbar";
import GlobalNav from "./globalNav";
const NavRender = () => {

    const [ isLoggedIn, setIsLoggedIn ] = useState(false);



    return (  
        <div>
            {isLoggedIn ? <GlobalNav /> : <Navbar />}
        </div>
    );
}
 
export default NavRender;