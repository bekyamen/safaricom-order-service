require("dotenv").config();
const express = require("express");
const orderRoutes = require("./routes/order.routes");

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/v1/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Order service running on port ${PORT}`)
);
