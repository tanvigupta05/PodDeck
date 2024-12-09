import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminPodcasts = () => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/all-podcasts", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        console.log("Podcasts fetched:", res.data.data);
        setPodcasts(res.data.data); // Assuming 'data' contains podcasts array
      } catch (err) {
        setError("Failed to fetch podcasts.");
        console.error(err);
        toast.error("Failed to fetch podcasts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  const handleDeletePodcast = async (podcastId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this podcast?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/delete-podcast/${podcastId}`, {
        withCredentials: true,
      });
      // Remove the deleted podcast from the state
      setPodcasts((prevPodcasts) =>
        prevPodcasts.filter((podcast) => podcast._id !== podcastId)
      );
      toast.success("Podcast deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete podcast.");
      console.error(err);
    }
  };

  // if (!isAdmin) {
  //   return <Navigate to="/" />;
  // }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Podcasts Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-800 rounded-md">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-400">Title</th>
              <th className="px-4 py-2 text-left text-gray-400">Description</th>
              <th className="px-4 py-2 text-left text-gray-400">Category</th>
              <th className="px-4 py-2 text-left text-gray-400">User</th>
              <th className="px-4 py-2 text-left text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {podcasts.map((podcast) => (
              <tr key={podcast._id} className="border-b border-gray-700">
                <td className="px-4 py-2">{podcast.title}</td>
                <td className="px-4 py-2">{podcast.description}</td>
                <td className="px-4 py-2">{podcast.category?.categoryName || "Uncategorized"}</td>
                <td className="px-4 py-2">{podcast.user?.username || "Unknown"}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-red-500 hover:text-red-700 ml-4"
                    onClick={() => handleDeletePodcast(podcast._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPodcasts;