import React, { useState } from "react";
import EditModal from "../EditModal/EditModal";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { playerActions } from "../../store/player";
import axios from "axios";
import { toast } from "react-toastify";

const PodcastCard = ({ items, handleRemove, isFavorite, isAdmin }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleFavorite = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/add-to-favorites/${items._id}`,
        {},
        { withCredentials: true }
      );
      toast.success("Podcast added to favorites!");
    } catch (error) {
      if (error.response?.data?.message === "Podcast already in favorites") {
        toast.info("Podcast is already in your favorites.");
      } else {
        toast.error("Failed to add to favorites.");
      }
    }
  };

  const handlePlay = (e) => {
    if (isLoggedIn) {
      e.preventDefault();
      dispatch(playerActions.setDiv());
      dispatch(
        playerActions.changeImage(`http://localhost:3000/${items.frontImage}`)
      );
      dispatch(
        playerActions.changeSong(`http://localhost:3000/${items.audioFile}`)
      );
    }
  };

  const handleUpdate = async (updatedPodcast) => {
    try {
      await axios.put(
        `http://localhost:3000/api/v1/update-podcast/${updatedPodcast._id}`,
        updatedPodcast,
        { withCredentials: true }
      );
      toast.success("Podcast updated successfully.");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update podcast.");
    }
  };

  return (
    <div className="border p-4 bg-zinc-800 rounded flex flex-col shadow-xl hover:shadow-2xl transition-all duration-300 z-2">
      <Link
        to={`/description/${items._id}`}
        className="flex flex-col items-center"
      >
        <img
          src={`http://localhost:3000/${items.frontImage}`}
          alt={items.title}
          className="rounded w-full h-40 object-cover"
        />
        <h3 className="text-xl font-bold mt-2">{items.title.slice(0, 20)}</h3>
      </Link>
      <p className="mt-2 text-slate-500 text-sm">
        {items.description.slice(0, 50)}...
      </p>
      <div>
        <div className="mt-2 px-4 py-2 flex justify-between items-center">
          <span className="text-sm font-medium">
            <h3>Genre: {items.category.categoryName}</h3>
          </span>
        </div>
        {!isFavorite && (
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full w-full hover:bg-red-600 transition-all duration-300 z-10"
            onClick={handleFavorite}
          >
            Add to Favorites
          </button>
        )}
      </div>
      <div className="mt-2">
        <Link
          to={isLoggedIn ? "#" : "/signup"}
          className="bg-zinc-700 text-white px-4 py-2 rounded mt-2 flex items-center justify-center hover:bg-green-800 transition-all duration-300"
          onClick={handlePlay}
        >
          Play Now
        </Link>
      </div>
      {isFavorite && (
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full w-full hover:bg-red-600 transition-all duration-300"
          onClick={handleRemove}
        >
          Remove from Favorites
        </button>
      )}
      {isAdmin && (
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full w-full hover:bg-blue-600 transition-all duration-300"
          onClick={() => setEditModalOpen(true)}
        >
          Edit Podcast
        </button>
      )}
      {editModalOpen && (
        <EditModal
          podcast={items}
          onClose={() => setEditModalOpen(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
};

export default PodcastCard;