import express from "express";
import cors from "cors";
import routes from "./src/routes/index.js";
import authRoutes from "./src/modules/authorization/authorization.routes.js";
import dotenv from "dotenv"
dotenv.config()

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);  // Auth routes pehle
app.use("/api", routes);            // General routes baad mein

// // Health check
// app.get("/health", (req, res) => {
//   res.status(200).json({ 
//     success: true, 
//     message: "Server is running" 
//   });
// });

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


export default app;