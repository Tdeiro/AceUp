require("dotenv").config();
const express = require("express");
const routes = require("./routes/routes"); // ✅ Ensure correct path

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // ✅ Middleware for JSON parsing
app.use("/api", routes); // ✅ Register API routes

// ✅ Debugging: Print middleware stack
console.log("✅ Middleware Stack in server.js:");
app._router.stack.forEach((layer, index) => {
  if (layer.route) {
    console.log(
      `Middleware [${index}]:`,
      layer.route.path,
      Object.keys(layer.route.methods)
    );
  } else if (layer.name === "router") {
    console.log(`✅ Found Router Middleware at [${index}]:`, layer.regexp);
    console.log(
      layer.handle.stack.map((r) =>
        r.route ? `/api${r.route.path}` : "NO ROUTE"
      )
    );
  }
});

// ✅ Debugging: Extract routes inside the `/api/` middleware
const registeredRoutes = [];
app._router.stack.forEach((layer) => {
  if (layer.name === "router" && layer.handle.stack) {
    layer.handle.stack.forEach((subLayer) => {
      if (subLayer.route) {
        registeredRoutes.push({
          path: `/api${subLayer.route.path}`,
          methods: Object.keys(subLayer.route.methods),
        });
      }
    });
  }
});

// ✅ Display final registered routes
console.log("✅ Correct Final Registered Routes in server.js:");
console.log(registeredRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
