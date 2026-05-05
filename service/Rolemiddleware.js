
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: false, message: "Unauthorized – please log in" });
    }
    const actorRole = req.userType === "Admin" ? "admin" : (req.user.isAdmin ? "admin" : req.user.role);

    if (!allowedRoles.includes(actorRole)) {
      return res.status(403).json({
        status: false,
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      });
    }

    next();
  };
};

module.exports = { requireRole };