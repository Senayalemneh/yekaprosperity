const nodemailer = require('nodemailer');

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendContactConfirmation = async (email, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Thank you for contacting us',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Hello ${name},</h2>
          <p>Thank you for reaching out to us! We've received your message and our team will get back to you as soon as possible.</p>
          <p>Here's a summary of what you can expect:</p>
          <ul>
            <li>We typically respond within 24-48 hours</li>
            <li>Our support team is available Monday-Friday, 9am-5pm</li>
            <li>For urgent matters, please call our hotline at +1234567890</li>
          </ul>
          <p>Best regards,<br>The Support Team</p>
          <hr>
          <p style="font-size: 12px; color: #7f8c8d;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending confirmation email:', err);
    // Fail silently as email sending shouldn't break the contact submission
  }
};

exports.sendContactNotification = async (contactData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">New Contact Submission</h2>
          <p><strong>Name:</strong> ${contactData.userName}</p>
          <p><strong>Contact Info:</strong> ${contactData.contactInfo}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${contactData.message}
          </div>
          ${contactData.evidence ? `<p><strong>Attachment:</strong> <a href="${contactData.evidence}">View File</a></p>` : ''}
          <hr>
          <a href="${process.env.ADMIN_URL}/contacts/${contactData.id}" 
             style="display: inline-block; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 5px;">
            View in Dashboard
          </a>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending notification email:', err);
  }
};