import React, { useEffect, useState } from "react";
import axios from "axios";
import PodcastCard from "../components/PodcastCard/PodcastCard";
import { toast } from "react-toastify";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/favorites", {
          withCredentials: true,
        });
        setFavorites(res.data.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("Failed to load favorites.");
      }
    };
    fetchFavorites();
  }, []);

  const handleRemove = async (podcastId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/remove-from-favorites/${podcastId}`,
        { withCredentials: true }
      );
      setFavorites(favorites.filter((podcast) => podcast._id !== podcastId));
      toast.success("Podcast removed from favorites.");
    } catch (error) {
      console.error("Error removing from favorites:", error);
      toast.error("Failed to remove podcast from favorites.");
    }
  };

  return (
    <div className="bg-zinc-900 min-h-screen text-zinc-50 px-4 lg:px-12 py-6">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {favorites.length > 0 ? (
          favorites.map((podcast) => (
            <div key={podcast._id} className="bg-zinc-800 rounded-lg p-4">
              <PodcastCard
                items={podcast}
                isFavorite={true}
                handleRemove={() => handleRemove(podcast._id)}
              />
            </div>
          ))
        ) : (
          <div className="text-xl">No favorites yet!</div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
