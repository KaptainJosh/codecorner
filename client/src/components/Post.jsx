import React from "react";
import { Link} from "react-router-dom";
import $ from "jquery";
import axios from "axios";
const hljs = require("highlight.js")

function Post() {
	var thePost = null;
	var numLikes;
	$(document).ready(() => {
		//Get post ID since path is of form /posts/ID
		const postId = window.location.pathname.split('/')[2];

		fetch(`/getSpecificPost/${postId}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            }).then(res => {
                res.json().then(post => {
					const thePost = post[0];
					let numLikes = thePost['numLikes']
					displayPost(post[0]);
					displayLikes(numLikes)
				});
            }
        );
	});
	
	function handleClick() {
		
		console.log(thePost["user"]);
		//console.log(numLikes);
		numLikes++;
		const id = thePost["_id"];
		const data = {id: id, numLikes: numLikes};
		//console.log(data);
		axios.post('/likes', data).then((res) => {
			//console.log(res);
			window.location.reload(false);
		})
	}

	function displayLikes(numLikes)
	{
		let likeElement = document.getElementById("likes");

		likeElement.innerHTML = `Likes ${numLikes}`;
	}

	function displayPost(post) {
		let postElement = document.getElementById("post");
		postElement.style = "border: 1px solid black; margin: 10px; padding: 5px;";

		let timestamp = parseInt(post["time"]);
		let timeString = getLocalTimeString(timestamp);

		//Display user, time, and content
		postElement.innerHTML = `<p><b style="font-size: 14px;">${post["user"]}</b><br/>${timeString}<hr>${post["content"]}<br/></p>`;

		//Display tags, if there are any
		if ("tags" in post && post["tags"].length > 0) {
			postElement.innerHTML += "<hr>Tags: ";
			for (let tag of post["tags"]) {
				postElement.innerHTML += tag + ", ";
			}
			postElement.innerHTML = postElement.innerHTML.slice(0, -2); //Remove trailing comma and space
		}

		hljs.highlightAll();
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

	return <div className="container">
        <h1>Specific Post</h1>
        <Link to="/login">Logout</Link> 
        <br />

		<Link to="/wall">Return to Wall</Link>

		<div id="post"></div>

		<br />

		<button onClick={handleClick} id="likes"></button>
    </div>
}

export default Post;
