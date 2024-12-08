import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth";
import ErrorPage from "./ErrorPage";

const Login = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Values, setValues] = useState({
    email: "",
    password: "",
  }); 

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/sign-in",
        Values,
        {
          withCredentials: true,
        }
      );

      dispatch(authActions.login({ isAdmin: false, token: res.data.token }));
      navigate("/profile");
      console.log(res.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <ErrorPage />
      ) : (
        <div className="h-screen bg-zinc-900 flex items-center justify-center">
          <ToastContainer position="top-center" draggable />
          <div className="w-11/12 max-w-md bg-zinc-800 text-white p-8 rounded-lg shadow-xl">
            {/* Header */}
            <div className="text-center mb-6">
              <Link to="/" className="text-3xl font-bold text-white">
                PODSTAR
              </Link>
              <p className="text-gray-400 mt-2">
                Welcome back! Please log in to continue.
              </p>
            </div>
            {/* Login Form */}
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={Values.email}
                  onChange={change}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={Values.password}
                  onChange={change}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 bg-gray-700 text-gray-200 rounded-lg outline-none border border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            {/* Submit Button */}
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-2 bg-zinc-500 hover:bg-green-800 text-white font-semibold text-lg rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Login
              </button>
            </div>
            {/* Signup Link */}
            <div className="mt-4 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-700 hover:text-green-500 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
