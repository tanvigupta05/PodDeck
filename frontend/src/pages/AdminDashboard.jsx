import React, {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { authActions } from "../store/auth";
import axios from "axios"; // Import axios
import { toast } from "react-toastify"; // Optional: Add toast for feedback
import "react-toastify/dist/ReactToastify.min.css"; // Import Toast styles

const AdminDashboard = () => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const dispatch = useDispatch(); // Initialize dispatch
  const navigate = useNavigate(); // Initialize navigate

  /* if (!isAdmin) {
    return <Navigate to="/" />;
  } */

  const handleLogout = async () => {
    try {
      // Logout API call
      const res = await axios.post(
        "http://localhost:3000/api/v1/admin-logout",
        {}, // Empty object for logout request
        { withCredentials: true }
      );

      console.log(res.data.message); 

      // Dispatch logout action to clear Redux store
      dispatch(authActions.logout()); // Update the Redux store

      // Clear any additional localStorage if needed
      localStorage.removeItem("adminToken"); // Optionally, clear admin token from localStorage
      navigate("/"); // Use navigate for routing
      toast.success("Logged out successfully!");
    } 
    catch (error) {
      console.error("Logout failed:", error);
      toast.error("Admin logout failed"); // Show error toast
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Profile Header */}
      <header className="flex justify-between items-center p-4 bg-zinc-800 shadow-md">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-6">
          {/* Profile Icon */}
          <div className="relative">
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-green-500"
            />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Options (Sidebar or options) */}
      <nav className="bg-zinc-800 p-4 space-y-4">
        <Link
          to="/admin/users"
          className="block text-white hover:bg-zinc-700 px-4 py-2 rounded-lg"
        >
          Users List
        </Link>
        <Link
          to="/admin/podcasts"
          className="block text-white hover:bg-zinc-700 px-4 py-2 rounded-lg"
        >
          Podcasts
        </Link>
      </nav>

      {/* Content (e.g., user list or podcasts will go here) */}
      <div className="flex-1 p-4">
        {/* Content will be rendered here */}
        <p className="text-gray-400">Welcome to the Admin Dashboard.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
