const express = require("express");
const axios = require("axios");
const Product = require("../models/Product");
const fs = require("fs");

const router = express.Router();

// External API Base URL
const BASE_URL = "http://20.244.56.144/test";
router.get("/load-mock", async (req, res) => {
  try {
    const mockData = JSON.parse(fs.readFileSync("mock/products.json", "utf-8"));
    
    await Product.deleteMany({});
    await Product.insertMany(mockData);

    res.json({ message: "Mock products loaded", count: mockData.length });
  } catch (error) {
    res.status(500).json({ message: "Error loading mock data", error: error.message });
  }
});
// Fetch & store products
router.get("/fetch-products", async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/products`); // Affordmed test server
    // Save in DB
    await Product.deleteMany({});
    await Product.insertMany(data);
    res.json({ message: "Products fetched & stored", count: data.length });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

// Get products with filters & sorting
router.get("/products", async (req, res) => {
  try {
    const { sortBy, minPrice, maxPrice } = req.query;
    let query = {};

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let products = await Product.find(query);

    if (sortBy) {
      const sortOption = {};
      sortOption[sortBy] = 1;
      products = await Product.find(query).sort(sortOption);
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

module.exports = router;
