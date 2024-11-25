import React from "react";
import bgVideo from '../assets/backgroundVideo.mp4';
import { Link } from "react-router-dom";

const Home = () => {
  return (

    <div className="px-20 h-screen lg:h-[89vh] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="fixed top-0 left-0 w-screen h-screen object-cover"
      >
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="w-full flex items-center justify-between gap-4 relative">
      <div className="text-xl lg:w-5/6">
          <h1 className="text-xl md:text-6xl lg:text-8xl font-semibold text-center lg:text-start text-white">
            Create & listen to the <br />
            <h1 className="flex items-end justify-center lg:justify-start mt-2 lg:mt-0">
              p
              <span>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2113/2113324.png"
                  alt="headphone"
                  className="h-10 md:h-12 lg:h-20 lg:mx-2 transition-transform duration-100 hover:scale-110"
                />
              </span>
              dcast
            </h1>
          </h1>
      </div>

        <div className="hidden lg:block w-1/6"></div>
      </div>
      <div className="mt-12 w-full flex flex-col lg:flex-row items-end justify-between relative">
        <div className="flex flex-col items-center lg:items-start justify-center">
          <p className="text-xl font-semibold text-center lg:text-start text-white">
            Listen to the most popular podcasts on just one platform - <b>PodStar</b>
          </p>
          <Link to="/login">
          <button className="px-6 py-4 bg-zinc-800 text-white font-semibold rounded-full mt-6 lg:mt-8 hover:font-bold">
            Login to listen
          </button>
          </Link>
        </div>
        <div className="mt-6 lg:mt-0">
          <p className="text-white font-bold text-center lg:text-end">
            Our app contains more than 2000 podcasts for you
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;