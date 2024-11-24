import React from 'react';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import MainLayout from './layout/MainLayout';
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import { useEffect } from 'react';
import axios from 'axios';
import {useDispatch} from "react-redux";
import {authActions} from "./store/auth";
import AddPodcast from './pages/AddPodcast';

const App = () => {
  const dispatch= useDispatch();
  useEffect(() =>{
    const fetch = async()=> {
    try {
        const res= await axios.get("http://localhost:3000/api/v1/checkCookie", {withCredentials:true});
        if(res.data.message){
          dispatch(authActions.login());
        };
    } catch (error) {
      //console.log(error);
    }
    };
    fetch();
  }, []);
  
  return (
    <div className="">
      <Router>
        <Routes >
          <Route path="/" element={<MainLayout/>}>
            {" "}
            <Route index element={<Home/>} />
            <Route path="/categories" element={<Categories/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/add-podcast" element={<AddPodcast/>}/>
          </Route>
          <Route path="/" element={<AuthLayout/>}>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
          </Route> 
        </Routes>
      </Router>
    </div>
  );
};

export default App;