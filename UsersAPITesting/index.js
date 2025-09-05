const express = require("express");
const userRoutes = require("./User");
const app = express();
app.use(express.json()); // parse JSON bodies
// Mount user routes
app.use("/users", userRoutes);
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
