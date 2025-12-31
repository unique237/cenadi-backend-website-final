const logger = require('../config/logger');

/**
 * Middleware de centralisation et gestion des erreurs
 * Format standardisé pour toutes les réponses d'erreur
 */
const errorHandler = (error, req, res, next) => {
  let err = error;
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur serveur interne';
  const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Logger l'erreur avec contexte
  const logContext = {
    errorId,
    statusCode,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userId: req.user?.id || 'anonymous',
    timestamp: new Date().toISOString(),
  };

  if (statusCode === 500) {
    logger.error(message, { ...logContext, stack: err.stack });
  } else if (statusCode >= 400) {
    logger.warn(message, logContext);
  }

  // Réponse standardisée
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      errorId,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

/**
 * Wrapper pour capturer les erreurs des routes asynchrones
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((catchErr) => {
    // Assurer que catchErr est une instance d'Error
    let error = catchErr;
    if (!(error instanceof Error)) {
      error = new Error(String(error));
    }
    next(error);
  });
};

module.exports = { errorHandler, asyncHandler };
