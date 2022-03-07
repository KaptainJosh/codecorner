/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the component for the Registration page of our application. 
*/

import React, {useState} from "react";
import axios from "axios";
import { Link, useNavigate} from "react-router-dom";

// Registration Component
function Registration() {

    const navigate = useNavigate();

    // Holds the values given by user for username and password
    const [input, setInput] = useState({
        username: '',
        password: ''
    })

    // handler to handle changes to the input fields in registration forms
    function handleChange(event) {
        const {name, value} = event.target;

        setInput(prevInput => {
            return {
                ...prevInput,
                [name]: value
            }
        })
    }

    // handler to handle clicking Submit button
    function handleClick(event) {
        event.preventDefault();

        const newUser = {
            username: input.username,
            password: input.password
        };
        
        if (newUser.username && newUser.password)
        {
            axios.post('http://localhost:3001/registration', newUser).then(res=> {
                if (res.data.message === 'Username already taken')
                {
                    alert(res.data.message);
                }   
                
                else
                {
                    alert("Registered");
                    navigate("/login");
                }
            
            });
        }

        else
        {
            alert("Missing Username or Password");
        }

        
    }

    
    return <div className="container">
        {/* CodeCorner Logo*/}
        <img src="/assets/images/CodeCornerLogo.png" alt="Logo"/> 
        {/* Registration Form */}
        
        <form>
            <h3>Register</h3>
            {/*Username Field */}
             <div className='form-group'> 
                <label htmlFor="InputUsername">Username</label>
                <input required onChange={handleChange} name="username" value={input.username} className="form-control" placeholder="Enter Username" type="text"></input>
            </div>
            {/*Password Field */}
            <div className="form-group"> 
                <label htmlFor="InputPassword">Password</label>
                <input required onChange={handleChange} name="password" value={input.password} className="form-control" placeholder="Enter Password" type='password'></input>
            </div>
            {/* Submit Button */}
            <button type="submit" onClick={handleClick} className="btn btn-lg btn-info">Join</button>
        </form> 
        <Link to="/login">Login</Link>  
    </div>
}

export default Registration;