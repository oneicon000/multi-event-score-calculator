// data.js
// Contains event constants for IAAF Combined Events scoring
// Formula reference:
// Track: P = a * (b - T)^c
// Jump:  P = a * (M - b)^c   (M in centimeters)
// Throw: P = a * (D - b)^c   (D in meters)

const eventConfigs = {
  // ------------------------
  // Men's Outdoor Decathlon
  // ------------------------
  decathlonMen: {
    title: "Men's Decathlon",
    events: [
      { name: "100m", type: "track", a: 25.4347, b: 18.0, c: 1.81 },
      { name: "Long Jump", type: "jump", a: 0.14354, b: 220.0, c: 1.40 },
      { name: "Shot Put", type: "throw", a: 51.39, b: 1.50, c: 1.05 },
      { name: "High Jump", type: "jump", a: 0.8465, b: 75.0, c: 1.42 },
      { name: "400m", type: "track", a: 1.53775, b: 82.0, c: 1.81 },
      { name: "110m Hurdles", type: "track", a: 5.74352, b: 28.5, c: 1.92 },
      { name: "Discus Throw", type: "throw", a: 12.91, b: 4.0, c: 1.10 },
      { name: "Pole Vault", type: "jump", a: 0.2797, b: 100.0, c: 1.35 },
      { name: "Javelin Throw", type: "throw", a: 10.14, b: 7.0, c: 1.08 },
      { name: "1500m", type: "track", a: 0.03768, b: 480.0, c: 1.85 }
    ]
  },

  // ------------------------
  // Men's Indoor Heptathlon
  // ------------------------
  heptathlonMenIndoor: {
    title: "Men's Indoor Heptathlon",
    events: [
      { name: "60m", type: "track", a: 58.0150, b: 11.5, c: 1.81 },
      { name: "Long Jump", type: "jump", a: 0.14354, b: 220.0, c: 1.40 },
      { name: "Shot Put", type: "throw", a: 51.39, b: 1.50, c: 1.05 },
      { name: "High Jump", type: "jump", a: 0.8465, b: 75.0, c: 1.42 },
      { name: "60m Hurdles", type: "track", a: 20.5173, b: 15.5, c: 1.92 },
      { name: "Pole Vault", type: "jump", a: 0.2797, b: 100.0, c: 1.35 },
      { name: "1000m", type: "track", a: 0.08713, b: 305.5, c: 1.85 }
    ]
  },

  // ------------------------
  // Women's Outdoor Heptathlon
  // ------------------------
  heptathlonWomen: {
    title: "Women's Heptathlon",
    events: [
      { name: "100m Hurdles", type: "track", a: 9.23076, b: 26.7, c: 1.835 },
      { name: "High Jump", type: "jump", a: 1.84523, b: 75.0, c: 1.348 },
      { name: "Shot Put", type: "throw", a: 56.0211, b: 1.50, c: 1.05 },
      { name: "200m", type: "track", a: 4.99087, b: 42.5, c: 1.81 },
      { name: "Long Jump", type: "jump", a: 0.188807, b: 210.0, c: 1.41 },
      { name: "Javelin Throw", type: "throw", a: 15.9803, b: 3.80, c: 1.04 },
      { name: "800m", type: "track", a: 0.11193, b: 254.0, c: 1.88 }
    ]
  },

  // ------------------------
  // Women's Indoor Pentathlon
  // ------------------------
  pentathlonWomenIndoor: {
    title: "Women's Indoor Pentathlon",
    events: [
      { name: "60m Hurdles", type: "track", a: 20.0479, b: 17.0, c: 1.835 },
      { name: "High Jump", type: "jump", a: 1.84523, b: 75.0, c: 1.348 },
      { name: "Shot Put", type: "throw", a: 56.0211, b: 1.50, c: 1.05 },
      { name: "Long Jump", type: "jump", a: 0.188807, b: 210.0, c: 1.41 },
      { name: "800m", type: "track", a: 0.11193, b: 254.0, c: 1.88 }
    ]
  }
};
