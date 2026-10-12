require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connection");
const order = require("./models/order");
const product = require("./models/product");
const user = require("./models/user");

const app = express();

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.get("/", async (req, res) => {
  const Order = await order
    .findById("6a8c6029760f2eb0a3cc6397")
    .populate("user")
    .populate("product");

  console.log(Order);

  res.status(200).json({
    message: "Lo main chala gya fir se.",
  });
});

app.listen(4000, () => {
  console.log(`server is running at http://localhost:4000`);
});
