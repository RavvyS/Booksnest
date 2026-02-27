const RoleMiddleware = require("../../src/interfaces/middleware/RoleMiddleware");

describe("RoleMiddleware", () => {
  test("returns 401 when user is missing", () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    RoleMiddleware("reader")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 403 when role is not allowed", () => {
    const req = { user: { role: "author" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    RoleMiddleware("reader")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Forbidden: insufficient role",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("allows request when user role is in allowed list", () => {
    const req = { user: { role: "reader" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    RoleMiddleware("reader", "librarian")(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
