import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import connection from './utils/db.js';
import cpuMonitor from './utils/cpuMonitor.js';
import uploadRoutes from './routes/upload.js';
import policyRoutes from './routes/policy.js';
import aggregatedPolicyRoutes from './routes/aggregatedPolicy.js';
import scheduleMessageRoutes from './routes/scheduleMessage.js';

const app = express();
connection();

app.use(express.json());

app.use('/upload', uploadRoutes);
app.use('/policy', policyRoutes);
app.use('/aggregated-policies', aggregatedPolicyRoutes);
app.use('/schedule-message', scheduleMessageRoutes);
app.use('/get', scheduleMessageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  cpuMonitor.startMonitoring();
});

