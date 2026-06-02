const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// middlewares
app.use(helmet({
  contentSecurityPolicy: false, // For easier development with external CDN like Tailwind
}));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// static
app.use(express.static('public'));

// routes
app.use('/api', routes);

// error
app.use(errorHandler);

module.exports = app;
