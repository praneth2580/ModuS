const express = require('express');
const helmet = require('helmet');

const { setupGracefulTermination } = require('../global/utils');
require('dotenv').config();

const services = require('../services.json');
const { callService } = require('./utils');
const { createLogger, requestLoggerConsole } = require('./logger');
const requestLogger = require('./middleware/loggerMiddleware');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') app.use(requestLoggerConsole);

app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('OK');
});

// API REDIRECTION MIDDLEWARE
app.use('/api', async (req, res) => {
  const pathIdentifier = req.path.split('/')[1];
  const service = services.find(s => s['api-route'] === "/api/" + pathIdentifier);

  if (!service) {
    return res.status(404).send('Service not found');
  }

  const { "redirect-portal": redirectPortal } = service;
  if (!redirectPortal) { 
    return res.status(301).send("Service has been moved permanently")
  }
  
  const response = await callService(req.method, redirectPortal + req.path, req.headers, req.body);

  // console.log(`Proxying request for service: ${service.name} to ${service['redirect-portal']}`);
  res.status(response.status).json(response.data);
});


// // Dynamically create routes for each service
// services.forEach((service) => {
//   const { method, path, target } = route;
//   app[method](path, (req, res) => {
//     // Here you would typically proxy the request to the target service
//     // For this example, we'll just return a placeholder response
//     console.log(`Proxying ${method.toUpperCase()} ${path} to ${target}`);
//     res.send(`Hello from ${service.name} at ${target}!`);
//   });
// });

// Handle 404 requests
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// Error handler
app.use(errorHandler);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`API-GATEWAY SERVICE listening at http://localhost:${port}`);
});

setupGracefulTermination(server);
