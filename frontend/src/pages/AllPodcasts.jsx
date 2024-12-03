import React, { useEffect, useState } from "react";
import axios from "axios";
import PodcastCard from "../components/PodcastCard/PodcastCard";

const AllPodcasts = () => {
  const [Podcasts, setPodcasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch podcasts data on component mount
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/get-podcasts");
        setPodcasts(res.data.data);
      } catch (error) {
        console.error("Failed to fetch podcasts:", error);
      }
    };

    fetchPodcasts();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter podcasts based on the search query (title and category)
  const filteredPodcasts = Podcasts.filter((podcast) => {
    const titleMatches = podcast.title.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatches = podcast.category.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatches || categoryMatches;
  });

  return (
    <div className="bg-zinc-900 min-h-screen text-zinc-50">
      <div className="w-full px-4 lg:px-12 py-6">
        <h1 className="text-3xl font-bold mb-6">All Podcasts</h1>

        {/* Search Bar */}
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="Search by title or category"
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-zinc-700 text-white px-4 py-2 rounded w-80 focus:outline-none"
          />
        </div>

        {/* Display Podcasts */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredPodcasts && filteredPodcasts.length > 0 ? (
            filteredPodcasts.map((items, i) => (
              <div
                key={i}
                className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden p-4"
              >
                <PodcastCard items={items} />
              </div>
            ))
          ) : (
            <div className="text-3xl font-bold text-zinc-400 h-screen flex">
              No Podcasts Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPodcasts;