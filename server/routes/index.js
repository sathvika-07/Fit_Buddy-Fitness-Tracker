const router = require("express").Router();
const path = require("path");
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

// connect with react router
// serve up react front-end in production
router.use((req, res) => {
  // Check if running in production and if the build file exists
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, "../../build/index.html"));
  } else {
    // In development, just return a simple response
    res.status(404).json({ message: "API endpoint not found" });
  }
});

module.exports = router;
