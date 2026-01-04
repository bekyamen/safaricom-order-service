const EventEmitter = require("events");
const eventBus = new EventEmitter();

// Billing listener
eventBus.on("OrderCreated", (event) => {
  console.log("Billing Service received event:", event);
});

// Analytics listener
eventBus.on("OrderCreated", (event) => {
  console.log("Analytics Service logged event:", event);
});

module.exports = eventBus;
