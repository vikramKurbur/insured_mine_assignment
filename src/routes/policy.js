import express from "express";
import connectToDB from "../utils/db.js";

const router = express.Router();

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  const db = await connectToDB();

  try {
    const user = await db.collection("User").findOne({ first_name: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const policies = await db
      .collection("Policy")
      .find({ user_id: user._id })
      .toArray();
    res.status(200).json({ policies });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
});

export default router;

// const policy = async (req, res) => {
//   const { username } = req.params;
//   const db = await connectToDB();

//   try {
//     const user = await db.collection("User").findOne({ first_name: username });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const policies = await db
//       .collection("Policy")
//       .find({ user_id: user._id })
//       .toArray();
//     res.status(200).json({ policies });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export default { policy };
