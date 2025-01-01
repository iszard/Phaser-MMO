// Import essential libraries
const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();

const cors = require("cors");
const config = require("./config/config");

const home = require("./routes/home");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/phaser", express.static(__dirname + "/node_modules/phaser/dist/"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hjs");

// Setup essential routes
app.use("/", home);

// router.get("/about", function (req, res) {
//   res.sendFile(path.join(__dirname + "/about.html"));
// });

// Define your routes here
const exampleRoutes = require("./routes/exampleRoutes");
app.use("/api/example", exampleRoutes);

// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
