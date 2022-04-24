/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the component for the Registration page of our application. 
*/

import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// Registration Component
function Registration() {
  const logo = {
    marginLeft: "35%",
    marginTop: 50,
    display: "block",
    width: "30%",
  };
  const box = {
    border: "1px solid #f1f1f1",
    marginBottom: 25,
    marginTop: 50,
    //marginRight: 25,
    marginLeft: "25%",
    display: "block",
    width: "50%",
    borderRadius: 15,
    backgroundColor: "white",
  };

  const inputField = {
    width: "90%",
    marginLeft: "5%",
    marginTop: "2%",
  };

  const header = {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 30,
    // lineHeight: 2,
    // marginLeft: "40%",
    // marginRight: "30%",
    textAlign: "center",
    marginTop: "5%",
    // width: "50%",
    //color: "#000000",
  };

  const inputLabel = {
    marginLeft: "5%",
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontSize: 20,
  };

  const joinButton = {
    background: "#0A66C2",
    border: "1px solid #000000",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: 11,
    width: "50%",
    color: "white",
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 24,
    marginLeft: "25%",
    marginTop: "5%",
    marginBottom: "5%",
  };

  const login = {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 20,
    // marginLeft: "20%",
    // marginRight: "20%",
    textAlign: "center",
  };

  const navigate = useNavigate();

  // Holds the values given by user for username and password
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  // handler to handle changes to the input fields in registration forms
  function handleChange(event) {
    const { name, value } = event.target;

    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value,
      };
    });
  }

  // handler to handle clicking Submit button
  function handleClick(event) {
    event.preventDefault();

    const newUser = {
      username: input.username,
      password: input.password,
    };

    if (newUser.username && newUser.password) {
      axios.post("/registration", newUser).then((res) => {
        if (res.data.message === "Username already taken") {
          alert(res.data.message);
        } else if (res.data.message === "Failed to Create User") {
          alert(res.data.message);
        } else {
          alert("Registered");
          navigate("/login");
        }
      });
    } else {
      alert("Missing Username or Password");
    }
  }

  document.body.style = "background: #c7c7c7";
  return (
    <div className="container">
      {/* CodeCorner Logo*/}
      <img style={logo} src="/assets/images/CodeCornerLogo.png" alt="Logo" />
      {/* Registration Form */}

      <form style={box}>
        <h3 style={header}>Join Us</h3>
        {/*Username Field */}
        <div className="form-group">
          <label htmlFor="InputUsername" style={inputLabel}>
            Username
          </label>
          <input
            required
            onChange={handleChange}
            name="username"
            value={input.username}
            className="form-control"
            placeholder="Enter Username"
            type="text"
            style={inputField}
          ></input>
        </div>
        {/*Password Field */}
        <div className="form-group">
          <label htmlFor="InputPassword" style={inputLabel}>
            Password
          </label>
          <input
            required
            onChange={handleChange}
            name="password"
            value={input.password}
            className="form-control"
            placeholder="Enter Password"
            type="password"
            style={inputField}
          ></input>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleClick}
          // class="btn btn-primary"
          style={joinButton}
        >
          Join
        </button>
        <br />
        <p style={login}>
          Already Joined CodeCorner? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Registration;
