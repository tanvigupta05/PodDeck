import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import PodcastCard from "../PodcastCard/PodcastCard";
import EditModal from "../EditModal/EditModal";

const YourPodcast = () => {
  const [Podcasts, setPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null); // Podcast data to edit

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        "http://localhost:3000/api/v1/get-user-podcasts",
        { withCredentials: true }
      );
      setPodcasts(res.data.data);
    };
    fetch();
  }, []);

  const handleDelete = async (podcastId) => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3000/api/v1/delete-podcast/${podcastId}`, {
        withCredentials: true,
      });
      setPodcasts(Podcasts.filter((podcast) => podcast._id !== podcastId));
    } catch (error) {
      console.error("Failed to delete podcast:", error);
    }
    setIsLoading(false);
  };

  const handleEdit = (podcast) => {
    setEditData(podcast);
    setEditModalOpen(true); // Open modal with the podcast data
  };

  const saveEditChanges = async (updatedData) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/v1/update-podcast/${updatedData._id}`,
        updatedData,
        { withCredentials: true }
      );
  
      if (res.data?.data) {
        setPodcasts((prevPodcasts) =>
          prevPodcasts.map((podcast) =>
            podcast._id === updatedData._id ? res.data.data : podcast
          )
        );
      }
  
      setEditModalOpen(false); // Close modal after successful update
    } catch (error) {
      console.error("Failed to update podcast:", error);
    }
  };
  
  return (
    <div className="bg-zinc-900 text-zinc-50 px-4 lg:px-12 my-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold md:font-bold text-zinc-200">
          Your Podcasts
        </h1>
        <Link
          to="/add-podcast"
          className="px-4 py-2 bg-zinc-800 text-zinc-50 rounded font-semibold hover:bg-zinc-700 transition-all duration-300"
        >
          Add Podcast
        </Link>
        <Link
          to="/favorites"
          className="px-4 py-2 bg-zinc-800 text-zinc-50 rounded font-semibold hover:bg-zinc-700 transition-all duration-300"
        >
          Favorites
        </Link>
      </div>
      <div className="my-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Podcasts.map((items, i) => (
          <div
            key={i}
            className="bg-zinc-800 text-white rounded-lg border border-zinc-700 p-3 flex flex-col justify-between"
          >
            <PodcastCard items={items} />
            {/* Buttons inside white border */}
            <div className="flex gap-2 mt-2 justify-between items-center border-t border-zinc-600 pt-2">
              <button
                onClick={() => handleEdit(items)}
                className="bg-zinc-700 text-white font-semibold px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(items._id)}
                className="bg-red-600 text-white-600 font-semibold px-2 py-1 rounded"
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <EditModal
          podcast={editData}
          onClose={() => setEditModalOpen(false)}
          onSave={saveEditChanges}
        />
      )}
    </div>
  );
};

export default YourPodcast;