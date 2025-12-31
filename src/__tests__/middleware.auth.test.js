const { verifyToken, adminOnly, authorOnly } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      user: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('verifyToken', () => {
    it('should return 401 if no token provided', () => {
      req.headers.authorization = undefined;

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('No token provided'),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should verify valid token and call next', () => {
      const decodedToken = { id: 1, email: 'test@example.com', role: 'admin' };
      req.headers.authorization = 'Bearer valid.token.here';
      jwt.verify.mockReturnValue(decodedToken);

      verifyToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(
        'valid.token.here',
        process.env.JWT_SECRET
      );
      expect(req.user).toEqual(decodedToken);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
      req.headers.authorization = 'Bearer invalid.token';
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Invalid or expired token'),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it('should extract Bearer token from Authorization header', () => {
      const decodedToken = { id: 1, role: 'admin' };
      req.headers.authorization = 'Bearer my.jwt.token';
      jwt.verify.mockReturnValue(decodedToken);
      process.env.JWT_SECRET = 'test-secret-key';

      verifyToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('my.jwt.token', 'test-secret-key');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('adminOnly', () => {
    it('should allow admin users', () => {
      req.user = { id: 1, role: 'admin' };

      adminOnly(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny non-admin users', () => {
      req.user = { id: 1, role: 'author' };

      adminOnly(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Admin only'),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorOnly', () => {
    it('should allow author users', () => {
      req.user = { id: 1, role: 'author' };

      authorOnly(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny non-author users', () => {
      req.user = { id: 1, role: 'user' };

      authorOnly(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Authors only'),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });
});
