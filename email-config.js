/**
 * Email configuration
 * Edit this file with your email settings
 */

module.exports = {
    // Email service provider
    // Options: 'gmail', 'outlook', 'yahoo', or use custom SMTP settings below
    service: 'gmail', // Change to your email provider
    
    // Sender email credentials
    auth: {
        user: 'levi.vu@starixsoft.com', // Your email address
        pass: 'jqvl yugq nwru kzoz'      // Your email password or app-specific password
    },
    
    // Recipient email addresses (can be multiple)
    recipients: [
        'levi.vu@starixsoft.com, toby.phan@starixsoft.com, richard.truong@starixsoft.com, 7racychieng@gmail.com, rdrd33@gmail.com',
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
    enabled: true, 
    
    
    smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
    }
};
