/* Author: Joshua Thomas
   Class: CSCE 3444
   Purpose: This file holds the Routing and components for our application. 
*/

import Registration from "./components/Registration";
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom"
import Login from "./components/Login";
import Wall from "./components/Wall";
import MakePost from "./components/MakePost";
import Post from "./components/Post";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/wall" element={<Wall/>}/>
        <Route path="/makePost" element={<MakePost/>} />
        <Route path="/posts/*" element={<Post />} />
      </Routes>
    </Router>
  )
  
}
export default App;
