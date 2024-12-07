// building category route
const router = require("express").Router();
const Cat = require("../models/category");
const {authMiddleware,adminMiddleware} = require("../middleware/authMiddleware");

// Get all categories (Admin only)
router.get("/all-categories", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const categories = await Cat.find().populate("podcasts");
      res.status(200).json({ data: categories });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories", error });
    }
  });
  
  // Delete category (Admin only)
  router.delete("/delete-category/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
  
      const category = await Cat.findById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      // Optionally: Check if the category has associated podcasts and prevent deletion
      if (category.podcasts && category.podcasts.length > 0) {
        return res.status(400).json({ message: "Category contains podcasts, cannot delete" });
      }
  
      await Cat.findByIdAndDelete(id);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category", error });
    }
  });

// add category
router.post("/add-category",async(req,res)=>{
    const {categoryName}= req.body;
    const cat = new Cat({categoryName});
    await cat.save();
    return res.status(200).json({message:"category added"});
});

module.exports = router;
