import React from "react";
import { useSelector } from "react-redux";
import ErrorPage from "./ErrorPage";
import Header from "../components/Profile/Header";
import YourPodcast from "../components/Profile/YourPodcast";

const Profile = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <div className="bg-zinc-900 text-zinc-50 min-h-screen">
      {isLoggedIn ? (
        <>
          <Header />
          <YourPodcast />
        </>
      ) : (
        <ErrorPage />
      )}
    </div>
  );
};

export default Profile;