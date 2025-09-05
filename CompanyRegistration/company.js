const express = require("express");
const router = express.Router();
let companies = [];
let companyId = 1;
// Register company
router.post("/registerCompany", (req, res) => {
  const { companyName, email, employeeSize, city } = req.body;

  if (!companyName || !email) {
    return res.status(400).json({ message: "Company name and email are required" });
  }

  const newCompany = {
    id: companyId++,
    companyName,
    email,
    employeeSize,
    city
  };

  companies.push(newCompany);

  res.status(201).json({
    message: "Company registered successfully",
    company: newCompany
  });
});
// Get all companies
router.get("/companies", (req, res) => {
  res.json(companies);
});
// Get single company by id
router.get("/companies/:id", (req, res) => {
  const company = companies.find(c => c.id === parseInt(req.params.id));
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }
  res.json(company);
});
// Update company by id
router.put("/companies/:id", (req, res) => {
  const company = companies.find(c => c.id === parseInt(req.params.id));
  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  const { companyName, email, employeeSize, city } = req.body;
  if (companyName) company.companyName = companyName;
  if (email) company.email = email;
  if (employeeSize) company.employeeSize = employeeSize;
  if (city) company.city = city;

  res.json({ message: "Company updated", company });
});
// Delete company by id
router.delete("/companies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const exists = companies.some(c => c.id === id);
  if (!exists) {
    return res.status(404).json({ message: "Company not found" });
  }

  companies = companies.filter(c => c.id !== id);
  res.json({ message: "Company deleted successfully" });
});

module.exports = router;
