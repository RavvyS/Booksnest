//  Covers isolated unit behavior for a single module.

const LoginUser = require("../../src/application/usecases/auth/LoginUser");

describe("LoginUser use case", () => {
  test("throws when user does not exist", async () => {
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
    };
    const hashService = { compare: jest.fn() };
    const tokenService = { generate: jest.fn() };

    const useCase = new LoginUser(userRepository, hashService, tokenService);

    await expect(
      useCase.execute({
        email: "missing@example.com",
        password: "secret123",
      }),
    ).rejects.toThrow("User not found");
  });

  test("throws when password is invalid", async () => {
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue({
        _id: "u1",
        email: "user@example.com",
        password: "hashed-password",
        role: "reader",
      }),
    };
    const hashService = { compare: jest.fn().mockResolvedValue(false) };
    const tokenService = { generate: jest.fn() };

    const useCase = new LoginUser(userRepository, hashService, tokenService);

    await expect(
      useCase.execute({
        email: "user@example.com",
        password: "wrong-password",
      }),
    ).rejects.toThrow("Invalid password");
  });

  test("returns user and token on successful login", async () => {
    const user = {
      _id: "u2",
      email: "valid@example.com",
      password: "hashed-password",
      role: "reader",
    };
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue(user),
    };
    const hashService = { compare: jest.fn().mockResolvedValue(true) };
    const tokenService = { generate: jest.fn().mockReturnValue("jwt-token") };

    const useCase = new LoginUser(userRepository, hashService, tokenService);
    const result = await useCase.execute({
      email: "valid@example.com",
      password: "secret123",
    });

    expect(hashService.compare).toHaveBeenCalledWith("secret123", "hashed-password");
    expect(tokenService.generate).toHaveBeenCalledWith(user);
    expect(result).toEqual({
      user,
      token: "jwt-token",
    });
  });
});
