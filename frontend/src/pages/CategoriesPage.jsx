import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PodcastCard from "../components/PodcastCard/PodcastCard";

const CategoriesPage = () => {
  const { cat } = useParams();  // Get the category from URL params
  const [Podcasts, setPodcasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch podcasts when category changes
  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/category/${cat}`,
          { withCredentials: true }
        );
        setPodcasts(res.data.data);  // Update the podcast state
      } catch (error) {
        console.error('Failed to fetch podcasts:', error);
      }
    };

    fetchPodcasts();
  }, [cat]); // Re-fetch when category changes

  // Function to update the category of the podcast after edit
  const updatePodcastCategory = (updatedPodcast) => {
    setPodcasts((prevPodcasts) =>
      prevPodcasts.map((podcast) =>
        podcast._id === updatedPodcast._id ? updatedPodcast : podcast
      )
    );
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter podcasts based on search query
  const filteredPodcasts = Podcasts.filter((podcast) =>
    podcast.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-zinc-900 text-zinc-50 h-screen px-4 py-4 lg:px-12">
      <h1 className="text-xl font-semibold text-zinc-100">{cat}</h1>
      
      {/* Search Bar */}
      <div className="mt-4 flex justify-center">
        <input
          type="text"
          placeholder="Search podcasts"
          value={searchQuery}
          onChange={handleSearchChange}
          className="bg-zinc-700 text-white px-4 py-2 rounded w-80 focus:outline-none"
        />
      </div>

      <div className="w-full px-4 lg:px-12 py-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredPodcasts && filteredPodcasts.length > 0 ? (
          filteredPodcasts.map((items, i) => (
            <div key={i}>
              <PodcastCard items={items} updateCategory={updatePodcastCategory} />
            </div>
          ))
        ) : (
          <div className="text-3xl font-bold text-zinc-400 h-screen text-center items-center">
            No Podcasts Found
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;