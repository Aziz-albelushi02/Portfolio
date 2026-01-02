// EmailJS contact form handler
// Fill these with your EmailJS credentials
const EMAILJS_PUBLIC_KEY = "C8PVfJCjPGCdVSvZI"; 
const EMAILJS_SERVICE_ID = "service_g91lgsn"; 
const EMAILJS_TEMPLATE_ID = "template_3pd8dpq"; 

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    if (!form) return;

    // Create status area for user feedback
    const status = document.createElement("div");
    status.id = "contact-status";
    status.setAttribute("role", "status");
    status.className = "mt-3";
    form.appendChild(status);

    const submitBtn = form.querySelector('button[type="submit"]');

    // Helpers
    const showMessage = (text, type) => {
      status.textContent = text;
      status.className = `mt-3 alert alert-${type}`; 
    };
    const clearMessage = () => {
      status.textContent = "";
      status.className = "mt-3";
    };

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    // Initialize EmailJS
    try {
      if (typeof emailjs === "undefined") {
        console.error("EmailJS SDK not loaded.");
      } else if (EMAILJS_PUBLIC_KEY) {
        // v4 syntax supports object with publicKey
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      }
    } catch (err) {
      console.error("Failed to initialize EmailJS:", err);
    }

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearMessage();

      // Honeypot: silently accept if filled
      const website = document.getElementById("website");
      if (website && website.value.trim() !== "") {
        showMessage("Thanks! Your message has been received.", "success");
        form.reset();
        return;
      }

      const nameEl = document.getElementById("name");
      const emailEl = document.getElementById("email");
      const messageEl = document.getElementById("message");

      const name = (nameEl?.value || "").trim();
      const email = (emailEl?.value || "").trim();
      const message = (messageEl?.value || "").trim();

      
      if (!name) {
        showMessage("Please enter your name.", "warning");
        nameEl?.focus();
        return;
      }
      if (!email || !isValidEmail(email)) {
        showMessage("Please enter a valid email.", "warning");
        emailEl?.focus();
        return;
      }
      if (!message) {
        showMessage("Please enter a message.", "warning");
        messageEl?.focus();
        return;
      }

      if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
        showMessage(
          "Email service not configured. Please set EmailJS keys.",
          "danger"
        );
        console.error("Set EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID in js/contact.js");
        return;
      }

      
      const templateParams = {
        // Match your EmailJS template placeholders
        name: name,
        email: email,
        time: new Date().toLocaleString(),
        message: message,

        // Also send common aliases for broader template compatibility
        from_name: name,
        user_name: name,
        from_email: email,
        user_email: email,
        reply_to: email, // set this in EmailJS template settings → Reply-To
        subject: `Contact from ${name} <${email}>`,

        // Optional diagnostics
        site_origin: window.location.origin,
      };

      
      const originalText = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        showMessage("Message sent! I will get back to you soon.", "success");
        form.reset();
      } catch (err) {
        console.error("EmailJS send failed:", err);
        const detail = (err && (err.text || err.message)) ? ` Details: ${err.text || err.message}` : "";
        showMessage(`Failed to send.${detail}`, "danger");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText || "Send Message";
        }
      }
    });
  });
})();
