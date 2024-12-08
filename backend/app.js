const express= require("express");
const app = express();
const cookieParser = require("cookie-parser");
const userApi= require("./routes/user");
const catApi= require("./routes/category");
const PodcastApi= require("./routes/podcast");
const AdminApi= require("./routes/admin");

const cors = require("cors");

require("dotenv").config();
require("./connection/conn");
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads",express.static("uploads"));

//all routes
app.use("/api/v1",userApi);
app.use("/api/v1",catApi);
app.use("/api/v1",PodcastApi);
app.use("/api/v1",AdminApi);

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});


