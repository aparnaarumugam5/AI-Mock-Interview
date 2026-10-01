import React, { useState } from "react";
import "./Contact.css";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
        }),
      });

      const data = await response.json();

      console.log("Contact API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      alert("Thank you! Your message has been sent successfully. ✅");

      setName("");
      setEmail("");
      setMessage("");

    } catch (error) {
      console.error("Contact Error:", error);

      alert(
        "❌ Message could not be sent.\n\n" +
        (error.message || "Please check whether the backend server is running.")
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">

      <div className="contact-header">
        <h1>📩 Contact Us</h1>

        <p>
          Have questions or feedback about our AI Mock Interview System?
          We'd love to hear from you.
        </p>
      </div>

      <div className="contact-container">

        {/* Contact Information */}

        <div className="contact-info">

          <h2>Get In Touch</h2>

          <p>
            🤖 We are here to help you improve your interview
            skills and career preparation.
          </p>

          <div className="info-item">
            <h3>📧 Email</h3>
            <p>aimockinterview74@gmail.com</p>
          </div>

          <div className="info-item">
            <h3>📞 Phone</h3>
            <p>+91 98765 43210</p>
          </div>

          <div className="info-item">
            <h3>📍 Location</h3>
            <p>India</p>
          </div>

        </div>

        {/* Contact Form */}

        <div className="contact-form">

          <h2>Send Us a Message</h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <textarea
              rows="6"
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "📨 Sending..." : "📩 Send Message"}
            </button>

          </form>

        </div>

      </div>

      {/* Social Links */}

      <div className="social-section">

        <h2>Connect With Us</h2>

        <button type="button">
          💼 LinkedIn
        </button>

        <button type="button">
          💻 GitHub
        </button>

      </div>

    </div>
  );
}

export default Contact;