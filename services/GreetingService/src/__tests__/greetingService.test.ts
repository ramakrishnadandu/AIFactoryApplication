// Import dependencies and modules required for testing
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../server'; // Assuming express app is exported from server.ts
import { generateGreeting } from '../greetingService'; // Assuming this is the main service logic
import GreetingService from '../greetingService'; // Import the class/service if needed

// Mock Data
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
};

// Mocking email service
jest.mock('../emailService', () => ({
  sendEmail: jest.fn().mockReturnValue(Promise.resolve(true)),
}));

// Describe the Greeting Service tests
describe('Greeting Service', () => {

  // Before each test, setup any necessary data
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test the GET /greet endpoint for a valid user
  it('should return a personalized greeting for a valid user', async () => {
    const response = await supertest(app)
      .get(`/greet`)
      .query({ userId: mockUser.id });
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('greeting');
    expect(response.body.greeting).toContain(mockUser.name);
  });

  // Test personalized message generation
  it('should generate a greeting message', () => {
    const message = generateGreeting(mockUser.name);
    expect(message).toEqual(expect.stringContaining(mockUser.name));
  });

  // Test the GET /greet endpoint for an invalid user
  it('should return 404 for an unknown user', async () => {
    const response = await supertest(app)
      .get(`/greet`)
      .query({ userId: 'unknown' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('User not found');
  });
  
  // Test error handling in the greeting service function
  it('should handle errors in greeting generation', () => {
    const invalidUserName = null;
    try {
      generateGreeting(invalidUserName);
      // If no error is thrown by generateGreeting, fail the test
      fail('Expected error was not thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(TypeError);
      expect(error.message).toBe('Invalid user name');
    }
  });

  // Test greeting email dispatch
  it('should send a greeting email', async () => {
    const emailService = require('../emailService');
    const response = await supertest(app)
      .post(`/greet/sendEmail`)
      .send({ userId: mockUser.id });

    expect(response.status).toBe(200);
    expect(emailService.sendEmail).toHaveBeenCalledWith(expect.objectContaining({ email: mockUser.email }));
  });
});