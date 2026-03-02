//  Applies cross-cutting request validation and authorization checks.

module.exports = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());
  const normalizedUserRole = req.user.role.toLowerCase();

  if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
    return res.status(403).json({ message: "Forbidden: insufficient role" });
  }

  next();
};
