const { ONE_INCH_SWAP_URI } = require("../utils");

require("dotenv").config();

const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;

app.use(
  cors({
    origin: "*",
    methods: ["GET"],
    allowedHeaders: ["", ""],
  }),
);

const headers = {
  Authorization: `Bearer ${process.env.ONE_INCH_API_KEY}`,
  "Content-Type": "application/json",
};
const port = 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  res.json({ status: 200 });
});

app.get("/swap", async (req, res) => {
  try {
    const { chainId, ...swapParams } = req.query;
    const url = `${ONE_INCH_SWAP_URI}${chainId}/swap`;
    const config = {
      method: "get",
      url,
      headers,
      params: swapParams,
    };

    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message,
    );
    res
      .status(error.response ? error.response.status : 500)
      .json(error.response ? error.response.data : { message: error.message });
  }
});

app.get("/approval", async (req, res) => {
  try {
    const { chainId, tokenAddress, amount } = req.query;
    const url = `${ONE_INCH_SWAP_URI}${chainId}/approve/transaction`;
    const config = {
      method: "get",
      url,
      headers,
      params: {
        tokenAddress,
        amount,
      },
    };
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message,
    );
    res
      .status(error.response ? error.response.status : 500)
      .json(error.response ? error.response.data : { message: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
