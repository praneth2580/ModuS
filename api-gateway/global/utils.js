const terminationSignals = ['SIGINT', 'SIGTERM', 'SIGHUP'];

function setupGracefulTermination(server) {
  terminationSignals.forEach(signal => {
    process.on(signal, () => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('Server closed. Exiting process.');
        process.exit(0);
      });
    });
  });
}

module.exports = {
  setupGracefulTermination
};
