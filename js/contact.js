// Initialize EmailJS
emailjs.init("Dv8bhgz0QaUkQDx__");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Honeypot anti-bot check
    const honeypot = document.getElementById("website");
    if (honeypot && honeypot.value.trim() !== "") {
      return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    const params = {
      from_name: name,
      from_email: email,
      message: message,
      reply_to: email,
    };

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = "Sending...";

    emailjs
      .send("service_g91lgsn", "template_3pd8dpq", params)
      .then(() => {
        alert("Message sent successfully!");
        form.reset();
      })
      .catch((error) => {
        console.error("EmailJS error:", error);
        alert("Failed to send message. Please try again.");
      })
      .finally(() => {
        button.disabled = false;
        button.textContent = "Send Message";
      });
  });
});
