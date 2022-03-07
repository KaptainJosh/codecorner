/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the component for the Wall page of our application. 
*/

import React from "react";
import { Link} from "react-router-dom";

// Registration Component
function Wall() {
    
    return <div className="container">
        <h1>Wall</h1>
        <Link to="/logout">Logout</Link>  
    </div>
}

export default Wall;