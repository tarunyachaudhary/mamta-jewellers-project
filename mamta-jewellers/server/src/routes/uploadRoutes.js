import express from "express";
import multer from "multer";
import imagekit from "../config/imagekit.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const result = await imagekit.upload({
            file: req.file.buffer.toString("base64"),
            fileName: req.file.originalname,
            folder: "/mamta-jewellers-products",
        });
        res.json({ url: result.url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed" });
    }
});

export default router;