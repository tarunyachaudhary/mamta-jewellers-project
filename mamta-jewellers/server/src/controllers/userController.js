import User from "../models/User.js";

// @route GET /api/users/profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};

// @route PUT /api/users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name ?? user.name;
    user.phone = req.body.phone ?? user.phone;
    if (req.body.address) user.address = req.body.address;
    if (req.body.password) user.password = req.body.password;

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      phone: updated.phone,
      address: updated.address,
    });
  } catch (err) {
    next(err);
  }
};
