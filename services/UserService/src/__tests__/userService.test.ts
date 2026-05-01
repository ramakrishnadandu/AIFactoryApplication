import { describe, it, beforeEach } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import UserService from '../UserService'; // Assuming UserService is the base class for the user service
import EmailService from '../../EmailService/src/EmailService';

chai.use(chaiHttp);

describe('User Service', () => {
  let userService: UserService;
  let emailServiceStub: sinon.SinonStub;

  beforeEach(() => {
    userService = new UserService();
    emailServiceStub = sinon.stub(EmailService, 'sendConfirmationEmail'); // Stub email sending functionality
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('User Registration', () => {
    it('should register a user with a valid email and password', async () => {
      const userData = { email: 'test@example.com', password: 'Password123!' };

      emailServiceStub.resolves(true); // Assume email sending succeeds

      const response = await userService.registerUser(userData);
      
      expect(response).to.have.property('success', true);
      expect(response).to.have.property('message', 'Registration successful.');
      expect(emailServiceStub.calledOnce).to.be.true;
    });

    it('should not register a user with an invalid email', async () => {
      const userData = { email: 'invalid-email', password: 'Password123!' };

      const response = await userService.registerUser(userData);

      expect(response).to.have.property('success', false);
      expect(response).to.have.property('message', 'Invalid email format.');
      expect(emailServiceStub.called).to.be.false;
    });

    it('should not register a user with a weak password', async () => {
      const userData = { email: 'test@example.com', password: 'weak' };

      const response = await userService.registerUser(userData);

      expect(response).to.have.property('success', false);
      expect(response).to.have.property('message', 'Password does not meet complexity requirements.');
      expect(emailServiceStub.called).to.be.false;
    });
  });

  describe('User Login', () => {
    it('should log in a user with correct credentials', async () => {
      const loginData = { email: 'test@example.com', password: 'Password123!' };

      // Pre-register user for testing login
      await userService.registerUser({ email: 'test@example.com', password: 'Password123!' });

      const response = await userService.loginUser(loginData);

      expect(response).to.have.property('success', true);
      expect(response).to.have.property('message', 'Login successful.');
    });

    it('should not log in a user with incorrect password', async () => {
      const loginData = { email: 'test@example.com', password: 'WrongPassword!' };

      const response = await userService.loginUser(loginData);

      expect(response).to.have.property('success', false);
      expect(response).to.have.property('message', 'Invalid email or password.');
    });

    it('should not log in a user with non-existent email', async () => {
      const loginData = { email: 'nonexistent@example.com', password: 'Password123!' };

      const response = await userService.loginUser(loginData);

      expect(response).to.have.property('success', false);
      expect(response).to.have.property('message', 'Invalid email or password.');
    });
  });
});