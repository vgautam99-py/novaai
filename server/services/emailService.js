import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @desc Send OTP verification code to user email using Mailjet API v3.1
 * @param {string} email 
 * @param {string} otp 
 */
export const sendOTPEmail = async (email, otp) => {
  const mailjetApiKeyPublic = process.env.MAILJET_API_KEY_PUBLIC;
  const mailjetApiKeyPrivate = process.env.MAILJET_API_KEY_PRIVATE;
  const senderEmail = process.env.SENDER_EMAIL || 'support@novaai.com';

  if (!mailjetApiKeyPublic || !mailjetApiKeyPrivate) {
    console.warn("Mailjet keys are not configured. Check MAILJET_API_KEY_PUBLIC and MAILJET_API_KEY_PRIVATE in .env.");
    console.log(`[DEVELOPMENT MOCK EMAIL] OTP for ${email} is: ${otp}`);
    return { success: true, mocked: true };
  }

  // Mailjet request body
  const data = {
    Messages: [
      {
        From: {
          Email: senderEmail,
          Name: "NovaAI Support"
        },
        To: [
          {
            Email: email,
            Name: email.split('@')[0]
          }
        ],
        Subject: "Your NovaAI Verification Code",
        HTMLPart: `
          <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #f3f4f6; padding: 40px; border-radius: 16px; max-width: 500px; margin: auto;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                Nova<span style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">AI</span>
              </span>
            </div>
            <div style="background-color: #111827; padding: 32px; border-radius: 12px; border: 1px solid #1f2937;">
              <h2 style="font-size: 18px; font-weight: 600; color: #ffffff; margin-top: 0; margin-bottom: 12px;">Verification Code</h2>
              <p style="font-size: 14px; color: #9ca3af; margin-bottom: 24px; line-height: 1.5;">
                Use the following One-Time Password (OTP) to log in to your NovaAI account. This code is valid for <strong>5 minutes</strong>.
              </p>
              <div style="text-align: center; background-color: #030712; padding: 16px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #6366f1; border: 1px solid #374151;">
                ${otp}
              </div>
              <p style="font-size: 11px; color: #6b7280; text-align: center; margin-top: 24px; margin-bottom: 0;">
                If you did not request this code, you can safely ignore this email.
              </p>
            </div>
            <p style="text-align: center; font-size: 11px; color: #4b5563; margin-top: 24px;">
              Powered by Gemini AI • NovaAI
            </p>
          </div>
        `
      }
    ]
  };

  const authHeader = Buffer.from(`${mailjetApiKeyPublic}:${mailjetApiKeyPrivate}`).toString('base64');

  try {
    const response = await axios.post('https://api.mailjet.com/v3.1/send', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authHeader}`
      }
    });

    if (response.status === 200) {
      console.log(`Verification OTP email sent successfully to ${email} via Mailjet.`);
      return { success: true };
    } else {
      throw new Error(`Mailjet API returned status ${response.status}`);
    }
  } catch (error) {
    const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error(`Mailjet Mailer Error: ${errorDetails}`);
    throw new Error(`Failed to send verification email. Details: ${errorDetails}`);
  }
};
