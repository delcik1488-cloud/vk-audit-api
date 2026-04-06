const express = require('express');
const cors = require('cors');
const analyzeVkRoute = require('./routes/analyzeVk.route');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'VK Audit API is running' });
});

app.use('/api', analyzeVkRoute);
app.use(errorMiddleware);

module.exports = app;
