import express from "express";
import connectToDB from "../utils/db.js";
// const connectToDB = require('../utils/db');

const router = express.Router();

router.get("/", async (req, res) => {
  const db = await connectToDB();

  try {
    const aggregatedData = await db
      .collection("Policy")
      .aggregate([
        {
          $group: {
            _id: "$user_id",
            policies: { $push: "$$ROOT" },
          },
        },
        {
          $lookup: {
            from: "User",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
      ])
      .toArray();

    res.status(200).json({ aggregatedData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
