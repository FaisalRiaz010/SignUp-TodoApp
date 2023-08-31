/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */

// import { Injectable } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';

// import { EmailService } from '../email/email.service'; // Import your EmailService

// @Injectable()
// export class TodoCronService {
//   constructor(
//     private readonly todosService: TodosService,
//     private readonly emailService: EmailService, // Inject the EmailService
//   ) {}

//   @Cron(CronExpression.EVERY_5_HOURS)//set 5sec fr testing 
//   async sendScheduledEmails() {
//     try {
//       const todos = await this.todosService.findTodosWithUserEmails();

//       for (const todo of todos) {
//         if (todo.user.username !== '' && !todo.completed) {
//           //apply check for username is not null and todos are pending
//           const recipientEmail = todo.user.username;

//           // Add a check to ensure recipientEmail is not empty or undefined
//           if (recipientEmail && recipientEmail.trim() !== '') {
//             const subject = 'Todo Reminder!!';
//             const text = `Please Don't forget to complete your todo: ${todo.title}`;

//             await this.emailService.sendEmail(recipientEmail, subject, text);
//             console.log(`Email sent to ${recipientEmail}`);
//           } else {
//             console.warn(
//               `Skipping todo with empty or undefined recipient email.`,
//             );
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error sending emails:', error);
//       throw error;
//     }
//   }
// }
