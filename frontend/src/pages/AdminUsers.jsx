import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/all-users", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setUsers(res.data.data);
      } catch (err) {
        setError("Failed to fetch users.");
        toast.error("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = async (userId, updatedDetails) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/v1/update-user/${userId}`,
        updatedDetails,
        { withCredentials: true }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, ...res.data.data } : user
        )
      );
      toast.success("User updated successfully.");
      setEditingUser(null); // Close the modal
    } catch (err) {
      toast.error("Failed to update user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/delete-user/${userId}`, {
        withCredentials: true,
      });
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      toast.success("User deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete user.");
    }
  };

 // if (!isAdmin) return <Navigate to="/" />;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">User Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-800 rounded-md">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-400">Username</th>
              <th className="px-4 py-2 text-left text-gray-400">Email</th>
              <th className="px-4 py-2 text-left text-gray-400">Role</th>
              <th className="px-4 py-2 text-left text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-700">
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.isAdmin ? "Admin" : "User"}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => setEditingUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 ml-4"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Edit User</h2>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1" htmlFor="username">
                Username:
              </label>
              <input
                id="username"
                type="text"
                className="w-full text-black px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                value={editingUser.username}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, username: e.target.value })
                }
                placeholder="Username"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1" htmlFor="email">
                Email:
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 text-black border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500"
                value={editingUser.email}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                placeholder="Email"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                onClick={() =>
                  handleEditUser(editingUser._id, {
                    username: editingUser.username,
                    email: editingUser.email,
                  })
                }
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;