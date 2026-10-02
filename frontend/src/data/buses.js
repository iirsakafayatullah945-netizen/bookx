const buses = [
  {
    id: 1,
    company: "Daewoo Express",
    busNumber: "DW-101",
    from: "Islamabad",
    to: "Lahore",
    date: "10 Sep 2026",
    departure: "08:00 AM",
    arrival: "02:30 PM",
    duration: "6h 30m",
    price: 2500,
    seats: 40,
    bookedSeats: [3, 7, 12, 18],
    type: "Luxury Bus",
    boardingPoint: "Faizabad Bus Terminal, Islamabad",
    droppingPoint: "Thokar Niaz Baig, Lahore",
    amenities: [
      "Air Conditioning",
      "WiFi",
      "Charging Port",
      "Comfortable Seats"
    ],
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: 2,
    company: "Faisal Movers",
    busNumber: "FM-202",
    from: "Islamabad",
    to: "Lahore",
    date: "10 Sep 2026",
    departure: "10:30 AM",
    arrival: "05:00 PM",
    duration: "6h 30m",
    price: 2200,
    seats: 45,
    bookedSeats: [2, 5, 10, 21],
    type: "Executive Bus",
    boardingPoint: "Islamabad Motorway Terminal",
    droppingPoint: "Faisal Movers Terminal, Lahore",
    amenities: [
      "Air Conditioning",
      "USB Charging",
      "Entertainment",
      "Reclining Seats"
    ],
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: 3,
    company: "Niazi Express",
    busNumber: "NE-303",
    from: "Rawalpindi",
    to: "Lahore",
    date: "10 Sep 2026",
    departure: "01:00 PM",
    arrival: "07:30 PM",
    duration: "6h 30m",
    price: 2000,
    seats: 40,
    bookedSeats: [1, 4, 8, 15],
    type: "Standard Bus",
    boardingPoint: "Pirwadhai Bus Terminal, Rawalpindi",
    droppingPoint: "Lahore Bus Terminal",
    amenities: [
      "Air Conditioning",
      "Comfortable Seats",
      "Luggage Space"
    ],
    image:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: 4,
    company: "Daewoo Express",
    busNumber: "DW-404",
    from: "Lahore",
    to: "Islamabad",
    date: "11 Sep 2026",
    departure: "09:00 AM",
    arrival: "03:30 PM",
    duration: "6h 30m",
    price: 2500,
    seats: 40,
    bookedSeats: [6, 9, 14, 20],
    type: "Luxury Bus",
    boardingPoint: "Daewoo Terminal, Lahore",
    droppingPoint: "Faizabad Bus Terminal, Islamabad",
    amenities: [
      "Air Conditioning",
      "WiFi",
      "Charging Port",
      "Comfortable Seats"
    ],
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: 5,
    company: "Faisal Movers",
    busNumber: "FM-505",
    from: "Islamabad",
    to: "Multan",
    date: "12 Sep 2026",
    departure: "07:30 AM",
    arrival: "02:00 PM",
    duration: "6h 30m",
    price: 2800,
    seats: 45,
    bookedSeats: [5, 11, 16, 23],
    type: "Executive Bus",
    boardingPoint: "Islamabad Motorway Terminal",
    droppingPoint: "Multan Bus Terminal",
    amenities: [
      "Air Conditioning",
      "WiFi",
      "USB Charging",
      "Reclining Seats"
    ],
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=900&q=80"
  },

  {
    id: 6,
    company: "Niazi Express",
    busNumber: "NE-606",
    from: "Rawalpindi",
    to: "Peshawar",
    date: "12 Sep 2026",
    departure: "09:30 AM",
    arrival: "01:00 PM",
    duration: "3h 30m",
    price: 1500,
    seats: 40,
    bookedSeats: [2, 9, 17],
    type: "Standard Bus",
    boardingPoint: "Pirwadhai Bus Terminal, Rawalpindi",
    droppingPoint: "Peshawar Bus Terminal",
    amenities: [
      "Air Conditioning",
      "Comfortable Seats",
      "Luggage Space"
    ],
    image:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=900&q=80"
  }
];

export default buses;