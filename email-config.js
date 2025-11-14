/**
 * Email configuration for AWS SES SMTP
 * Edit this file with your AWS SES SMTP settings
 */

module.exports = {
    // Email service provider
    service: null, // Use custom SMTP settings for AWS SES

    // AWS SES SMTP settings
    smtp: {
        host: 'email-smtp.ap-southeast-1.amazonaws.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
            user: 'AKIAYP7ZS6XEZU7JJY4N', // SMTP Username
            pass: 'BEOs60yq/DaozptDT0XQFiYSZkaoC3poYXs2MNRqXj1C'  // SMTP Password
        }
    },

    // Sender email credentials (use SMTP credentials)
    auth: {
        user: 'AKIAYP7ZS6XEZU7JJY4N', // SMTP Username
        pass: 'BEOs60yq/DaozptDT0XQFiYSZkaoC3poYXs2MNRqXj1C'  // SMTP Password
    },

    // Sender email address (must be verified in AWS SES)
    sender: 'automail@starific.net', // Your verified sender email
    
    // Recipient email addresses (can be multiple)
    recipients: [
        'levi.vu@starixsoft.com, toby.phan@starixsoft.com, richard.truong@starixsoft.com, 7racychieng@gmail.com, rdrd33@gmail.com',
        'jacob.phan@starixsoft.com'
        // 'recipient2@example.com',  // Add more recipients as needed
    ],
    
    // Email subject template
    // Available variables: {date}, {sport}, {filename}
    subjectTemplate: 'BetGenius Data - {sport} - {date}',
    
    // Email body template
    bodyTemplate: `
Hello,

Please find attached the BetGenius data file for {sport}.

File: {filename}
Date: {date}
Status: Successfully processed and converted to Excel format

This is an automated email from BetGenius Automation System.

Best regards,
BetGenius Automation
    `,
    
    // Whether to attach the XLSX file
    attachXlsx: true,
    
    // Whether to also attach the CSV file
    attachCsv: false,
    
    // Enable/disable email sending globally
    enabled: true
};
