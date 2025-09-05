const express = require("express");
const companyRoutes = require("./company");
const app = express();
app.use(express.json());
// Route for company registration
app.use("/api", companyRoutes);
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});