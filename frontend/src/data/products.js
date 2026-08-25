import cleanserImage from "../assets/images/cleanser.jpg";
import riceFoamCleanserImage from "../assets/images/rice-foam-cleanser.jpg";
import greenTeaCleanserImage from "../assets/images/green-tea-gel-cleanser.jpg";
import calmSkinCleanserImage from "../assets/images/calm-skin-cleanser.jpg";

import roseWaterTonerImage from "../assets/images/rose-water-toner.jpg";
import barrierBalanceTonerImage from "../assets/images/barrier-balance-toner.jpg";

import serumImage from "../assets/images/serum.jpg";
import niacinamideSerumImage from "../assets/images/niacinamide-balance-serum.jpg";
import hyaluronicSerumImage from "../assets/images/hyaluronic-glow-serum.jpg";

import moisturizerImage from "../assets/images/moisturizer.jpg";
import ceramideCreamImage from "../assets/images/ceramide-barrier-cream.jpg";
import aquaGelImage from "../assets/images/aqua-gel-moisturizer.jpg";

import sunscreenImage from "../assets/images/sunscreen.jpg";
import invisibleSunscreenImage from "../assets/images/invisible-spf-50.jpg";

import clayMaskImage from "../assets/images/clay-detox-mask.jpg";
import overnightMaskImage from "../assets/images/overnight-hydration-mask.jpg";

import caffeineEyeGelImage from "../assets/images/caffeine-eye-gel.jpg";
import berryLipMaskImage from "../assets/images/berry-lip-mask.jpg";


export const products = [

  // =========================================
  // CLEANSERS
  // =========================================

  {
    id: 1,
    name: "Gentle Daily Cleanser",
    category: "Cleansers",
    skinTypes: [
      "All Skin Types",
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 499,
    originalPrice: 649,
    image: cleanserImage,
    rating: 4.4,
  },

  {
    id: 2,
    name: "Rice Foam Cleanser",
    category: "Cleansers",
    skinTypes: [
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 549,
    originalPrice: 699,
    image: riceFoamCleanserImage,
    rating: 4.6,
  },

  {
    id: 3,
    name: "Green Tea Gel Cleanser",
    category: "Cleansers",
    skinTypes: [
      "Oily Skin",
      "Combination Skin",
    ],
    price: 529,
    originalPrice: 699,
    image: greenTeaCleanserImage,
    rating: 4.5,
  },

  {
    id: 4,
    name: "Calm Skin Cleanser",
    category: "Cleansers",
    skinTypes: [
      "Sensitive Skin",
      "Dry Skin",
    ],
    price: 579,
    originalPrice: 729,
    image: calmSkinCleanserImage,
    rating: 4.6,
  },


  // =========================================
  // TONERS
  // =========================================

  {
    id: 5,
    name: "Rose Water Toner",
    category: "Toners",
    skinTypes: [
      "All Skin Types",
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 449,
    originalPrice: 599,
    image: roseWaterTonerImage,
    rating: 4.3,
  },

  {
    id: 6,
    name: "Barrier Balance Toner",
    category: "Toners",
    skinTypes: [
      "Sensitive Skin",
      "Dry Skin",
    ],
    price: 579,
    originalPrice: 749,
    image: barrierBalanceTonerImage,
    rating: 4.6,
  },


  // =========================================
  // SERUMS
  // =========================================

  {
    id: 7,
    name: "Glow Vitamin C Serum",
    category: "Serums",
    skinTypes: [
      "Dull Skin",
      "All Skin Types",
    ],
    price: 699,
    originalPrice: 899,
    image: serumImage,
    rating: 4.5,
  },

  {
    id: 8,
    name: "Niacinamide Balance Serum",
    category: "Serums",
    skinTypes: [
      "Oily Skin",
      "Combination Skin",
    ],
    price: 649,
    originalPrice: 849,
    image: niacinamideSerumImage,
    rating: 4.7,
  },

  {
    id: 9,
    name: "Hyaluronic Glow Serum",
    category: "Serums",
    skinTypes: [
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 729,
    originalPrice: 949,
    image: hyaluronicSerumImage,
    rating: 4.8,
  },


  // =========================================
  // MOISTURIZERS
  // =========================================

  {
    id: 10,
    name: "Hydra Glow Moisturizer",
    category: "Moisturizers",
    skinTypes: [
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 599,
    originalPrice: 799,
    image: moisturizerImage,
    rating: 4.7,
  },

  {
    id: 11,
    name: "Ceramide Barrier Cream",
    category: "Moisturizers",
    skinTypes: [
      "Sensitive Skin",
      "Dry Skin",
    ],
    price: 679,
    originalPrice: 849,
    image: ceramideCreamImage,
    rating: 4.6,
  },

  {
    id: 12,
    name: "Aqua Gel Moisturizer",
    category: "Moisturizers",
    skinTypes: [
      "Oily Skin",
      "Combination Skin",
    ],
    price: 579,
    originalPrice: 749,
    image: aquaGelImage,
    rating: 4.5,
  },


  // =========================================
  // SUNSCREENS
  // =========================================

  {
    id: 13,
    name: "Daily Shield SPF 50",
    category: "Sunscreens",
    skinTypes: [
      "All Skin Types",
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 699,
    originalPrice: 899,
    image: sunscreenImage,
    rating: 4.6,
  },

  {
    id: 14,
    name: "Invisible SPF 50",
    category: "Sunscreens",
    skinTypes: [
      "Oily Skin",
      "Combination Skin",
    ],
    price: 749,
    originalPrice: 949,
    image: invisibleSunscreenImage,
    rating: 4.7,
  },


  // =========================================
  // FACE MASKS
  // =========================================

  {
    id: 15,
    name: "Clay Detox Mask",
    category: "Face Masks",
    skinTypes: [
      "Oily Skin",
      "Combination Skin",
    ],
    price: 549,
    originalPrice: 699,
    image: clayMaskImage,
    rating: 4.4,
  },

  {
    id: 16,
    name: "Overnight Hydration Mask",
    category: "Face Masks",
    skinTypes: [
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 629,
    originalPrice: 799,
    image: overnightMaskImage,
    rating: 4.6,
  },


  // =========================================
  // EYE CARE
  // =========================================

  {
    id: 17,
    name: "Caffeine Eye Gel",
    category: "Eye Care",
    skinTypes: [
      "All Skin Types",
    ],
    price: 599,
    originalPrice: 749,
    image: caffeineEyeGelImage,
    rating: 4.5,
  },


  // =========================================
  // LIP CARE
  // =========================================

  {
    id: 18,
    name: "Berry Lip Mask",
    category: "Lip Care",
    skinTypes: [
      "All Skin Types",
      "Dry Skin",
      "Sensitive Skin",
    ],
    price: 399,
    originalPrice: 499,
    image: berryLipMaskImage,
    rating: 4.4,
  },

];