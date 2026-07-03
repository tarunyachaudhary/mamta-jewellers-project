import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

dotenv.config();

const products = [
  {
    name: "Solitaire Diamond Ring",
    category: "Rings",
    material: "Gold & Diamond",
    price: 45000,
    description: "A timeless solitaire ring set in 18k gold, cut for maximum brilliance.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800",
    stock: 8,
    featured: true,
  },
  {
    name: "Kundan Bridal Necklace",
    category: "Necklaces",
    material: "22k Gold",
    price: 125000,
    description: "Hand-crafted kundan necklace with traditional Varanasi artistry.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800",
    stock: 4,
    featured: true,
  },
  {
    name: "Gold Bangle Set (Pair)",
    category: "Bangles",
    material: "22k Gold",
    price: 68000,
    description: "A classic pair of engraved gold bangles for everyday elegance.",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800",
    stock: 6,
    featured: true,
  },
  {
    name: "Pearl Drop Earrings",
    category: "Earrings",
    material: "Gold & Pearl",
    price: 18500,
    description: "Freshwater pearl drop earrings finished with a delicate gold hook.",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800",
    stock: 12,
    featured: false,
  },
  {
    name: "Emerald Cocktail Ring",
    category: "Rings",
    material: "Gold & Emerald",
    price: 52000,
    description: "A bold statement ring centred on a natural-cut emerald.",
    image: "https://images.unsplash.com/photo-1603561596112-0a132b757442?q=80&w=800",
    stock: 5,
    featured: false,
  },
  {
    name: "Temple Jewellery Choker",
    category: "Necklaces",
    material: "22k Gold",
    price: 98000,
    description: "South Indian temple-style choker with intricate goddess motifs.",
    image: "https://images.unsplash.com/photo-1620656798579-1284503a1dcd?q=80&w=800",
    stock: 3,
    featured: false,
  },
  {
    name: "Rose Gold Tennis Bracelet",
    category: "Bracelets",
    material: "Rose Gold & Cubic Zirconia",
    price: 32000,
    description: "A sleek line of stones set in rose gold, perfect for daily wear.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800",
    stock: 10,
    featured: false,
  },
  {
    name: "Jhumka Earrings",
    category: "Earrings",
    material: "22k Gold",
    price: 24500,
    description: "Traditional bell-shaped jhumkas with fine filigree work.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800",
    stock: 9,
    featured: false,
  },
];

const run = async () => {
  await connectDB();

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);

  const adminEmail = process.env.ADMIN_EMAIL || "admin@mamtajewellers.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: "Store Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log(`Created admin account: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin account already exists, skipping");
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
