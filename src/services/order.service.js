const { v4: uuidv4 } = require("uuid");
const pool = require("../db");
const eventBus = require("../events/eventBus");

exports.createOrder = async (req, res) => {
  const { customerId, productCode, quantity } = req.body;
  const idempotencyKey = req.headers["idempotency-key"];

  if (!customerId || !productCode || !quantity) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  if (!idempotencyKey) {
    return res.status(400).json({ message: "Idempotency-Key required" });
  }

  // Check idempotency
  const existing = await pool.query(
    "SELECT order_id FROM idempotency_keys WHERE idempotency_key=$1",
    [idempotencyKey]
  );

  if (existing.rows.length > 0) {
    return res.status(200).json({
      orderId: existing.rows[0].order_id,
      status: "CREATED (duplicate ignored)",
    });
  }

  const orderId = uuidv4();

  await pool.query(
    "INSERT INTO orders VALUES ($1,$2,$3,$4,$5)",
    [orderId, customerId, productCode, quantity, "CREATED"]
  );

  await pool.query(
    "INSERT INTO idempotency_keys VALUES ($1,$2)",
    [idempotencyKey, orderId]
  );

  // Emit event
  eventBus.emit("OrderCreated", { orderId, customerId });

  res.status(201).json({ orderId, status: "CREATED" });
};

exports.getOrderById = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM orders WHERE id=$1",
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json(result.rows[0]);
};
