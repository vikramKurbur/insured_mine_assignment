import express from "express";
import { response } from "express";
import schedule from "node-schedule";
import connectToDB from "../utils/db.js";

const router = express.Router();

router.post('/', async (req, res) => {
  const { message, day, time } = req.body;

  const [hour, minute] = time.split(':');
  const date = new Date(day);
  date.setHours(hour);
  date.setMinutes(minute);

  const job = schedule.scheduleJob(date, async () => {
    const db = await connectToDB();
    try {
      await db.collection('ScheduledMessages').insertOne({ message, date });
    } catch (error) {
      console.log(error);

      console.error(`Error inserting message: ${error.message}`);
    }
  });

  res.status(200).json({ message: 'Message scheduled successfully' });
});




export default router;


