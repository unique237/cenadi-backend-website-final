const { errorHandler, asyncHandler } = require('../middleware/errorHandler');
const logger = require('../config/logger');

jest.mock('../config/logger');

describe('Error Handler Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      method: 'POST',
      path: '/api/test',
      ip: '127.0.0.1',
      user: { id: 1 },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('errorHandler', () => {
    it('should handle 500 errors and log them', () => {
      const error = new Error('Internal Server Error');
      error.statusCode = 500;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            message: 'Internal Server Error',
            statusCode: 500,
          }),
        })
      );
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle 400 errors and log as warning', () => {
      const error = new Error('Bad Request');
      error.statusCode = 400;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(logger.warn).toHaveBeenCalled();
    });

    it('should default to 500 if statusCode not specified', () => {
      const error = new Error('Unknown Error');
      
      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({ statusCode: 500 }),
        })
      );
    });

    it('should include stack trace in development', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Dev Error');
      error.statusCode = 500;

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            stack: expect.any(String),
          }),
        })
      );
    });

    it('should exclude stack trace in production', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Prod Error');
      error.statusCode = 500;

      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          error: expect.objectContaining({ stack: expect.any(String) }),
        })
      );
    });
  });

  describe('asyncHandler', () => {
    it('should catch errors from async functions', (done) => {
      const asyncFn = jest.fn().mockRejectedValue(new Error('Async Error'));
      const wrapped = asyncHandler(asyncFn);

      wrapped(req, res, (error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Async Error');
        done();
      });
    });

    it('should convert non-Error rejections to Error', (done) => {
      const asyncFn = jest.fn().mockRejectedValue('String rejection');
      const wrapped = asyncHandler(asyncFn);

      wrapped(req, res, (error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('String rejection');
        done();
      });
    });

    it('should call next without error on success', async () => {
      const asyncFn = jest.fn().mockResolvedValue(true);
      const wrapped = asyncHandler(asyncFn);

      await wrapped(req, res, next);
      
      expect(asyncFn).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
