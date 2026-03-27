import mongoose from "mongoose"

const listings = [
  // Morocco - MAD
  {
    user: new mongoose.Types.ObjectId("694ed20652eaf228a7b68db1"),
    title: "Modern Studio in Gueliz",
    description: "Bright studio apartment with high-speed Wi-Fi, walking distance from Carrefour and Majorelle Garden.",
    location: "Gueliz, Marrakech, Morocco",
    pricingType: "monthly",
    amenities: ["Wi-Fi", "Furnished", "Air Conditioning", "Kitchen Access"],
    images: [],
    beds: 1, bathrooms: 1, bedrooms: 0, size: 40, floor: 2,
    pets: 0, children: 0, adults: 1,
    price: { amount_usd: 280, amount_local: 2850, currency: "MAD" },
    avgRating: 4.1, count: 8, status: "active", bookings: []
  },
  {
    user: new mongoose.Types.ObjectId("694ed20652eaf228a7b68db1"),
    title: "Spacious Riad in Medina",
    description: "Traditional Moroccan riad with a private courtyard, fountain, and rooftop terrace. Fully furnished.",
    location: "Medina, Fes, Morocco",
    pricingType: "nightly",
    amenities: ["Wi-Fi", "Furnished", "Kitchen Access", "Balcony", "Garden"],
    images: [],
    beds: 3, bathrooms: 2, bedrooms: 3, size: 180, floor: 0,
    pets: 0, children: 2, adults: 4,
    price: { amount_usd: 95, amount_local: 970, currency: "MAD" },
    avgRating: 4.8, count: 34, status: "active", bookings: []
  },

  // UAE - AED
  {
    user: new mongoose.Types.ObjectId("692db9f0f2b7684713b94744"),
    title: "Luxury 1BR in Dubai Marina",
    description: "High-floor apartment with full marina view, gym, pool, and covered parking included.",
    location: "Dubai Marina, Dubai, UAE",
    pricingType: "monthly",
    amenities: ["Wi-Fi", "Furnished", "Parking", "Air Conditioning", "Gym", "Pool", "Balcony"],
    images: [],
    beds: 1, bathrooms: 1, bedrooms: 1, size: 75, floor: 18,
    pets: 0, children: 0, adults: 2,
    price: { amount_usd: 2100, amount_local: 7710, currency: "AED" },
    avgRating: 4.6, count: 21, status: "active", bookings: []
  },
  {
    user: new mongoose.Types.ObjectId("692db9f0f2b7684713b94744"),
    title: "Studio near Mall of the Emirates",
    description: "Compact and clean studio, 10 min walk to Mall of the Emirates metro station.",
    location: "Al Barsha, Dubai, UAE",
    pricingType: "monthly",
    amenities: ["Wi-Fi", "Furnished", "Air Conditioning", "Parking"],
    images: [],
    beds: 1, bathrooms: 1, bedrooms: 0, size: 38, floor: 5,
    pets: 0, children: 0, adults: 1,
    price: { amount_usd: 950, amount_local: 3490, currency: "AED" },
    avgRating: 3.9, count: 15, status: "active", bookings: []
  },

  // UK - GBP
  {
    user: new mongoose.Types.ObjectId("692ec1baf85907e069a5e656"),
    title: "Cosy Flat in Shoreditch",
    description: "Trendy East London flat near Silicon Roundabout. Exposed brick, fast internet, great for remote work.",
    location: "Shoreditch, London, UK",
    pricingType: "monthly",
    amenities: ["Wi-Fi", "Furnished", "Washer / Dryer", "Kitchen Access"],
    images: [],
    beds: 1, bathrooms: 1, bedrooms: 1, size: 52, floor: 1,
    pets: 1, children: 0, adults: 2,
    price: { amount_usd: 2450, amount_local: 1950, currency: "GBP" },
    avgRating: 4.4, count: 19, status: "active", bookings: []
  },

  // India - INR
  {
    user: new mongoose.Types.ObjectId("69a968cae6a2d2df01a9ecf6"),
    title: "2BHK Flat in Koramangala",
    description: "Fully furnished 2BHK in Bangalore's startup hub. Great connectivity, nearby cafes and co-working spaces.",
    location: "Koramangala, Bangalore, India",
    pricingType: "monthly",
    amenities: ["Wi-Fi", "Furnished", "Air Conditioning", "Kitchen Access", "Parking", "Gym"],
    images: [],
    beds: 2, bathrooms: 2, bedrooms: 2, size: 95, floor: 4,
    pets: 0, children: 1, adults: 3,
    price: { amount_usd: 480, amount_local: 40000, currency: "INR" },
    avgRating: 4.2, count: 27, status: "active", bookings: []
  },

  // Saudi Arabia - SAR
  {
    user: new mongoose.Types.ObjectId("69a968cae6a2d2df01a9ecf6"),
    title: "Executive Apartment in Al Olaya",
    description: "Premium furnished apartment in Riyadh's business district, ideal for corporate stays.",
    location: "Al Olaya, Riyadh, Saudi Arabia",
    pricingType: "monthly",
    amenities: ["Wi-Fi", "Furnished", "Parking", "Air Conditioning", "Gym", "Pool"],
    images: [],
    beds: 2, bathrooms: 2, bedrooms: 2, size: 120, floor: 8,
    pets: 0, children: 0, adults: 2,
    price: { amount_usd: 1600, amount_local: 6000, currency: "SAR" },
    avgRating: 4.5, count: 11, status: "active", bookings: []
  },

  // Brazil - BRL
  {
    user: new mongoose.Types.ObjectId("69aae97afb070079a036e0c7"),
    title: "Beach Apartment in Ipanema",
    description: "One block from Ipanema beach. Bright, airy, fully equipped. Perfect for short or long stays.",
    location: "Ipanema, Rio de Janeiro, Brazil",
    pricingType: "nightly",
    amenities: ["Wi-Fi", "Furnished", "Air Conditioning", "Kitchen Access", "Balcony"],
    images: [],
    beds: 1, bathrooms: 1, bedrooms: 1, size: 58, floor: 3,
    pets: 0, children: 1, adults: 2,
    price: { amount_usd: 120, amount_local: 620, currency: "BRL" },
    avgRating: 4.7, count: 42, status: "active", bookings: []
  },

  // Egypt - EGP
  {
    user: new mongoose.Types.ObjectId("69aae97afb070079a036e0c7"),
    title: "Nile View Apartment in Zamalek",
    description: "Elegant apartment on Zamalek island with partial Nile views, close to embassies and fine dining.",
    location: "Zamalek, Cairo, Egypt",
    pricingType: "monthly",
    amenities: ["Wi-Fi", "Furnished", "Air Conditioning", "Kitchen Access", "Balcony"],
    images: [],
    beds: 2, bathrooms: 1, bedrooms: 2, size: 110, floor: 6,
    pets: 0, children: 2, adults: 3,
    price: { amount_usd: 390, amount_local: 19000, currency: "EGP" },
    avgRating: 4.0, count: 9, status: "active", bookings: []
  },

  // Inactive listing example
  {
    user: new mongoose.Types.ObjectId("694ed20652eaf228a7b68db1"),
    title: "Office Space in Casablanca CBD",
    description: "Open-plan office space for rent in the business district. Suitable for small teams up to 10.",
    location: "Maarif, Casablanca, Morocco",
    pricingType: "monthly",
    amenities: ["Wi-Fi", "Air Conditioning", "Parking"],
    images: ["https://res.cloudinary.com/dar1ck0sg/image/upload/v1772174483/uxpbtcgnwlajpl2wneaj.jpg",
            "https://res.cloudinary.com/dar1ck0sg/image/upload/v1772808511/tfeg6gejvnebqrs9nfb1.jpg",
           "https://res.cloudinary.com/dar1ck0sg/image/upload/v1772285091/s3wuu8ev5ytxjxbjwhqe.jpg",
           "https://res.cloudinary.com/dar1ck0sg/image/upload/v1772285090/lmhoeigvd8yptvxvqhzc.jpg"
    ],
    beds: 0, bathrooms: 1, bedrooms: 0, size: 85, floor: 2,
    pets: 0, children: 0, adults: 10,
    price: { amount_usd: 650, amount_local: 6600, currency: "MAD" },
    avgRating: 0, count: 0, status: "inactive", bookings: []
  },
];

module.exports = listings;