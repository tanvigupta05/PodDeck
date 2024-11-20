import React from 'react';
import logo from '../assets/logo.png';

const Home = () => {
  return (
    <div className="bg-green-100 px-6 md:px-12 h-screen flex flex-col items-center justify-center gap-4 w-full">
      {/* Main Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title and Logo */}
        <div className="w-full md:w-5/6">
          <h1 className="text-5xl md:text-7xl font-bold text-center md:text-left">
            Create & listen the <br />
            <h1 className="flex justify-center md:justify-start items-end">
              p
              <span>
                <img src={logo} alt="podcast" className="h-12 md:h-16"/>
              </span>
              dcast
            </h1>
          </h1>
        </div>

        {/* Scroll Indicator */}
        <div className="hidden md:block w-1/6">
          <div className="py-1 px-2 bg-white border border-black text-xl font-semibold rounded-full text-center -rotate-90">
            Scroll Down
          </div>
        </div>
      </div>

      {/* Subheading Section */}
      <div className="md:w-5/6 mt-6 md:mt-12 flex flex-col items-center md:items-start lg:relative left-20 ml-12" >
        <p className="font-semibold text-center md:text-left">
          Listen to the most popular podcasts on just one platform - <b>PodDeck</b>
        </p>
        <button className="px-6 py-4 bg-green-900 text-white font-semibold rounded-full mt-6">
          Login to listen
        </button>
        <div className="w-full flex justify-center md:justify-end md:relative md:bottom-14">
          <p className="text-zinc-600 font-bold mt-4 md:mt-6 text-center md:text-right">
            Our app contains more than 2000 podcasts for you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
