import React, {useEffect} from 'react';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import MainLayout from './layout/MainLayout';
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import axios from 'axios';
import {useDispatch} from "react-redux";
import {authActions} from "./store/auth";
import AddPodcast from './pages/AddPodcast';
import AllPodcasts from './pages/AllPodcasts';
import CategoriesPage from './pages/CategoriesPage';
import DescriptionPage from './pages/DescriptionPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminUsers from './pages/AdminUsers';
import AdminPodcasts from './pages/AdminPodcasts';
import ReportedPodcasts from './pages/ReportedPodcasts';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/checkCookie", { withCredentials: true });
        if (res.data.message) {
          dispatch(authActions.login({ isAdmin: res.data.isAdmin })); // Pass isAdmin from response
        }
      } catch (error) {
        console.log("Authentication check failed:", error);
      }
    };
    fetchAuthStatus();
  }, [dispatch]);
  
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout/>}>
            {" "}
            <Route index element={<Home/>} />
            <Route path="/categories" element={<Categories/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/add-podcast" element={<AddPodcast/>}/>
            <Route path="/all-podcasts" element={<AllPodcasts/>}/>
            <Route path="/categories/:cat" element={<CategoriesPage/>}/>
            <Route path="/description/:id" element={<DescriptionPage/>}/>
            <Route path="/favorites" element={<FavoritesPage/>}/>
            <Route path="/admin/users" element={<AdminUsers/>} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/reports" element={<ReportedPodcasts />} />
            <Route path="/admin/podcasts" element={<AdminPodcasts/>} />
          </Route>
          <Route path="/" element={<AuthLayout/>}>
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/admin/login" element={<AdminLogin/>} />
          </Route> 
        </Routes>
      </Router>
    </div>
  );
};

export default App;