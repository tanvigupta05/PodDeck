const {authMiddleware, adminMiddleware} = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const Category = require("../models/category");
const User = require("../models/user");
const Podcast = require("../models/podcast");
const router = require("express").Router();

// Admin: Fetch all podcasts (with user details)
router.get("/all-podcasts", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const podcasts = await Podcast.find()
      .populate("category")
      .populate("user", "username email -_id")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: podcasts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch podcasts", error });
  }
});

// Admin: Delete any podcast
router.delete("/admin-delete-podcast/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const podcastId = req.params.id;

    const podcast = await Podcast.findById(podcastId);
    if (!podcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    // Remove references from related models
    await User.findByIdAndUpdate(podcast.user, { $pull: { podcasts: podcastId } });
    await Category.findByIdAndUpdate(podcast.category, { $pull: { podcasts: podcastId } });
    await Podcast.findByIdAndDelete(podcastId);

    res.status(200).json({ message: "Podcast deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete podcast", error });
  }
});

// Admin: Handle reported podcasts (Mark as reviewed or delete)
router.post("/review-reported-podcast/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // action: "markReviewed" or "delete"

    if (action === "markReviewed") {
      const podcast = await Podcast.findByIdAndUpdate(
        id,
        { isReviewed: true },
        { new: true }
      );
      if (!podcast) {
        return res.status(404).json({ message: "Podcast not found" });
      }
      return res.status(200).json({ message: "Podcast marked as reviewed" });
    } else if (action === "delete") {
      const podcast = await Podcast.findById(id);
      if (!podcast) {
        return res.status(404).json({ message: "Podcast not found" });
      }

      // Remove references
      await User.findByIdAndUpdate(podcast.user, { $pull: { podcasts: id } });
      await Category.findByIdAndUpdate(podcast.category, { $pull: { podcasts: id } });
      await Podcast.findByIdAndDelete(id);

      return res.status(200).json({ message: "Podcast deleted successfully" });
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to review reported podcast", error });
  }
});

//add-podcast
router.post("/add-podcast", authMiddleware, upload, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const frontImage = req.files["frontImage"][0].path;
    const audioFile = req.files["audioFile"][0].path;
    if (!title || !description || !category || !frontImage || !audioFile) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const { user } = req;
    const cat = await Category.findOne({ categoryName: category });
    if (!cat) {
      return res.status(400).json({ message: "No category found" });
    }
    const catid = cat._id;
    const userid = user._id;
    const newPodcast = new Podcast({
      title,
      description,
      category: catid,
      frontImage,
      audioFile,
      user: userid,
    });
    await newPodcast.save();
    await Category.findByIdAndUpdate(catid, {
      $push: { podcasts: newPodcast._id },
    });
    await User.findByIdAndUpdate(userid, {
      $push: { podcasts: newPodcast._id },
    });
    res.status(201).json({ message: "Podcast added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add podcast" });
  }
});

//get all podcast
router.get("/get-podcasts", async (req, res) => {
  try {
    const podcasts = await Podcast.find()
      .populate("category")
      .sort({ createdAt: -1 });
    return res.status(200).json({ data: podcasts });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//get-user-podcasts
router.get("/get-user-podcasts", authMiddleware, async (req, res) => {
  try {
    const { user } = req;
    const userid = user._id;
    const data = await User.findById(userid)
      .populate({
        path: "podcasts",
        populate: { path: "category" },
      })
      .select("-password");
    if (data && data.podcasts) {
      data.podcasts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    return res.status(200).json({ data: data.podcasts });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//get podcast by id
router.get("/get-podcast/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const podcasts = await Podcast.findById(id).populate("category");
    return res.status(200).json({ data: podcasts });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//get podcast by categories
router.get("/category/:cat", async (req, res) => {
  try {
    const { cat } = req.params;
    const categories = await Category.find({ categoryName: cat }).populate({
      path: "podcasts",
      populate: { path: "category" },
    });
    let podcasts = [];
    categories.forEach((category) => {
      podcasts = [...podcasts, ...category.podcasts];
    });
    return res.status(200).json({ data: podcasts });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//delete podcast 
router.delete("/delete-podcast/:id", async (req, res) => {
  try {
    const podcastId = req.params.id;
    await Podcast.findByIdAndDelete(podcastId);
    res.status(200).json({ message: "Podcast deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete podcast" });
  }
});

// Backend route to update a podcast
router.put("/update-podcast/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    // Find the category document by category name
    const categoryDocument = await Category.findOne({ categoryName: category });
    if (!categoryDocument) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the podcast with the new category ID
    const updatedPodcast = await Podcast.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category: categoryDocument._id, // Use the category's ID here
      },
      { new: true }
    ).populate("category"); // Populate the category if needed

    if (!updatedPodcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    res.status(200).json({
      message: "Podcast updated successfully",
      data: updatedPodcast,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update podcast", error });
  }
});

module.exports = router;