/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the component for the Wall page of our application. 
*/

import React from "react";
import { Link, useNavigate} from "react-router-dom";
import $ from "jquery";
import axios from "axios";
const hljs = require("highlight.js")



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
    let page = 0;
    let totalNumPosts;

    $(document).ready(() => {
        getNumPosts();
        getPosts();

        document.getElementById("prevPageButton").disabled = true;
    });

    function getPosts() {
        //Remove posts that are already displayed
        document.getElementById('posts').innerHTML = "";

        //Query and display posts
        fetch("/getPosts?page="+page, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            }).then(res => {
                res.json().then(posts => displayPosts(posts));
            }
        );
    }

    function displayPosts(posts) {
        for (let post of posts) {
            let postElement = document.createElement("div");

            const baseStyle = "border: 1px solid black; border-radius: 15px; margin: 10px; padding: 5px; background-color: #edf0ee;"
            postElement.style = baseStyle;

            let timestamp = parseInt(post["time"]);
            let timeString = getLocalTimeString(timestamp);

            //Display user, time, and content
            postElement.innerHTML = `<p><b style="font-size: 14px;">${post["user"]}</b><br/>${timeString}<hr>${post["content"]}<br/></p>`;
            
            //Add link to specific post
            let postId = post["_id"];
            postElement.onclick = function() {
                navigate(`/posts/${postId}`);
            };

            //Change color on hover to indicate that post is clickable
            postElement.onmouseover = function() {
                this.style = baseStyle + "background-color: #D3D3D3; cursor: pointer; ";
            };

            postElement.onmouseout = function() {
                this.style = baseStyle;
            };

            //Display tags, if there are any
            if ("tags" in post && post["tags"].length > 0) {
                postElement.innerHTML += "<hr>Tags: ";
                for (let tag of post["tags"]) {
                    postElement.innerHTML += tag + ", ";
                }
                postElement.innerHTML = postElement.innerHTML.slice(0, -2); //Remove trailing comma and space
            }

            document.getElementById('posts').appendChild(postElement);
        }

        hljs.highlightAll();
    }

    //This function retrieves the total number of posts
    //It is needed to ensure the user can't navigate to more pages 
    //Than there are poosts
    function getNumPosts() {
        fetch("/getNumPosts", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        }).then(res => {
            res.json().then(tmp => totalNumPosts = tmp.length);
        });
    }

    //Code inspired by https://stackoverflow.com/questions/44060804/convert-epoch-time-to-human-readable-with-specific-timezone
    function getLocalTimeString(timestamp) {
        let date = new Date(timestamp * 1000);
        let utc = date.getTime() + (date.getTimezoneOffset() * 60000);  //This converts to UTC 00:00

        //Convert to user's local time zone
        const localOffset = new Date().getTimezoneOffset() / -60;
        let adjustedDate = new Date(utc + 3600000*localOffset);
        return adjustedDate.toLocaleString();
    }

    function loadNextPage() {
        const postsPerPage = 10;
        const totalPages = Math.ceil(totalNumPosts / postsPerPage);

        if (page + 1 < totalPages) {
            page++;
            getPosts();

            document.getElementById("prevPageButton").disabled = false;

            if (page === totalPages - 1) {
                document.getElementById("nextPageButton").disabled = true;
            }
        }
    }

    function loadPreviousPage() {
        if (page - 1 >= 0) {
            page--;
            getPosts();

            document.getElementById("nextPageButton").disabled = false;

            if (page === 0) {
                document.getElementById("prevPageButton").disabled = true;
            }
        }
    }
    
    return <div className="container">
        <h1>Wall</h1>
        <Link to="/login" onClick={handleClick}>Logout</Link> 
        <br />
        <Link to="/makePost">Make Post</Link> 

        <div className="container" id="posts">
        </div>

        <button onClick={loadPreviousPage} id="prevPageButton" style={{float: "left", fontSize: "20px", margin: "5px"}}>Previous Page</button>
        <button onClick={loadNextPage} id="nextPageButton" style={{float: "right", fontSize: "20px", margin: "5px"}}>Next Page</button>
    </div>
}

export default Wall;