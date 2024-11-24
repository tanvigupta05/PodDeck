import React from 'react';
import Navbar from "../components/Navbar/Navbar";
import {Outlet} from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer/AudioPlayer";

const MainLayout = () => {
  return (
    <div className="relative">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <div className="fixed bottom-0 left-0 w-full">
          <AudioPlayer/>
        </div>
    </div>
  );
};

export default MainLayout;