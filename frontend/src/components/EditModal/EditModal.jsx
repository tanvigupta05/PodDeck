import React, { useState } from "react";

const EditModal = ({ podcast, onClose, onSave }) => {
  const [title, setTitle] = useState(podcast?.title || "");
  const [description, setDescription] = useState(podcast?.description || "");
  const [category, setCategory] = useState(
    podcast?.category?.categoryName || ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...podcast,
      title,
      description,
      category: { ...podcast.category, categoryName: category },
    };
    onSave(updatedData); // Save changes
    onClose(); // Close modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="p-6 rounded w-full max-w-lg bg-zinc-700">
        <h2 className="text-lg font-bold mb-4">Edit Podcast</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
              className="w-full p-2 border rounded text-black"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Category</label>
            <select
              className="w-full p-2 border rounded text-black"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Comedy">Comedy</option>
              <option value="Business">Business</option>
              <option value="Education">Education</option>
              <option value="Hobbies">Hobbies</option>
              <option value="Government">Government</option>
              <option value="Historic">Historic</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-zinc-900 rounded hover:bg-gray-400 text-white"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-900 text-white rounded hover:bg-gray-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;