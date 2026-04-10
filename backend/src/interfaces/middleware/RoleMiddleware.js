const RoleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (req.user && allowedRoles.includes(req.user.role)) {
    return next();
  }
  return res.status(403).json({ 
    message: `Access denied. Required role: ${allowedRoles.join(" or ")}` 
  });
};

RoleMiddleware.isLibrarian = (req, res, next) => {
  if (req.user && req.user.role === "librarian") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Librarian only." });
};

module.exports = RoleMiddleware;
