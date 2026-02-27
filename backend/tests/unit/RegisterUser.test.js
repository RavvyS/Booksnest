const RegisterUser = require("../../src/application/usecases/auth/RegisterUser");

describe("RegisterUser use case", () => {
  test("throws when required fields are missing", async () => {
    const userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    const hashService = { hash: jest.fn() };

    const useCase = new RegisterUser(userRepository, hashService);

    await expect(useCase.execute({ email: "a@b.com" })).rejects.toThrow(
      "Name, email and password are required",
    );
  });

  test("throws when user already exists", async () => {
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue({ id: "u1" }),
      create: jest.fn(),
    };
    const hashService = { hash: jest.fn() };

    const useCase = new RegisterUser(userRepository, hashService);

    await expect(
      useCase.execute({
        name: "Test",
        email: "a@b.com",
        password: "secret123",
      }),
    ).rejects.toThrow("User already exists");
  });

  test("creates user with hashed password and valid role", async () => {
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(async (payload) => ({
        _id: "u123",
        ...payload,
      })),
    };
    const hashService = {
      hash: jest.fn().mockResolvedValue("hashed-password"),
    };

    const useCase = new RegisterUser(userRepository, hashService);

    const result = await useCase.execute({
      name: "Alice",
      email: "alice@example.com",
      password: "secret123",
      role: "author",
    });

    expect(hashService.hash).toHaveBeenCalledWith("secret123");
    expect(userRepository.create).toHaveBeenCalledWith({
      name: "Alice",
      email: "alice@example.com",
      password: "hashed-password",
      role: "author",
    });
    expect(result.email).toBe("alice@example.com");
  });

  test("rejects invalid role selection", async () => {
    const userRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
    };
    const hashService = {
      hash: jest.fn().mockResolvedValue("hashed-password"),
    };

    const useCase = new RegisterUser(userRepository, hashService);

    await expect(
      useCase.execute({
        name: "Bob",
        email: "bob@example.com",
        password: "secret123",
        role: "admin",
      }),
    ).rejects.toThrow("Invalid role selection");
  });
});
