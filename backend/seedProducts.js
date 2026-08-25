import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import Product from "./models/Product.js";


dotenv.config();


// =========================================
// PRODUCTS DATA
// =========================================

const products = [

  // =========================================
  // CLEANSERS
  // =========================================

  {
    name: "Gentle Daily Cleanser",
    category: "Cleansers",
    skinTypes: [
      "All Skin Types",
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 499,
    originalPrice: 649,
    image: "/images/cleanser.jpg",
    rating: 4.4,
    reviews: 0,
    description:
      "A gentle daily cleanser that removes dirt and impurities without drying the skin.",
    stock: 50,
  },

  {
    name: "Rice Foam Cleanser",
    category: "Cleansers",
    skinTypes: [
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 549,
    originalPrice: 699,
    image: "/images/rice-foam-cleanser.jpg",
    rating: 4.6,
    reviews: 0,
    description:
      "A soft rice-based foam cleanser for clean and comfortable skin.",
    stock: 50,
  },

  {
    name: "Green Tea Gel Cleanser",
    category: "Cleansers",
    skinTypes: [
      "Oily Skin",
      "Combination Skin",
    ],
    price: 529,
    originalPrice: 699,
    image: "/images/green-tea-gel-cleanser.jpg",
    rating: 4.5,
    reviews: 0,
    description:
      "A refreshing green tea gel cleanser designed for oily and combination skin.",
    stock: 50,
  },

  {
    name: "Calm Skin Cleanser",
    category: "Cleansers",
    skinTypes: [
      "Sensitive Skin",
      "Dry Skin",
    ],
    price: 579,
    originalPrice: 729,
    image: "/images/calm-skin-cleanser.jpg",
    rating: 4.6,
    reviews: 0,
    description:
      "A calming cleanser designed for sensitive and dry skin.",
    stock: 50,
  },


  // =========================================
  // TONERS
  // =========================================

  {
    name: "Rose Water Toner",
    category: "Toners",
    skinTypes: [
      "All Skin Types",
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 449,
    originalPrice: 599,
    image: "/images/rose-water-toner.jpg",
    rating: 4.3,
    reviews: 0,
    description:
      "A refreshing rose water toner that helps hydrate and refresh the skin.",
    stock: 50,
  },

  {
    name: "Barrier Balance Toner",
    category: "Toners",
    skinTypes: [
      "Sensitive Skin",
      "Dry Skin",
    ],
    price: 579,
    originalPrice: 749,
    image: "/images/barrier-balance-toner.jpg",
    rating: 4.6,
    reviews: 0,
    description:
      "A soothing toner designed to support the skin barrier.",
    stock: 50,
  },


  // =========================================
  // SERUMS
  // =========================================

  {
    name: "Glow Vitamin C Serum",
    category: "Serums",
    skinTypes: [
      "Dull Skin",
      "All Skin Types",
    ],
    price: 699,
    originalPrice: 899,
    image: "/images/serum.jpg",
    rating: 4.5,
    reviews: 0,
    description:
      "A brightening vitamin C serum for a healthy-looking glow.",
    stock: 50,
  },

  {
    name: "Niacinamide Balance Serum",
    category: "Serums",
    skinTypes: [
      "Oily Skin",
      "Combination Skin",
    ],
    price: 649,
    originalPrice: 849,
    image: "/images/niacinamide-balance-serum.jpg",
    rating: 4.7,
    reviews: 0,
    description:
      "A lightweight niacinamide serum for balanced-looking skin.",
    stock: 50,
  },

  {
    name: "Hyaluronic Glow Serum",
    category: "Serums",
    skinTypes: [
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 729,
    originalPrice: 949,
    image: "/images/hyaluronic-glow-serum.jpg",
    rating: 4.8,
    reviews: 0,
    description:
      "A hydrating hyaluronic acid serum for soft and plump-looking skin.",
    stock: 50,
  },


  // =========================================
  // MOISTURIZERS
  // =========================================

  {
    name: "Hydra Glow Moisturizer",
    category: "Moisturizers",
    skinTypes: [
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 599,
    originalPrice: 799,
    image: "/images/moisturizer.jpg",
    rating: 4.7,
    reviews: 0,
    description:
      "A nourishing moisturizer that helps keep dry skin hydrated.",
    stock: 50,
  },

  {
    name: "Ceramide Barrier Cream",
    category: "Moisturizers",
    skinTypes: [
      "Sensitive Skin",
      "Dry Skin",
    ],
    price: 679,
    originalPrice: 849,
    image: "/images/ceramide-barrier-cream.jpg",
    rating: 4.6,
    reviews: 0,
    description:
      "A rich ceramide cream designed to support the skin barrier.",
    stock: 50,
  },

  {
    name: "Aqua Gel Moisturizer",
    category: "Moisturizers",
    skinTypes: [
      "Oily Skin",
      "Combination Skin",
    ],
    price: 579,
    originalPrice: 749,
    image: "/images/aqua-gel-moisturizer.jpg",
    rating: 4.5,
    reviews: 0,
    description:
      "A lightweight gel moisturizer for fresh and hydrated skin.",
    stock: 50,
  },


  // =========================================
  // SUNSCREENS
  // =========================================

  {
    name: "Daily Shield SPF 50",
    category: "Sunscreens",
    skinTypes: [
      "All Skin Types",
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 699,
    originalPrice: 899,
    image: "/images/sunscreen.jpg",
    rating: 4.6,
    reviews: 0,
    description:
      "A daily SPF 50 sunscreen for everyday sun protection.",
    stock: 50,
  },

  {
    name: "Invisible SPF 50",
    category: "Sunscreens",
    skinTypes: [
      "Oily Skin",
      "Combination Skin",
    ],
    price: 749,
    originalPrice: 949,
    image: "/images/invisible-spf-50.jpg",
    rating: 4.7,
    reviews: 0,
    description:
      "A lightweight invisible sunscreen suitable for daily use.",
    stock: 50,
  },


  // =========================================
  // FACE MASKS
  // =========================================

  {
    name: "Clay Detox Mask",
    category: "Face Masks",
    skinTypes: [
      "Oily Skin",
      "Combination Skin",
    ],
    price: 549,
    originalPrice: 699,
    image: "/images/clay-detox-mask.jpg",
    rating: 4.4,
    reviews: 0,
    description:
      "A clay mask that helps remove excess oil and impurities.",
    stock: 50,
  },

  {
    name: "Overnight Hydration Mask",
    category: "Face Masks",
    skinTypes: [
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 629,
    originalPrice: 799,
    image: "/images/overnight-hydration-mask.jpg",
    rating: 4.6,
    reviews: 0,
    description:
      "An overnight mask designed to provide long-lasting hydration.",
    stock: 50,
  },


  // =========================================
  // EYE CARE
  // =========================================

  {
    name: "Caffeine Eye Gel",
    category: "Eye Care",
    skinTypes: [
      "All Skin Types",
    ],
    price: 599,
    originalPrice: 749,
    image: "/images/caffeine-eye-gel.jpg",
    rating: 4.5,
    reviews: 0,
    description:
      "A refreshing caffeine eye gel for the delicate eye area.",
    stock: 50,
  },


  // =========================================
  // LIP CARE
  // =========================================

  {
    name: "Berry Lip Mask",
    category: "Lip Care",
    skinTypes: [
      "All Skin Types",
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 399,
    originalPrice: 499,
    image: "/images/berry-lip-mask.jpg",
    rating: 4.4,
    reviews: 0,
    description:
      "A nourishing berry lip mask for soft and hydrated lips.",
    stock: 50,
  },

];


// =========================================
// SEED DATABASE
// =========================================

const seedProducts = async () => {

  try {

    await connectDB();

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log(
      `${products.length} products inserted successfully`
    );

    await mongoose.connection.close();

    process.exit(0);

  } catch (error) {

    console.error(
      "Product Seed Error:",
      error.message
    );

    await mongoose.connection.close();

    process.exit(1);

  }

};


seedProducts();