const router = require("express").Router();
const { getUrl, redirectUrl } = require("../controllers/urlController");

router.route("/").post(getUrl);
router.route("/:id").get(redirectUrl);

module.exports = router;
