const express = require("express");
const router = express.Router();
const orderService = require("../services/order.service");

router.post("/", orderService.createOrder);
router.get("/:id", orderService.getOrderById);

module.exports = router;
