// admin login

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with:", credentials);
    try {
      const res = await axios.post("http://localhost:3000/api/v1/admin-sign-in", credentials,
      {withCredentials:true}
    );
      console.log("Response:", res.data);
      if (res.data.message === "Admin sign-in successful") {
        dispatch(authActions.login({ isAdmin: true, token: res.data.token }));
        navigate("/admin-dashboard");
      }
      else {
        //console.log("Login unsuccessful:", res.data);
        toast.error("Login unsuccessful");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data.message || "Admin login failed");
    }
  };

  return (
    <div className="h-screen bg-zinc-900 flex items-center justify-center">
      <ToastContainer position="top-center" draggable />
      <div className="w-11/12 max-w-md bg-zinc-800 text-white p-8 rounded-lg shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <p className="text-gray-400 mt-2">Please login to manage the platform.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-zinc-500 hover:bg-green-800 text-white font-semibold text-lg rounded-lg shadow-md"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
