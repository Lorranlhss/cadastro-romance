export const errorHandler = (err, req, res, next) => {
    console.error('❌ Erro capturado:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor';

    res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};