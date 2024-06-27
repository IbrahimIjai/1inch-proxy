const { CovalentClient } = require("@covalenthq/client-sdk");
require("dotenv").config();
const COVALENT_API_KEY = process.env.COVALENT_API_KEY as string;

export const covalentClient = new CovalentClient(COVALENT_API_KEY);
