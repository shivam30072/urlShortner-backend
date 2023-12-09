const mongoose = require("mongoose");

const ShortUrlSchema = new mongoose.Schema({
  short: { type: String, unique: true },
});

ShortUrlSchema.index({ short: 1 }, { unique: true });

module.exports = mongoose.model("shortUrl", ShortUrlSchema);
