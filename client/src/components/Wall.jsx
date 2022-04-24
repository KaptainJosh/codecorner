/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the component for the Wall page of our application. 
*/

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import axios from "axios";
import Cookies from "js-cookie";
const hljs = require("highlight.js");

// Registration Component
function Wall() {
  const tagStyle = {
    float: "left",
    fontSize: "20px",
    margin: "0px",
    marginRight: "20px",
    backgroundColor: "#0a66c2",
    color: "white",
    display: "inline-block",
    width: "auto",
    height: "auto",
    border: "1px solid black",
    borderRadius: "5px",
    fontFamily: "Montserrat",
    fontStyle: "normal",
    // top: "50%",
    // left: "50%",
  };

  const navigate = useNavigate();

  function handleClick(event) {
    event.preventDefault();
    axios.post("/logout").then((res) => {
      if (res.data.message === "User Logged Out") {
        alert(res.data.message);
      }

      navigate("/login");
    });
  }
  let page = 0;
  if (Cookies.get("page")) {
    page = Cookies.get("page");
  }
  Cookies.set("page", 0);

  let totalNumPosts;

  function handleTag(tag) {
    page = 0;
    getNumFilteredPosts(tag);
    getFilteredPosts(tag);

    document.getElementById("prevPageButton").disabled = true;
  }

  function resetFilter() {
    getNumPosts();
    getPosts();

    document.getElementById("prevPageButton").disabled = true;
  }

  $(document).ready(() => {
    //Add background color
    document.body.style = "background: #c7c7c7";

    getNumPosts();
    getPosts();

    const postsPerPage = 10;
    const totalPages = Math.ceil(totalNumPosts / postsPerPage);

    if (page === 0) {
      document.getElementById("prevPageButton").disabled = true;
    }

    if (page === totalPages - 1) {
      document.getElementById("nextPageButton").disabled = true;
    }
  });

  function getPosts() {
    //Remove posts that are already displayed
    document.getElementById("posts").innerHTML = "";

    //Query and display posts
    fetch("/getPosts?page=" + page, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => {
      res.json().then((posts) => displayPosts(posts));
    });
  }

  function getFilteredPosts(tag) {
    //Remove posts that are already displayed
    document.getElementById("posts").innerHTML = "";

    fetch(`/getFilteredPosts?tag=${tag}&page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => {
      res.json().then((posts) => displayPosts(posts));
    });
  }

  function displayPosts(posts) {
    for (let post of posts) {
      let postElement = document.createElement("div");

      const baseStyle =
        "border: 1px solid black; border-radius: 15px; margin: 10px; padding: 5px; background-color: #d9d9d9;";
      postElement.style = baseStyle;

      let timestamp = parseInt(post["time"]);
      let timeString = getLocalTimeString(timestamp);

      let postId = post["_id"];

      //Display user, time, and content
      //Also include a hidden link to the post, for accessibility
      postElement.innerHTML = `<a href="/posts/${postId}" style="display: none">Navigate to post by ${post["user"]}</a>`;
      postElement.innerHTML += `<p><b style="font-size: 14px;">${post["user"]}</b><br/>${timeString}<hr>${post["content"]}<br/></p>`;

      //Add link to specific post
      postElement.onclick = function () {
        Cookies.set("page", page);
        navigate(`/posts/${postId}`);
      };

      //Change color on hover to indicate that post is clickable
      postElement.onmouseover = function () {
        this.style = baseStyle + "background-color: #c2c2c2; cursor: pointer; ";
      };

      postElement.onmouseout = function () {
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

      document.getElementById("posts").appendChild(postElement);
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
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => {
      res.json().then((tmp) => (totalNumPosts = tmp.length));
    });
  }

  function getNumFilteredPosts(tag) {
    fetch(`/getNumFilteredPosts/${tag}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((res) => {
      res.json().then((tmp) => (totalNumPosts = tmp.length));
    });
  }

  //Code inspired by https://stackoverflow.com/questions/44060804/convert-epoch-time-to-human-readable-with-specific-timezone
  function getLocalTimeString(timestamp) {
    let date = new Date(timestamp * 1000);
    let utc = date.getTime() + date.getTimezoneOffset() * 60000; //This converts to UTC 00:00

    //Convert to user's local time zone
    const localOffset = new Date().getTimezoneOffset() / -60;
    let adjustedDate = new Date(utc + 3600000 * localOffset);
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

  return (
    <div className="container">
      {/* CodeCorner Logo*/}
      <img src="/assets/images/CodeCornerLogo.png" alt="Logo" />

      <br />

      <button
        onClick={() => navigate("/login")}
        style={{
          float: "right",
          fontSize: "20px",
          margin: "0px",
          backgroundColor: "#0a66c2",
          color: "white",
          display: "inline-block",
          width: "auto",
          height: "auto",
          border: "1px solid black",
          borderRadius: "5px",
          fontFamily: "Montserrat",
          fontStyle: "normal",
          marginTop: 30,
        }}
      >
        Logout
      </button>
      <button
        onClick={() => navigate("/makePost")}
        style={{
          float: "left",
          fontSize: "20px",
          margin: "0px",
          backgroundColor: "#0a66c2",
          color: "white",
          display: "inline-block",
          width: "auto",
          height: "auto",
          border: "1px solid black",
          borderRadius: "5px",
          fontFamily: "Montserrat",
          fontStyle: "normal",
          marginTop: 30,
        }}
      >
        Make Post
      </button>

      <br />
      <br />
      <h1
        style={{
          textAlign: "center",
          marginTop: 50,
          fontSize: 50,
          fontFamily: "Montserrat",
          fontStyle: "normal",
          fontWeight: 500,
        }}
      >
        The Wall
      </h1>

      {/* <br />
      <br />
      <br />
      <br /> */}
      <br />
      <h3
        style={{
          float: "left",
          fontSize: "30px",

          marginRight: "20px",

          display: "inline-block",
          fontFamily: "Montserrat",
          fontStyle: "normal",
        }}
      >
        Filter by Tag
      </h3>
      <br />
      <br />
      <br />
      <br />
      <button
        value="JavaScript"
        style={tagStyle}
        onClick={(e) => handleTag(e.target.value)}
      >
        Javascript
      </button>
      <button
        value="C%2B%2B"
        onClick={(e) => handleTag(e.target.value)}
        style={tagStyle}
      >
        C++
      </button>
      <button
        value="Web Dev"
        onClick={(e) => handleTag(e.target.value)}
        style={tagStyle}
      >
        Web Dev
      </button>
      <button
        value="Embedded Systems"
        onClick={(e) => handleTag(e.target.value)}
        style={tagStyle}
      >
        Embedded Systems
      </button>
      <button
        value="Computer Graphics"
        onClick={(e) => handleTag(e.target.value)}
        style={tagStyle}
      >
        Computer Graphics
      </button>
      <button
        value="C%23"
        onClick={(e) => handleTag(e.target.value)}
        style={tagStyle}
      >
        C#
      </button>
      <button onClick={resetFilter} style={tagStyle}>
        Reset Filter
      </button>

      <br />
      <br />

      <div className="container" id="posts" style={{ marginTop: "40px" }}></div>

      <button
        onClick={loadPreviousPage}
        id="prevPageButton"
        style={{
          float: "left",
          fontSize: "20px",
          margin: "5px",
          backgroundColor: "#0a66c2",
          color: "white",
          border: "1px solid black",
          borderRadius: "5px",
          fontFamily: "Montserrat",
          fontStyle: "normal",
        }}
      >
        Previous Page
      </button>
      <button
        onClick={loadNextPage}
        id="nextPageButton"
        style={{
          float: "right",
          fontSize: "20px",
          margin: "5px",
          backgroundColor: "#0a66c2",
          color: "white",
          border: "1px solid black",
          borderRadius: "5px",
          fontFamily: "Montserrat",
          fontStyle: "normal",
        }}
      >
        Next Page
      </button>
    </div>
  );
}

export default Wall;
