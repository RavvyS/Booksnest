//  Handles HTTP request/response mapping and delegates business logic to use cases.

const BookRepositoryImpl = require("../../infrastructure/repositories/BookRepositoryImpl");
const BorrowRepositoryImpl = require("../../infrastructure/repositories/BorrowRepositoryImpl");
const QueueRepositoryImpl = require("../../infrastructure/repositories/QueueRepositoryImpl");
const BorrowBook = require("../../application/usecases/borrow/BorrowBook");
const ReturnBook = require("../../application/usecases/borrow/ReturnBook");
const GetBorrowHistory = require("../../application/usecases/borrow/GetBorrowHistory");
const CreateQueueRequest = require("../../application/usecases/queue/CreateQueueRequest");
const UpdateQueueRequest = require("../../application/usecases/queue/UpdateQueueRequest");
const CancelQueueRequest = require("../../application/usecases/queue/CancelQueueRequest");
const GetMyQueueRequests = require("../../application/usecases/queue/GetMyQueueRequests");
const GetBookQueue = require("../../application/usecases/queue/GetBookQueue");
const LibrarianCancelQueue = require("../../application/usecases/queue/LibrarianCancelQueue");
const GetQueueStatus = require("../../application/usecases/queue/GetQueueStatus");

const bookRepository = new BookRepositoryImpl();
const borrowRepository = new BorrowRepositoryImpl();
const queueRepository = new QueueRepositoryImpl();

const borrowUseCase = new BorrowBook(borrowRepository, bookRepository);
const returnUseCase = new ReturnBook(
  borrowRepository,
  bookRepository,
  queueRepository,
);
const historyUseCase = new GetBorrowHistory(borrowRepository);
const createQueueUseCase = new CreateQueueRequest(
  queueRepository,
  bookRepository,
  borrowRepository,
);
const updateQueueUseCase = new UpdateQueueRequest(queueRepository);
const cancelQueueUseCase = new CancelQueueRequest(queueRepository);
const getQueueUseCase = new GetMyQueueRequests(queueRepository);
const getBookQueueUseCase = new GetBookQueue(queueRepository);
const adminCancelQueueUseCase = new LibrarianCancelQueue(queueRepository);
const getQueueStatusUseCase = new GetQueueStatus(queueRepository);

const ensureLibraryUserForQueue = (req, res) => {
  // Allow both readers and authors to use library waitlist features
  if (req.user?.role !== "reader" && req.user?.role !== "author") {
    res.status(403).json({
      message: "Queue operations are allowed for readers and authors only",
    });
    return false;
  }
  return true;
};

exports.borrowBook = async (req, res) => {
  try {
    const result = await borrowUseCase.execute(
      req.user.id,
      req.params.bookId,
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    // If a librarian provides a userId in the body, use that. Otherwise use the authenticated user's ID.
    const userId = req.body?.userId || req.user.id;
    
    const result = await returnUseCase.execute(
      userId,
      req.params.bookId,
    );

    res.json(result);
  } catch (error) {
    console.error(`[BorrowController] returnBook FAILED for user=${req.user?.id}, book=${req.params?.bookId}:`, error);
    res.status(400).json({ message: error.message });
  }
};

exports.getMyBorrows = async (req, res) => {
  try {
    // Check and return any expired books before fetching history
    await borrowRepository.returnExpiredBooks();
    
    const result = await historyUseCase.execute(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createQueueRequest = async (req, res) => {
  try {
    if (!ensureLibraryUserForQueue(req, res)) return;

    // Process expired borrows first so stock counts and active borrow flags are accurate
    await borrowRepository.returnExpiredBooks();

    // EXTREME SAFETY: Ensure req.body is an object to prevent 'reading note' error
    if (!req.body) req.body = {};
    const note = req.body.note || "";

    const result = await createQueueUseCase.execute(req.user.id, req.params.bookId, {
      note,
    });
    res.status(201).json(result);
  } catch (error) {
    console.error("[BorrowController] createQueueRequest FAILED:", error);
    res.status(400).json({ message: error.message, code: error.code || null });
  }
};

exports.updateQueueRequest = async (req, res) => {
  try {
    if (!ensureLibraryUserForQueue(req, res)) return;

    const result = await updateQueueUseCase.execute(
      req.user.id,
      req.params.requestId,
      {
        note: req.body?.note || "",
      },
    );

    if (!result) {
      return res.status(404).json({
        message: "Pending queue request not found for this user",
      });
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.cancelQueueRequest = async (req, res) => {
  try {
    if (!ensureLibraryUserForQueue(req, res)) return;

    const result = await cancelQueueUseCase.execute(req.user.id, req.params.requestId);
    if (!result) {
      // Check if it exists but is just not pending
      const existing = await queueRepository.findById(req.params.requestId);
      if (existing) {
        return res.status(400).json({
          message: `Cannot cancel a queue request that is already ${existing.status}`,
        });
      }
      return res.status(404).json({
        message: "Queue request not found",
      });
    }
    res.json({
      message: "Queue request cancelled",
      queueRequest: result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyQueueRequests = async (req, res) => {
  try {
    if (!ensureLibraryUserForQueue(req, res)) return;

    const result = await getQueueUseCase.execute(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBookQueue = async (req, res) => {
  try {
    let result = await getBookQueueUseCase.execute(req.params.bookId);
    
    // Privacy: Mask emails if the requester is a reader
    if (req.user?.role === "reader") {
      result = result.map(entry => ({
        ...entry,
        userEmail: entry.userEmail ? `${entry.userEmail.charAt(0)}***${entry.userEmail.split('@')[1]}` : entry.userEmail
      }));
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.librarianCancelQueue = async (req, res) => {
  try {
    const result = await adminCancelQueueUseCase.execute(req.params.requestId);
    if (!result) {
      return res.status(404).json({ message: "Queue request not found" });
    }
    res.json({ message: "Queue request removed by librarian", result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getQueueStatus = async (req, res) => {
  try {
    const result = await getQueueStatusUseCase.execute(req.user.id, req.params.bookId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
