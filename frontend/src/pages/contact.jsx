function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Message sent successfully!");

    // Clear the form without leaving the page
    e.target.reset();
  };

  return (
    <main className="contact-page">

      {/* HERO SECTION */}
      <section className="contact-hero">
        <p>GET IN TOUCH</p>

        <h1>Contact Book.X</h1>

        <span>
          Have a question or need help? We would love to hear from you.
        </span>
      </section>

      {/* CONTACT CONTENT */}
      <section className="contact-content">

        {/* CONTACT INFORMATION */}
        <div className="contact-info">

          <h2>Contact Us</h2>

          <p>
            If you have questions about events, bookings, or your tickets,
            feel free to contact us.
          </p>

          <div className="contact-item">
            <h3>Email</h3>
            <p>support@bookx.com</p>
          </div>

          <div className="contact-item">
            <h3>Phone</h3>
            <p>+92 300 1234567</p>
          </div>

          <div className="contact-item">
            <h3>Location</h3>
            <p>Islamabad, Pakistan</p>
          </div>

        </div>

        {/* CONTACT FORM */}
        <div className="contact-form">

          <h2>Send Us a Message</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="name">
                Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Message
              </label>

              <textarea
                id="message"
                rows="6"
                placeholder="Write your message..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="primary-btn"
            >
              Send Message
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}

export default Contact;