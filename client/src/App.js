/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the Routing and components for our application. 
*/

import Registration from "./components/Registration";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./components/Login";
import Wall from "./components/Wall";
import MakePost from "./components/MakePost";
import Post from "./components/Post";
import { useEffect } from "react";
import { keepTheme } from "./themes";
import Toggle from "./components/Toggle";
import "./style.css";

function App() {
  useEffect(() => {
    keepTheme();
  });
  return (
    <Router>
      <h3
        style={{
          marginTop: "2%",
          marginLeft: "87%",
          fontFamily: "Montserrat",
          fontStyle: "normal",
        }}
      >
        Dark/Light Toggle
      </h3>
      <Toggle></Toggle>

      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/wall" element={<Wall />} />
        <Route path="/makePost" element={<MakePost />} />
        <Route path="/posts/*" element={<Post />} />
      </Routes>
    </Router>
  );
}
export default App;
