import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import EmailService from '../emailService'; // Assume this is the EmailService implementation path
import nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('EmailService', () => {
  let emailService: EmailService;
  
  beforeEach(() => {
    emailService = new EmailService();
  });

  describe('sendEmail', () => {
    it('should send an email successfully', async () => {
      const mockSendMail = jest.fn((options, callback) => callback(null, { messageId: '12345' }));
      
      nodemailer.createTransport.mockReturnValueOnce({
        sendMail: mockSendMail,
      });

      const result = await emailService.sendEmail('test@example.com', 'Test subject', 'Test body');

      expect(mockSendMail).toHaveBeenCalled();
      expect(result.messageId).toEqual('12345');
    });

    it('should throw an error if email fails to send', async () => {
      const mockSendMail = jest.fn((options, callback) => callback(new Error('Failed to send email')));
      
      nodemailer.createTransport.mockReturnValueOnce({
        sendMail: mockSendMail,
      });

      await expect(emailService.sendEmail('test@example.com', 'Test subject', 'Test body'))
        .rejects
        .toThrow('Failed to send email');
    });
  });

  describe('sendConfirmationEmail', () => {
    it('should successfully send a confirmation email', async () => {
      const spySendEmail = jest.spyOn(emailService, 'sendEmail').mockResolvedValueOnce({ messageId: '12345' });

      const userEmail = 'user@example.com';
      const result = await emailService.sendConfirmationEmail(userEmail);

      expect(spySendEmail).toHaveBeenCalledWith(
        userEmail,
        'Confirm Your Account',
        expect.stringContaining('Please confirm your account by clicking the link')
      );
      expect(result.messageId).toBe('12345');
    });

    it('should propagate errors from sendEmail', async () => {
      jest.spyOn(emailService, 'sendEmail').mockRejectedValueOnce(new Error('Network error'));

      const userEmail = 'user@example.com';
      await expect(emailService.sendConfirmationEmail(userEmail))
        .rejects
        .toThrow('Network error');
    });
  });
});