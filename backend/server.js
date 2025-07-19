const app = require('./app');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log('\n🚀 SLT-Mobitel ConsentHub API Server Started');
  console.log('='.repeat(50));
  console.log(`📍 Environment: ${NODE_ENV}`);
  console.log(`🌐 Server running on port: ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log('='.repeat(50));
  console.log(`[${new Date().toISOString()}] Server ready to accept connections\n`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(`[ServerError] ${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`[ServerError] ${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n[Shutdown] Received ${signal}. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      console.error('[Shutdown] Error during server shutdown:', err);
      process.exit(1);
    }
    
    console.log('[Shutdown] HTTP server closed.');
    console.log('[Shutdown] Process terminated gracefully.');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('[Shutdown] Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  console.error('[UncaughtException]', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[UnhandledRejection] at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = server;
