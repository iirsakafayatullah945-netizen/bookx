function About() {
  return (
    <main className="about-page">

      <section className="about-hero">
        <p>ABOUT BOOK.X</p>
        <h1>Discover Events Across Pakistan</h1>
        <span>
          Your simple platform for discovering and booking exciting events
          in Islamabad and Rawalpindi.
        </span>
      </section>

      <section className="about-content">

        <div className="about-card">
          <h2>Who We Are</h2>

          <p>
            EventPK is an event discovery and ticket booking platform
            designed to help people find upcoming events in Islamabad
            and Rawalpindi.
          </p>

          <p>
            From concerts and festivals to conferences and entertainment
            events, EventPK brings event information together in one place.
          </p>
        </div>

        <div className="about-card">
          <h2>What We Offer</h2>

          <div className="about-features">
            <div>
              <h3>Discover Events</h3>
              <p>
                Find upcoming events based on city and category.
              </p>
            </div>

            <div>
              <h3>Easy Booking</h3>
              <p>
                Select an event, choose your tickets and complete your booking.
              </p>
            </div>

            <div>
              <h3>My Tickets</h3>
              <p>
                Keep track of your booked events from one place.
              </p>
            </div>
          </div>
        </div>

        <div className="about-card about-mission">
          <h2>Our Mission</h2>

          <p>
            Our mission is to make discovering local events easier,
            faster and more convenient for people in Islamabad and
            Rawalpindi.
          </p>
        </div>

      </section>

    </main>
  );
}

export default About;