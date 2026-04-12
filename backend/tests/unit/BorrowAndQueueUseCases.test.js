const mongoose = require("mongoose");

const BorrowBook = require("../../src/application/usecases/borrow/BorrowBook");
const ReturnBook = require("../../src/application/usecases/borrow/ReturnBook");
const GetBorrowHistory = require("../../src/application/usecases/borrow/GetBorrowHistory");
const CreateQueueRequest = require("../../src/application/usecases/queue/CreateQueueRequest");
const UpdateQueueRequest = require("../../src/application/usecases/queue/UpdateQueueRequest");
const CancelQueueRequest = require("../../src/application/usecases/queue/CancelQueueRequest");
const GetMyQueueRequests = require("../../src/application/usecases/queue/GetMyQueueRequests");

const createFakeSession = () => ({
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
});

describe("Borrow and queue use cases", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("BorrowBook", () => {
    test("throws when userId is missing", async () => {
      const borrowRepo = {};
      const bookRepo = {};
      const useCase = new BorrowBook(borrowRepo, bookRepo);

      await expect(useCase.execute("", "book1")).rejects.toThrow(
        "User ID is required",
      );
    });

    test("throws when bookId is missing", async () => {
      const borrowRepo = {};
      const bookRepo = {};
      const useCase = new BorrowBook(borrowRepo, bookRepo);

      await expect(useCase.execute("user1", "")).rejects.toThrow(
        "Book ID is required",
      );
    });

    test("throws when user already has active borrow", async () => {
      const session = createFakeSession();
      jest.spyOn(mongoose, "startSession").mockResolvedValue(session);

      const borrowRepo = {
        findActiveBorrow: jest.fn().mockResolvedValue({ id: "b1" }),
      };
      const bookRepo = {
        atomicDecrementStock: jest.fn(),
      };
      const useCase = new BorrowBook(borrowRepo, bookRepo);

      await expect(useCase.execute("user1", "book1")).rejects.toThrow(
        "You already have an active borrow for this book",
      );

      expect(borrowRepo.findActiveBorrow).toHaveBeenCalledWith("user1", "book1");
      expect(bookRepo.atomicDecrementStock).not.toHaveBeenCalled();
      expect(session.abortTransaction).toHaveBeenCalledTimes(1);
      expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    test("throws when no copies are available", async () => {
      const session = createFakeSession();
      jest.spyOn(mongoose, "startSession").mockResolvedValue(session);

      const borrowRepo = {
        findActiveBorrow: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
      };
      const bookRepo = {
        atomicDecrementStock: jest.fn().mockResolvedValue(null),
      };
      const useCase = new BorrowBook(borrowRepo, bookRepo);

      await expect(useCase.execute("user1", "book1")).rejects.toThrow(
        "No copies available for this book",
      );

      expect(borrowRepo.findActiveBorrow).toHaveBeenCalledWith("user1", "book1");
      expect(bookRepo.atomicDecrementStock).toHaveBeenCalled();
      expect(session.abortTransaction).toHaveBeenCalledTimes(1);
      expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    test("creates borrow when happy path succeeds", async () => {
      const session = createFakeSession();
      jest.spyOn(mongoose, "startSession").mockResolvedValue(session);

      const borrow = { id: "b1", userId: "user1", bookId: "book1" };
      const borrowRepo = {
        findActiveBorrow: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(borrow),
      };
      const bookRepo = {
        atomicDecrementStock: jest.fn().mockResolvedValue({ id: "book1" }),
      };
      const useCase = new BorrowBook(borrowRepo, bookRepo);

      const result = await useCase.execute("user1", "book1");

      expect(borrowRepo.findActiveBorrow).toHaveBeenCalledWith("user1", "book1");
      expect(bookRepo.atomicDecrementStock).toHaveBeenCalled();
      expect(borrowRepo.create).toHaveBeenCalled();
      expect(session.commitTransaction).toHaveBeenCalledTimes(1);
      expect(session.endSession).toHaveBeenCalledTimes(1);
      expect(result).toBe(borrow);
    });
  });

  describe("ReturnBook", () => {
    test("throws when userId is missing", async () => {
      const useCase = new ReturnBook({}, {}, {});

      await expect(useCase.execute("", "book1")).rejects.toThrow(
        "User ID is required",
      );
    });

    test("throws when bookId is missing", async () => {
      const useCase = new ReturnBook({}, {}, {});

      await expect(useCase.execute("user1", "")).rejects.toThrow(
        "Book ID is required",
      );
    });

    test("throws when no active borrow is found", async () => {
      const session = createFakeSession();
      jest.spyOn(mongoose, "startSession").mockResolvedValue(session);

      const borrowRepo = {
        findActiveBorrow: jest.fn().mockResolvedValue(null),
        markReturned: jest.fn(),
      };
      const bookRepo = {
        atomicIncrementStock: jest.fn(),
      };
      const queueRepo = {};
      const useCase = new ReturnBook(borrowRepo, bookRepo, queueRepo);

      await expect(useCase.execute("user1", "book1")).rejects.toThrow(
        "No active borrow found for this book",
      );

      expect(borrowRepo.findActiveBorrow).toHaveBeenCalledWith("user1", "book1");
      expect(borrowRepo.markReturned).not.toHaveBeenCalled();
      expect(bookRepo.atomicIncrementStock).not.toHaveBeenCalled();
      expect(session.abortTransaction).toHaveBeenCalledTimes(1);
      expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    test("throws when borrow record cannot be updated", async () => {
      const session = createFakeSession();
      jest.spyOn(mongoose, "startSession").mockResolvedValue(session);

      const activeBorrow = { id: "b1" };
      const borrowRepo = {
        findActiveBorrow: jest.fn().mockResolvedValue(activeBorrow),
        markReturned: jest.fn().mockResolvedValue(null),
      };
      const bookRepo = {
        atomicIncrementStock: jest.fn(),
      };
      const queueRepo = {};
      const useCase = new ReturnBook(borrowRepo, bookRepo, queueRepo);

      await expect(useCase.execute("user1", "book1")).rejects.toThrow(
        "Failed to update borrow record",
      );

      expect(borrowRepo.markReturned).toHaveBeenCalledWith("b1", session);
      expect(bookRepo.atomicIncrementStock).not.toHaveBeenCalled();
      expect(session.abortTransaction).toHaveBeenCalledTimes(1);
      expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    test("throws when book stock cannot be incremented", async () => {
      const session = createFakeSession();
      jest.spyOn(mongoose, "startSession").mockResolvedValue(session);

      const activeBorrow = { id: "b1" };
      const updatedBorrow = { id: "b1", returned: true };
      const borrowRepo = {
        findActiveBorrow: jest.fn().mockResolvedValue(activeBorrow),
        markReturned: jest.fn().mockResolvedValue(updatedBorrow),
      };
      const bookRepo = {
        atomicIncrementStock: jest.fn().mockResolvedValue(null),
      };
      const queueRepo = {
        claimNextPending: jest.fn().mockResolvedValue(null),
      };
      const useCase = new ReturnBook(borrowRepo, bookRepo, queueRepo);

      await useCase.execute("user1", "book1");

      expect(bookRepo.atomicIncrementStock).toHaveBeenCalledWith("book1", session);
      expect(session.commitTransaction).toHaveBeenCalledTimes(1); 
      expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    test("returns success payload when happy path succeeds", async () => {
      const session = createFakeSession();
      jest.spyOn(mongoose, "startSession").mockResolvedValue(session);

      const activeBorrow = { id: "b1" };
      const updatedBorrow = { id: "b1", returned: true };
      const autoAssigned = { queueRequestId: "q1" };

      const borrowRepo = {
        findActiveBorrow: jest.fn().mockResolvedValue(activeBorrow),
        markReturned: jest.fn().mockResolvedValue(updatedBorrow),
      };
      const bookRepo = {
        atomicIncrementStock: jest.fn().mockResolvedValue({ id: "book1" }),
      };
      const queueRepo = {};
      const useCase = new ReturnBook(borrowRepo, bookRepo, queueRepo);
      jest
        .spyOn(useCase, "assignNextQueuedBorrow")
        .mockResolvedValue(autoAssigned);

      const result = await useCase.execute("user1", "book1");

      expect(borrowRepo.findActiveBorrow).toHaveBeenCalledWith("user1", "book1");
      expect(borrowRepo.markReturned).toHaveBeenCalledWith("b1", session);
      expect(bookRepo.atomicIncrementStock).toHaveBeenCalledWith("book1", session);
      expect(useCase.assignNextQueuedBorrow).toHaveBeenCalledWith(
        "book1",
        session,
      );
      expect(session.commitTransaction).toHaveBeenCalledTimes(1);
      expect(session.endSession).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        message: "Book returned successfully",
        borrow: updatedBorrow,
        autoAssigned,
      });
    });
  });

  describe("GetBorrowHistory", () => {
    test("throws when userId is missing", async () => {
      const repo = { findByUser: jest.fn() };
      const useCase = new GetBorrowHistory(repo);

      await expect(useCase.execute("")).rejects.toThrow("User ID is required");
      expect(repo.findByUser).not.toHaveBeenCalled();
    });

    test("returns borrow history for user", async () => {
      const borrows = [{ id: "b1" }, { id: "b2" }];
      const repo = {
        findByUser: jest.fn().mockResolvedValue(borrows),
      };
      const useCase = new GetBorrowHistory(repo);

      const result = await useCase.execute("user1");

      expect(repo.findByUser).toHaveBeenCalledWith("user1");
      expect(result).toBe(borrows);
    });
  });

  describe("CreateQueueRequest", () => {
    test("throws when userId is missing", async () => {
      const useCase = new CreateQueueRequest({}, {}, {});

      await expect(useCase.execute("", "book1")).rejects.toThrow(
        "User ID is required",
      );
    });

    test("throws when bookId is missing", async () => {
      const useCase = new CreateQueueRequest({}, {}, {});

      await expect(useCase.execute("user1", "")).rejects.toThrow(
        "Book ID is required",
      );
    });

    test("throws when book is not found", async () => {
      const bookRepo = {
        findById: jest.fn().mockResolvedValue(null),
      };
      const useCase = new CreateQueueRequest({}, bookRepo, {});

      await expect(useCase.execute("user1", "book1")).rejects.toThrow(
        "Book not found",
      );
      expect(bookRepo.findById).toHaveBeenCalledWith("book1");
    });

    test("throws when copies are available", async () => {
      const bookRepo = {
        findById: jest.fn().mockResolvedValue({
          id: "book1",
          availableCopies: 2,
        }),
      };
      const useCase = new CreateQueueRequest({}, bookRepo, {});

      await expect(useCase.execute("user1", "book1")).rejects.toThrow(
        "Copies are available. Please borrow the book directly",
      );
    });

    test("throws when user already has active borrow", async () => {
      const bookRepo = {
        findById: jest.fn().mockResolvedValue({
          id: "book1",
          availableCopies: 0,
        }),
      };
      const borrowRepo = {
        findActiveBorrow: jest.fn().mockResolvedValue({ id: "b1" }),
      };
      const useCase = new CreateQueueRequest({}, bookRepo, borrowRepo);

      await expect(useCase.execute("user1", "book1")).rejects.toThrow(
        "You already have an active borrow for this book",
      );
      expect(borrowRepo.findActiveBorrow).toHaveBeenCalledWith("user1", "book1");
    });

    test("throws when user already has active queue request", async () => {
      const bookRepo = {
        findById: jest.fn().mockResolvedValue({
          id: "book1",
          availableCopies: 0,
        }),
      };
      const borrowRepo = {
        findActiveBorrow: jest.fn().mockResolvedValue(null),
      };
      const queueRepo = {
        findActiveRequestByUserAndBook: jest
          .fn()
          .mockResolvedValue({ id: "q1" }),
        getUserPosition: jest.fn().mockResolvedValue({ position: 1, totalWaiting: 5 }),
        create: jest.fn(),
      };
      const useCase = new CreateQueueRequest(queueRepo, bookRepo, borrowRepo);

      const result = await useCase.execute("user1", "book1");

      expect(result.alreadyQueued).toBe(true);
      expect(result.queueRequestId).toBe("q1");
      expect(queueRepo.findActiveRequestByUserAndBook).toHaveBeenCalledWith(
        "user1",
        "book1",
      );
      expect(queueRepo.create).not.toHaveBeenCalled();
    });

    test("creates queue request when happy path succeeds", async () => {
      const bookRepo = {
        findById: jest.fn().mockResolvedValue({
          id: "book1",
          availableCopies: 0,
        }),
      };
      const borrowRepo = {
        findActiveBorrow: jest.fn().mockResolvedValue(null),
      };
      const queueRequest = { id: "q1", userId: "user1", bookId: "book1" };
      const queueRepo = {
        findActiveRequestByUserAndBook: jest.fn().mockResolvedValue(null),
        getUserPosition: jest.fn().mockResolvedValue({ position: 1, totalWaiting: 1 }),
        create: jest.fn().mockResolvedValue(queueRequest),
      };
      const useCase = new CreateQueueRequest(queueRepo, bookRepo, borrowRepo);

      const result = await useCase.execute("user1", "book1", {
        note: "please notify me",
      });

      expect(result).toEqual(expect.objectContaining({
        id: "q1",
        userId: "user1",
        bookId: "book1",
        alreadyQueued: false,
        position: 1
      }));
    });
  });

  describe("UpdateQueueRequest", () => {
    test("throws when userId is missing", async () => {
      const useCase = new UpdateQueueRequest({});

      await expect(
        useCase.execute("", "req1", { note: "n" }),
      ).rejects.toThrow("User ID is required");
    });

    test("throws when requestId is missing", async () => {
      const useCase = new UpdateQueueRequest({});

      await expect(
        useCase.execute("user1", "", { note: "n" }),
      ).rejects.toThrow("Queue request ID is required");
    });

    test("updates queue request when data is valid", async () => {
      const updated = { id: "q1", note: "updated" };
      const queueRepo = {
        updatePendingByIdAndUser: jest.fn().mockResolvedValue(updated),
      };
      const useCase = new UpdateQueueRequest(queueRepo);

      const result = await useCase.execute("user1", "q1", { note: "updated" });

      expect(queueRepo.updatePendingByIdAndUser).toHaveBeenCalledWith(
        "q1",
        "user1",
        { note: "updated" },
      );
      expect(result).toBe(updated);
    });
  });

  describe("CancelQueueRequest", () => {
    test("throws when userId is missing", async () => {
      const useCase = new CancelQueueRequest({});

      await expect(useCase.execute("", "req1")).rejects.toThrow(
        "User ID is required",
      );
    });

    test("throws when requestId is missing", async () => {
      const useCase = new CancelQueueRequest({});

      await expect(useCase.execute("user1", "")).rejects.toThrow(
        "Queue request ID is required",
      );
    });

    test("cancels queue request when input is valid", async () => {
      const cancelled = { id: "q1", status: "cancelled" };
      const queueRepo = {
        cancelPendingByIdAndUser: jest.fn().mockResolvedValue(cancelled),
      };
      const useCase = new CancelQueueRequest(queueRepo);

      const result = await useCase.execute("user1", "q1");

      expect(queueRepo.cancelPendingByIdAndUser).toHaveBeenCalledWith(
        "q1",
        "user1",
      );
      expect(result).toBe(cancelled);
    });
  });

  describe("GetMyQueueRequests", () => {
    test("throws when userId is missing", async () => {
      const useCase = new GetMyQueueRequests({});

      await expect(useCase.execute("")).rejects.toThrow("User ID is required");
    });

    test("returns queue requests for user", async () => {
      const requests = [{ id: "q1" }, { id: "q2" }];
      const queueRepo = {
        findByUser: jest.fn().mockResolvedValue(requests),
      };
      const useCase = new GetMyQueueRequests(queueRepo);

      const result = await useCase.execute("user1");

      expect(queueRepo.findByUser).toHaveBeenCalledWith("user1");
      expect(result).toBe(requests);
    });
  });
});

