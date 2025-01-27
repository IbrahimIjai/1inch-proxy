const { covalentClient } = require("../utils/covalent");

const { APPROVAL_V3 } = require("../utils");

const { ONE_INCH_SWAP_URI, BALANCE_URI } = require("../utils");

require("dotenv").config();
const { ChainID: CovalentChainID } = require("@covalenthq/client-sdk");
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
  })
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
      error.response ? error.response.data : error.message
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
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json(error.response ? error.response.data : { message: error.message });
  }
});
app.get("/quote", async (req, res) => {
  try {
    const { chainId, src, dst, amount } = req.query;
    const url = `${ONE_INCH_SWAP_URI}${chainId}/quote`;
    const config = {
      method: "get",
      url,
      headers,
      params: {
        chainId,
        src,
        dst,
        amount,
      },
    };
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json(error.response ? error.response.data : { message: error.message });
  }
});

app.get("/allowancesAndBalances", async (req, res) => {
  try {
    const { chainId, spender, walletAddress } = req.query;
    const url = `${BALANCE_URI}${chainId}/allowancesAndBalances/${spender}/${walletAddress}`;
    const config = {
      method: "get",
      url,
      headers,
    };
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json(error.response ? error.response.data : { message: error.message });
  }
});
app.get("/covalentBalanceAPi", async (req, res) => {
  const { chainId, address } = req.query;
  try {
    const { data } =
      await covalentClient.BalanceService.getTokenBalancesForWalletAddress(
        "base-mainnet",
        address
      );
    console.log(data, req.query, req.params);
    res.json(data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json(error.response ? error.response.data : { message: error.message });
  }
});

app.get("/eth_price", async (req, res) => {
  try {
    const url = `${ONE_INCH_SWAP_URI}8453/quote`;
    const config = {
      method: "get",
      url,
      headers,
      params: {
        src: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        dst: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
        amount: "1000000000000000000",
      },
    };
    const response = await axios(config);
    const { dstAmount } = response.data;
    res.json(dstAmount / 10 ** 18);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
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
