import { Router } from "express";
import { usersCollection, ordersCollection } from "../models/index.js";
import userSchema from "../models/schemas/userSchema.js";

export default ({ config, db }) => {
  let router = Router();

  // Create new user with dummy data

  router.post("/", async (req, res) => {
    try {
      const user = await usersCollection.create(req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  //get all users that have 2 orders and more
  //AND at least one of the orders
  //has a product with qty >= 2

  router.get("/", async (req, res) => {
    try {
      const users = await usersCollection.aggregate([
        {
          $lookup: {
            // jointure de users and orders key=user en commun
            from: "orders",
            localField: "_id",
            foreignField: "user",
            as: "orders", //nv nom joined collections
          },
        },
        {
          $match: {
            //projection
            $and: [
              { "orders.1": { $exists: true } }, // au moins 2 orders
              { "orders.products.quantity": { $gte: 2 } }, //  product with qty >= 2
            ],
          },
        },
      ]);

      res.json(users);
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while fetching the users." });
    }
  });

  return router;
};
