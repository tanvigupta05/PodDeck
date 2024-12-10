const {authMiddleware, adminMiddleware} = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const Category = require("../models/category");
const User = require("../models/user");
const Podcast = require("../models/podcast");
const router = require("express").Router();
const Report = require("../models/report");

// Admin: Fetch all podcasts (with user details)
router.get("/all-podcasts", async (req, res) => {
  try {
    const podcasts = await Podcast.find()
      .populate("category","categoryName")
      .populate("user", "username email -_id")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: podcasts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch podcasts", error });
  }
});

// Admin: Delete any podcast
router.delete("/admin-delete-podcast/:id", async (req, res) => {
  try {
    const podcastId = req.params.id;

    // Fetch the podcast to ensure it exists
    const podcast = await Podcast.findById(podcastId);
    if (!podcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    // Remove references from related collections
    await User.findByIdAndUpdate(podcast.user, { $pull: { podcasts: podcastId } });
    await Category.findByIdAndUpdate(podcast.category, { $pull: { podcasts: podcastId } });

    // Delete the podcast
    await Podcast.findByIdAndDelete(podcastId);

    res.status(200).json({ message: "Podcast deleted successfully" });
  } catch (error) {
    console.error("Error deleting podcast:", error);
    res.status(500).json({ message: "Failed to delete podcast", error });
  }
});

// Report a podcast
router.post("/report-podcast/:podcastId",authMiddleware, async (req, res) => {
  try {
    const { podcastId } = req.params;
    const userId = req.user.id; // Assuming authMiddleware sets the user in req.user

    // Check if the report already exists
    const existingReport = await Report.findOne({ podcast: podcastId, user: userId });
    if (existingReport) {
      return res.status(400).json({ message: "You have already reported this podcast." });
    }
    // Create a new report
    const report = new Report({
      podcast: podcastId,
      user: userId,
      reason: req.body.reason || "No reason provided",
    });

    await report.save();
    res.status(200).json({ message: "Report submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to report podcast.", error });
  }
});

// Fetch reported podcasts for admin
router.get("/admin/reported-podcasts", async (req, res) => {
  try {
    const reports = await Report.aggregate([
      // Group by podcast ID and count reports
      { $group: { _id: "$podcast", count: { $sum: 1 } } },
      // Convert _id to ObjectId to match Podcasts collection
      { $addFields: { _id: { $toObjectId: "$_id" } } },
      // Lookup podcast details
      {
        $lookup: {
          from: "podcasts", // Collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "podcastDetails",
        },
      },
      // Filter out entries where podcastDetails is empty
      { $match: { podcastDetails: { $ne: [] } } },
    ]);

    res.status(200).json({ message: "Reported podcasts fetched successfully.", data: reports });
  } catch (error) {
    console.error("Failed to fetch reported podcasts:", error);
    res.status(500).json({ message: "Failed to fetch reported podcasts.", error });
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

//download podcast
router.get("/download-podcast/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const podcast = await Podcast.findById(id);

    if (!podcast) {
      return res.status(404).json({ message: "Podcast not found" });
    }

    // Specify the path of the audio file
    const audioPath = `./${podcast.audioFile}`;

    // Send the file as a download
    res.download(audioPath, (err) => {
      if (err) {
        res.status(500).json({ message: "Failed to download podcast", error: err });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch podcast", error });
  }
});

module.exports = router;