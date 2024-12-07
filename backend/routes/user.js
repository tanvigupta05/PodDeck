//building user route
const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authMiddleware, adminMiddleware} = require("../middleware/authMiddleware");

// Fetch all users (Admin only)
router.get("/all-users", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json({ data: users });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users", error });
    }
  });

// Update user (Admin only)
router.put("/update-user/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, isAdmin } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { username, email, isAdmin },
        { new: true }
      ).select("-password");
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "User updated successfully", data: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user", error });
    }
  });
  
  // Delete user (Admin only)
  router.delete("/delete-user/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user", error });
    }
  });  

//signup route
router.post("/sign-up",async(req,res)=>{
    try{
        const{username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message:"all fields are required"});
        }
        if(username.length<5){
            return res.status(400).json({message:"username must have 5 characters"});
        }
        if(password.length<6){
            return res.status(400).json({message:"password must have 6 characters"});
        }

        // check user exists or not
        const existingEmail = await User.findOne({email:email});
        const existingUsername = await User.findOne({username:username});
        if(existingEmail || existingUsername)
        {
            return res.status(400).json({message:"username or email already exists"});
        }

        // hash the password
        const salt= await bcrypt.genSalt(10);
        const hashedPass= await bcrypt.hash(password,salt);
        const newUser= new User({username,email,password: hashedPass});
        await newUser.save();
        return res.status(200).json({message:"Account created"});
    }
    catch(error){
        console.log(error);
        res.status(400).json({error});
    }
});

// sign-in route
router.post("/sign-in",async(req,res)=>{
    try{
        const{email,password} = req.body; 
        if(!email || !password){
            return res.status(400).json({message:"all fields are required"});
        }
        // check user exists
        const existingUser = await User.findOne({email:email});
        
        if(!existingUser)
        {
            return res.status(400).json({message:"invalid credentials"});
        }
        // check password is matched or not
        const isMatch= await bcrypt.compare(password,existingUser.password);
        if(!isMatch){
            return res.status(400).json({message:"invalid credentials"});
        }
        //generate JWT token
         const token= jwt.sign(
            {id: existingUser._id, email: existingUser.email},
            process.env.JWT_SECRET,
            {expiresIn: "30d"}
        );
        res.cookie("podDeckUserToken", token, {
            httpOnly: true,
            maxAge: 30*24*60*100, //30 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
        });
        return res.status(200).json({
            id: existingUser._id,
            username: existingUser.username,
            email:email, 
            message:"Sign-in successfull",
        });
        
    }
    catch(error){
        res.status(500).json({error});
    }
});

// logout
router.post("/logout", async (req, res) => {
    try {
      // Clear the cookie
      res.clearCookie("podDeckUserToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' 
      });
      // Optional: Invalidate token on server-side if you're using a token blacklist
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
});

//check cookie present or not
router.get("/checkCookie",async(req,res)=>{
    const token = req.cookies.podDeckUserToken;
    if (token) {
        return res.status(200).json({ message: true }); // Prevent further execution
    }
    res.status(200).json({ message: false });
});

// route to fetch user details
router.get("/user-details",authMiddleware, async(req,res)=>{
   try{
    const {email} = req.user;
    const existingUser = await User.findOne({email:email}).select(
        "-password"
    );
    return res.status(200).json({user:existingUser,});
   }
   catch(error){
    console.log(error);
    res.status(500).json({error:error});
   }
});

// Add to favorites
router.post("/add-to-favorites/:id", authMiddleware, async (req, res) => {
    try {
        const podcastId = req.params.id;
        const user = req.user;

        // Check if already in favorites
        if (user.favourites.includes(podcastId)) {
            return res.status(400).json({ message: "Podcast already in favorites" });
        }

        user.favourites.push(podcastId);
        await user.save();
        res.status(200).json({ message: "Added to favorites" });
    } catch (error) {
        console.error("Failed to add to favorites:", error);
        res.status(500).json({ message: "Failed to add to favorites" });
    }
});

// Remove from favorites
router.delete("/remove-from-favorites/:id", authMiddleware, async (req, res) => {
    try {
        const podcastId = req.params.id;
        const user = req.user;

        user.favourites = user.favourites.filter(
            (id) => id.toString() !== podcastId
        );
        await user.save();

        res.status(200).json({ message: "Removed from favorites" });
    } catch (error) {
        console.error("Failed to remove from favorites:", error);
        res.status(500).json({ message: "Failed to remove from favorites" });
    }
});

// Get favorite podcasts
router.get("/favorites", authMiddleware, async (req, res) => {
    try {
        const user = req.user;

        const favoritePodcasts = await User.findById(user._id)
            .populate({
                path: "favourites",
                populate: { path: "category" },
            })
            .select("favourites -_id");

        res.status(200).json({ data: favoritePodcasts.favourites });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch favorites" });
    }
});

module.exports = router;