import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    {
      name: "Concert",
      displayName: "Concerts",
      icon: "🎵",
    },
    {
      name: "Sports & Screening",
      displayName: "Sports",
      icon: "🏏",
    },
    {
      name: "Theatre",
      displayName: "Theatre",
      icon: "🎭",
    },
    {
      name: "Workshop & Classes",
      displayName: "Workshops & Classes",
      icon: "🎤",
    },
    {
      name: "Seminar",
      displayName: "Seminars",
      icon: "🎓",
    },
    {
      name: "Art & Crafts",
      displayName: "Art",
      icon: "🎨",
    },
    {
      name: "Food",
      displayName: "Food",
      icon: "🍔",
    },
    {
      name: "Family",
      displayName: "Family",
      icon: "👨‍👩‍👧",
    },
  ];

  return (
    <section className="categories-section">

      <div className="section-title">
        <p>EXPLORE</p>
        <h2>Browse By Category</h2>
      </div>

      <div className="categories-grid">

        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/events?category=${encodeURIComponent(category.name)}`}
            className="category-card"
          >
            <div className="category-icon">
              {category.icon}
            </div>

            <h3>{category.displayName}</h3>
          </Link>
        ))}

      </div>

    </section>
  );
}

export default Categories;