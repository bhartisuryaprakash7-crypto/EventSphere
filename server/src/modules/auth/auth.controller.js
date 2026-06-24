const jwt    = require("jsonwebtoken");
const crypto = require("crypto");
const User   = require("../users/user.model");

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

// ✅ Register
const register = async (req, res) => {
  try {
    console.log("Register Body:", req.body);

    // ✅ rollNo aur department bhi lo
    const { name, email, password, role, department, rollNo } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
      rollNo,   // ✅ save karo
    });

    res.status(201).json({
      message: "Registered successfully",
      token: generateToken(user._id, user.role),
      user: {
        id:         user._id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        department: user.department,
        rollNo:     user.rollNo,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ✅ Login - role check added
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body; // ✅ role bhi lo

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is deactivated",
      });
    }

    // ✅ Role mismatch check
    if (role && user.role !== role) {
      return res.status(403).json({
        message: `Access denied. You are registered as '${user.role}', not '${role}'.`,
      });
    }

    res.status(200).json({
      token: generateToken(user._id, user.role),
      user: {
        id:         user._id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        department: user.department,
        rollNo:     user.rollNo,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Current User
const getMe = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    res.status(200).json({
      message: "Password reset token generated",
      resetToken,
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    user.password             = req.body.password;
    user.resetPasswordToken   = undefined;
    user.resetPasswordExpire  = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
};