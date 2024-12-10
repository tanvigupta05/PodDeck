// models/report.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    podcast: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "podcasts",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    reason: {
      type: String, // Optional reason provided by the user
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("report", reportSchema);
