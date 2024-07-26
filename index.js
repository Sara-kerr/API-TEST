import express from "express";
import requestLogger from "./middlewares/requestLogger.js";
import dotenv from "dotenv";
import api from "./api/index.js";
import CONFIG from "./config.json" assert { type: "json" };
import mongoose from "mongoose";
import { productsCollection, usersCollection } from "./models/index.js";

dotenv.config();
const PORT = CONFIG.port || 7000;
const app = express();
app.use(express.json());

// connect to Database///////////////////////////////////////////////////////////////////////////////////////
mongoose
  .connect(CONFIG.mongo_url)
  .then((db) => {
    console.log("Connected to the database");
    app.use(express.json());
    // app.use(requestLogger)
    app.use("/api", api({ config: CONFIG, db }));
    app.listen(PORT, () => console.log(`SERVER IS RUNNIN IN ${PORT}`));
  })
  .catch((err) => {
    console.log(err, "Received an Error");
  });

  
app.get("/", (req, res) => {
  res.send("Hello from node API ");
});
