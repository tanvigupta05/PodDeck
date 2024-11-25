import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [UserData, setUserData] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      const res = await axios.get("http://localhost:3000/api/v1/user-details", {
        withCredentials: true,
      });
      setUserData(res.data.user);
    };
    fetchUserDetails();
  }, []);
  
  const LogoutHandler = async () => {
    const res = await axios.post("http://localhost:3000/api/v1/logout", { withCredentials: true });
    console.log(res);
    dispatch(authActions.logout());
    navigate("/");
  };
  
  return (
    <>
      {UserData && (
        <div className="bg-zinc-800 text-zinc-50 rounded py-8 flex flex-col md:flex-row items-center justify-between px-4 lg:px-12">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-zinc-400">Profile</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl text-zinc-100 font-bold text-center">
              {UserData.username}
            </h1>
            <p className="text-zinc-400 mt-1">{UserData.email}</p>
          </div>
          <div>
            <button
              className="bg-zinc-300 px-4 py-2 rounded text-zinc-900 font-semibold hover:bg-zinc-500 transition-all duration-300"
              onClick={LogoutHandler}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;