import React from "react";
import { Link} from "react-router-dom";
import $ from "jquery";
import { useNavigate} from "react-router-dom";
const hljs = require("highlight.js")

function Post() {
	const navigate = useNavigate();
	$(document).ready(() => {
		//Add background color
        document.body.style = "background: #c7c7c7";

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
					displayPost(post[0]);
					displayComments(post[0]);
				});
            }
        );

		$("#submitButton").click(() => {
            console.log($("#commentTextarea").val());
            const timestamp = getUTCTimestampSeconds();
    
            const postData = {
                user: "Prototype",
                time: timestamp,
                content: $("#commentTextarea").val(),
				postId:  postId
            };
    
            fetch("/submitComment", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(postData)
                }).then(res => console.log("Comment submitted!")
            );

			$("#commentTextarea").val("");

			//Insert new comment onto page to avoid annoying reloads
			let newComment = formatComment(postData);
			const commentRoot = document.getElementById('comments');
			commentRoot.appendChild(newComment);
        });
	});

	function displayPost(post) {
		let postElement = document.getElementById("post");
		postElement.style = "border: 1px solid black; border-radius: 15px; margin: 10px; padding: 5px; background-color: #d9d9d9;"

		let timestamp = parseInt(post["time"]);
		let timeString = getLocalTimeString(timestamp);

		//Display user, time, and content
		postElement.innerHTML = `<p><b style="font-size: 18px;">${post["user"]}</b><br/>${timeString}<hr>${post["content"]}<br/></p>`;

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

	function displayComments(post) {
		if ("comments" in post && post["comments"].length > 0) {
			let comments = post["comments"];
			const commentRoot = document.getElementById('comments');
			commentRoot.innerHTML = "";

			for (let comment of comments) {
				let newComment = formatComment(comment);

				commentRoot.appendChild(newComment);
			}
		}
	}

	function formatComment(comment) {
		let timestamp = parseInt(comment["time"]);
		let timeString = getLocalTimeString(timestamp);

		let newComment = document.createElement('div');
		newComment.style = "border: 1px solid black; border-radius: 15px; margin: 10px; padding: 5px; background-color: #d9d9d9;"
		newComment.innerHTML = `<p><b style="font-size: 16px;">${comment["user"]}</b><br/>${timeString}<hr>${comment["content"]}<br/></p>`;

		return newComment;
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

	function getUTCTimestampSeconds() {
        //Simplified code based on https://stackoverflow.com/questions/9756120/how-do-i-get-a-utc-timestamp-in-javascript 
        const currentTime = new Date();
        return Math.floor(currentTime.getTime() / 1000);
    }

	return <div className="container">
		{/* CodeCorner Logo*/}
        <img src="/assets/images/CodeCornerLogo.png" alt="Logo"/> 

		<br />
		<br />
        
        <button onClick={() => navigate("/login")} style={{float: "right", fontSize: "20px", marginBottom: "15px", backgroundColor: "#0a66c2", color: "white", display: "inline-block", width: "auto", height: "auto", border: "1px solid black", borderRadius: "5px"}}>Logout</button> 
        <button onClick={() => navigate("/wall")} style={{float: "left", fontSize: "20px", marginBottom: "15px", backgroundColor: "#0a66c2", color: "white", display: "inline-block", width: "auto", height: "auto", border: "1px solid black", borderRadius: "5px"}}>Return to Wall</button> 

		<br />
		<br />
		<br />

		<div id="post"></div>

		<br />

		<div>
			<h3>Comments</h3>

			<textarea id="commentTextarea" rows="10" cols="75" style={{background: "#e3e3e3"}}></textarea>
			<br />
			<button id="submitButton" style={{fontSize: "16px", backgroundColor: "#0a66c2", color: "white", border: "1px solid black", borderRadius: "5px"}}>Submit Comment</button>
		</div>

		<br />
		<div id="comments"></div>
    </div>
}

export default Post;
