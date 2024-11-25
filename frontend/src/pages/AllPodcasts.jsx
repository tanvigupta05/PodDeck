import React, { useEffect, useState } from "react";
import axios from "axios";
import PodcastCard from "../components/PodcastCard/PodcastCard";

const AllPodcasts = () => {
  const [Podcasts, setPodcasts] = useState();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("http://localhost:3000/api/v1/get-podcasts");
      setPodcasts(res.data.data);
    };
    fetch();
  }, []);

  return (
    <div className="bg-zinc-900 min-h-screen text-zinc-50">
      <div className="w-full px-4 lg:px-12 py-6">
        <h1 className="text-3xl font-bold mb-6">All Podcasts</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Podcasts &&
            Podcasts.map((items, i) => (
              <div
                key={i}
                className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden p-4"
              >
                <PodcastCard items={items} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AllPodcasts;