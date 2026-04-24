const { loginSchema, registerSchema } = require('../../src/validators/auth.validator');

describe('Auth Validators', () => {
  describe('loginSchema', () => {
    it('should pass with valid email and password', () => {
      const { error } = loginSchema.validate({ email: 'admin@gmail.com', password: 'password123' });
      expect(error).toBeUndefined();
    });

    it('should fail with invalid email', () => {
      const { error } = loginSchema.validate({ email: 'admin', password: 'password123' });
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('Please provide a valid email');
    });

    it('should fail if password is missing', () => {
      const { error } = loginSchema.validate({ email: 'admin@gmail.com' });
      expect(error).toBeDefined();
      expect(error.details[0].message).toBe('Password is required');
    });
  });

  describe('registerSchema', () => {
    it('should pass with valid data', () => {
      const { error } = registerSchema.validate({ 
        email: 'test@gmail.com', 
        password: 'password123', 
        role: 'pasien' 
      });
      expect(error).toBeUndefined();
    });

    it('should fail if role is invalid', () => {
      const { error } = registerSchema.validate({ 
        email: 'test@gmail.com', 
        password: 'password123', 
        role: 'admin' // role admin shouldn't be created via open register
      });
      expect(error).toBeDefined();
    });
  });
});
