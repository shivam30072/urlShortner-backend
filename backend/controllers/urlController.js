const Url = require("../model/urlModel");
const ShortURl = require("../model/shortUrlModel");
const ShortUniqueId = require("short-unique-id");
const shortid = require("shortid");

const getUrl = async (req, res) => {
  const { url } = req.body;

  const urlExists = await Url.findOne({ originalUrl: url });
  if (urlExists) {
    const uniqueId = await ShortURl.findById(urlExists.shortUrl);
    const existingUniqueID = uniqueId?.short;
    const shortUrl = `https://urlshortner-gpsa.onrender.com/${existingUniqueID}`;
    return res
      .status(200)
      .json({ originalUrl: urlExists?.originalUrl, shortUrl });
  }
  // need to create short URL
  const uniqueId = shortid.generate();
  const shortUrl = `https://urlshortner-gpsa.onrender.com/${uniqueId}`;

  // created uniqueID in shortUrl model
  const newShortUrl = new ShortURl({ short: uniqueId });

  try {
    const result = await newShortUrl.save();
    console.log("Document saved successfully:", result);
  } catch (error) {
    if (error.code === 11000) {
      console.error("Duplicate key error. Short URL already exists.");
    } else {
      console.error("Error saving document:", error);
    }
  }

  try {
    // need to store incoming URL with its short URL in DB
    const urlCreated = await Url.create({
      originalUrl: url,
      shortUrl: newShortUrl?._id,
    });

    // need to return this short URL in response
    res.status(201).json({
      originalUrl: urlCreated?.originalUrl,
      shortUrl,
      message: "short URL created",
    });
  } catch (error) {
    console.log(error);
    res.status(201).json({
      message: "Internal Server Error",
    });
  }
};

const redirectUrl = async (req, res) => {
  const id = req.params.id;

  const urlId = await ShortURl.findOne({ short: id });

  if (!urlId) {
    res.status(404).json({ message: "URL not found" });
    return;
  }

  const finalUrl = await Url.findOne({ shortUrl: urlId._id });

  const originalUrl = finalUrl.originalUrl;

  const fullUrl = originalUrl.startsWith("https://")
    ? originalUrl
    : "https://" + originalUrl;
  console.log("foina", fullUrl);
  res.status(302).redirect(fullUrl);
  return;
};

module.exports = { getUrl, redirectUrl };
