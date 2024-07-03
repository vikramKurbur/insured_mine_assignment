import express from 'express';
import multer from 'multer';
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), (req, res) => {
  const worker = new Worker(path.join(__dirname, '../workers/uploadWorker.js'), {
    workerData: { filePath: req.file.path },
  });

  worker.on('message', (message) => {
    if (message.error) {
      return res.status(500).json({ error: message.error });
    }
    res.status(200).json({ message: 'Data uploaded successfully' });
  });

  worker.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      res.status(500).json({ error: `Worker stopped with exit code ${code}` });
    }
  });
});

export default router;
