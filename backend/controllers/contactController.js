import { sendContactFormEmail } from "../utils/emailService.js";

// Handle contact form submission
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.json({ 
        success: false, 
        message: "Please fill in all required fields" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({ 
        success: false, 
        message: "Please enter a valid email address" 
      });
    }

    // Validate message length
    if (message.length < 10) {
      return res.json({ 
        success: false, 
        message: "Message must be at least 10 characters long" 
      });
    }

    // Prepare contact data
    const contactData = {
      name,
      email,
      phone: phone || "Not provided",
      subject,
      message,
    };

    // Send email to admin
    const emailSent = await sendContactFormEmail(contactData);

    if (emailSent) {
      res.json({ 
        success: true, 
        message: "Your message has been sent successfully! We'll respond within 24 hours." 
      });
    } else {
      res.json({ 
        success: false, 
        message: "Failed to send message. Please try again." 
      });
    }
  } catch (error) {
    console.error("Contact form error:", error);
    res.json({ 
      success: false, 
      message: "An error occurred. Please try again later." 
    });
  }
};

export { submitContactForm };
