/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the component for the Wall page of our application. 
*/

import React from "react";
import { Link, useNavigate} from "react-router-dom";
import $ from "jquery";
import axios from "axios";



// Registration Component
function Wall() {
    const navigate = useNavigate();

    function handleClick(event) {
        event.preventDefault();
        axios.post('/logout',).then(res=> {
            if (res.data.message === 'User Logged Out')
            {
                alert(res.data.message);
            }
    
            navigate("/login");
        
        });
    }

    $(document).ready(() => {
        fetch("/getPosts", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            }).then(res => {
                res.json().then(posts => {
                    for (let post of posts) {
                        let postElement = document.createElement("div");
                        postElement.style = "border: 1px solid black; margin: 10px; padding: 5px;";
                        postElement.innerHTML = `<p>User: ${post["user"]}<hr>${post["content"]}<br/></p>`;

                        document.getElementById('posts').appendChild(postElement);
                    }
                });
            }
        );
    });
    
    return <div className="container">
        <h1>Wall</h1>
        <Link to="/login" onClick={handleClick}>Logout</Link> 
        <br />
        <Link to="/makePost">Make Post</Link> 

        <div className="container" id="posts">
        </div>
    </div>
}

export default Wall;