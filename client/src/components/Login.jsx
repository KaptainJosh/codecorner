/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the component for the Login page of our application. 
*/

import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

// Registration Component
function Login() {
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
    // marginLeft: "43%",
    // marginRight: "30%",
    marginTop: "5%",
    // width: "50%",
    //color: "#000000",
    textAlign: "center",
  };

  const inputLabel = {
    marginLeft: "5%",
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontSize: 20,
  };

  const loginButton = {
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
    textAlign: "center",
  };

  const register = {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 20,
    textAlign: "center",
    // marginLeft: "25%",
    // marginRight: "25%",
  };

  const navigate = useNavigate();

  // Holds the values given by user for username and password
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  // handler to handle changes to the input fields in login forms
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
      axios.post("/login", newUser, { withCredentials: true }).then((res) => {
        if (res.data.message === "Invalid Login") {
          alert(res.data.message);
        } else {
          console.log(res);
          //const token = res.data.user;
          //localStorage.setItem("token", token);
          //console.log(localStorage.token);
          alert("Logged In");
          navigate("/wall");
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
      {/* Login Form */}

      <form style={box}>
        <h3 style={header}>Login</h3>
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
        <button type="submit" onClick={handleClick} style={loginButton}>
          Login
        </button>
        <p style={register}>
          New to CodeCorner? <Link to="/">Join Now</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
