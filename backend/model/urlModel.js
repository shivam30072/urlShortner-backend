const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  originalUrl: { type: String, require: true },
  shortUrl: { type: mongoose.Schema.Types.ObjectId, ref: "shortUrl" },
});

module.exports = mongoose.model("url", UrlSchema);
