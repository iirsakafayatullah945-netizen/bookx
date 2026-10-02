const mongoose = require("mongoose");
require("dotenv").config();

const Event = require("./models/Event");

const events = [
  {
    title: "Islamabad Music Night",
    category: "Concert",
    city: "Islamabad",
    date: "4 Sep 2026",
    time: "7:00 PM",
    location: "PNCA, Islamabad",
    price: 2500,
    image: "https://v5.ticketwala.pk/uploads/events/banner/the-comeback-tour-by-uzair-jaswal-1787042632-7079.jpg",
    description: "Enjoy an exciting night of live music and entertainment in Islamabad."
  },
  {
    title: "DKP Asia Tour - Islamabad",
    category: "Concert",
    city: "Islamabad",
    date: "12 Sep 2026",
    time: "7:00 PM",
    location: "The Rock Musicarium, Naval Sailing Club Road, LAKE VIEW PARK, Islamabad",
    price: 4000,
    image: "https://v5.ticketwala.pk/uploads/events/banner/dkp-asia-tour-islamabad-1785999949-6899.png",
    description: "Enjoy an exciting night of live music and entertainment in Islamabad."
  },
  {
    title: "Rawalpindi Food Festival",
    category: "Workshop & Classes",
    city: "Islamabad",
    date: "5 September 2026",
    time: "5:00 PM",
    location: "Jinnah Park, Rawalpindi",
    price: 1000,
    image: "https://v5.ticketwala.pk/uploads/events/banner/game-evening-4-0-only-once-a-year-1787818859-7216.jpeg",
    description: "Taste delicious food from different restaurants and food stalls."
  },
  {
    title: "Barista for a Day 2.0",
    category: "Workshop & Classes",
    city: "Islamabad",
    date: "13 Sep 2026",
    time: "2:00 PM",
    location: "Brewtique",
    price: 2700,
    image: "https://v5.ticketwala.pk/uploads/events/banner/barista-for-a-day-2-0-1787828338-7223.jpeg",
    description: "Learn the art of coffee making from professional baristas."
  },
  {
    title: "MUG PAINTING WORKSHOP",
    category: "Art",
    city: "Rawalpindi",
    date: "6 Sep 2026",
    time: "4:00 PM",
    location: "Rawalpindi",
    price: 2000,
    image: "https://v5.ticketwala.pk/uploads/events/banner/mug-painting-workshop-1787557332-7167.png",
    description: "Learn about modern technology and useful digital skills."
  },
  {
    title: "TOTE BAG PAINTING WORKSHOP",
    category: "Art",
    city: "Islamabad",
    date: "06 Sep 2026",
    time: "2:00 PM",
    location: "Sip Coffee Co, Abbasi Market, F-8/3 F 8/3 F-8, Islamabad",
    price: 2000,
    image: "https://v5.ticketwala.pk/uploads/events/banner/tote-bag-painting-workshop-1787308305-7132.png",
    description: "Its a safe space event in which we make sure like minded people meet through activities."
  },
  {
    title: "Makeup Masterclass by Babar Zaheer",
    category: "Workshop & Classes",
    city: "Islamabad",
    date: "10 Oct 2026 - 11 Oct 2026",
    time: "12:00 pm - 05:00 pm",
    location: "Pakistan National Council of the Arts (PNCA), F-5/1 F-5, Islamabad",
    price: 10000,
    image: "https://v5.ticketwala.pk/uploads/events/banner/makeup-masterclass-by-babar-zaheer-1787572615-7173.png",
    description: "Learn the art of makeup application from a professional makeup artist."
  },
  {
    title: "Paint Beyond the Canvas - Acrylic on Wooden Cutouts",
    category: "Art & Crafts",
    city: "Karachi",
    date: "12 Sep 2026",
    time: "4:00 PM",
    location: "Sitara Ghar, Karachi",
    price: 4000,
    image: "https://v5.ticketwala.pk/uploads/events/banner/paint-beyond-the-canvas-acrylic-on-wooden-cutouts-1788346530-7312.png",
    description: "Learn the art of painting on wooden cutouts and create your own unique artwork."
  },
  
  
  
  {
    title: "Loop: Baithak",
    category: "Sports & Screening",
    city: "Karachi",
    date: "11 Sep 2026",
    time: "06:00 pm - 11:00 pm",
    location: "Palmera Social, Khayaban-e-Shujaat, DHA Phase 5, Karachi",
    price: 1500,
    image: "https://v5.ticketwala.pk/uploads/events/banner/loop-baithak-1787498835-7161.png",
    description: "A fun-filled family event with games, activities and entertainment."
  },
  {
    title: "Gham Khuwaar Futsal Fundraiser",
    category: "Sports & Screening",
    city: "Lahore",
    date: "12 Sep 2026",
    time: "04:00 pm - 08:00 pm",
    location: "FR Sports Wapda (Futsalrange), Wapda Town, Lahore",
    price: 5500,
    image: "https://v5.ticketwala.pk/uploads/events/banner/gham-khuwaar-futsal-fundraiser-1786978759-7069.jpg",
    description: "Enjoy an entertaining live sports event."
  },
  {
    title: "Free Fire World Series - Grand Finals",
    category: "Sports & Screening",
    city: "Lahore",
    date: "13 Sep 2026",
    time: "05:00 pm - 10:00 pm",
    location: "Nishtar Park Sports Complex, Hafeez Kardar Road, Lahore",
    price: 700,
    image: "https://v5.ticketwala.pk/uploads/events/banner/free-fire-world-series-grand-finals-1788683643-7354.jpg",
    description: "Learn useful digital skills and discover new opportunities in technology."
  }
];

const importEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Event.deleteMany();

    await Event.insertMany(events);

    console.log("15 events imported successfully");

    await mongoose.disconnect();

  } catch (error) {
    console.log("Import failed:");
    console.log(error.message);
  }
};

importEvents();