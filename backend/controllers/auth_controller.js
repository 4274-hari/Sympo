const { loginUser } = require("../services/auth_service");

const login = async (req, res, next) => {
  try {
    const { email, dob } = req.body;

    if (!email || !dob) {
      return res.status(400).json({ message: "Email and DOB required" });
    }

    const user = await loginUser(email, dob);

    req.session.user = {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email
    };

    res.json({
      message: "Login successful",
      user: req.session.user
    });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
};

module.exports = {
  login,
  logout
};
