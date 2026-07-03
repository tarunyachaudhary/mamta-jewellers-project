import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Rings", "Necklaces", "Earrings", "Bracelets", "Bangles", "Other"],
    },
    material: { type: String, default: "Gold" },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    stock: { type: Number, default: 10, min: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
