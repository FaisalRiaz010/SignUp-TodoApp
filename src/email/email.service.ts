/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'm.faisalriaz010@gmail.com',
        pass: 'wlisfxilrsoyntpo',
      },
    });
  }
  //send email to user for verification
  async sendTestEmail(email: string, token: string): Promise<void> {
    try {
      const mailOptions = {
        from: 'm.faisalriaz010@gmail.com',
        to: email,
        subject: 'Test Email',
        text: `This is a test email from your application. With Token: ${token}`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Test email sent:', info.response);
    } catch (error) {
      console.error('Error sending test email:', error);
      throw new Error('Failed to send test email');
    }
  }
  //send email to reset password
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    try {
      const mailOptions = {
        from: 'm.faisalriaz010@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `You have requested to reset your password. Use the following token: ${token}`,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', info.response);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  //for send to pending todos users
  async sendEmail(email, subject, text): Promise<void> {
    try {
      const mailOptions = {
        from: 'm.faisalriaz010@gmail.com',
        to: email,
        subject,
        text,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Pending todos email sent:', info.response);
    } catch (error) {
      console.error('Error sending pending todo email:', error);
      throw new Error('Failed to send  email');
    }
  }
}
