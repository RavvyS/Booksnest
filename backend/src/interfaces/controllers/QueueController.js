//  Handles HTTP request/response mapping for Queue functionality.

const BookRepositoryImpl = require("../../infrastructure/repositories/BookRepositoryImpl");
const BorrowRepositoryImpl = require("../../infrastructure/repositories/BorrowRepositoryImpl");
const QueueRepositoryImpl = require("../../infrastructure/repositories/QueueRepositoryImpl");

const CreateQueueRequest = require("../../application/usecases/queue/CreateQueueRequest");
const UpdateQueueRequest = require("../../application/usecases/queue/UpdateQueueRequest");
const CancelQueueRequest = require("../../application/usecases/queue/CancelQueueRequest");
const GetMyQueueRequests = require("../../application/usecases/queue/GetMyQueueRequests");

const bookRepository = new BookRepositoryImpl();
const borrowRepository = new BorrowRepositoryImpl();
const queueRepository = new QueueRepositoryImpl();

const createQueueUseCase = new CreateQueueRequest(
  queueRepository,
  bookRepository,
  borrowRepository,
);
const updateQueueUseCase = new UpdateQueueRequest(queueRepository);
const cancelQueueUseCase = new CancelQueueRequest(queueRepository);
const getQueueUseCase = new GetMyQueueRequests(queueRepository);

const ensureReaderForQueue = (req, res) => {
  if (req.user?.role !== "reader") {
    res.status(403).json({
      message: "Queue operations are allowed for readers only",
    });
    return false;
  }

  return true;
};

exports.createQueueRequest = async (req, res) => {
  try {
    if (!ensureReaderForQueue(req, res)) return;

    const result = await createQueueUseCase.execute(req.user.id, req.params.bookId, {
      note: req.body.note,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateQueueRequest = async (req, res) => {
  try {
    if (!ensureReaderForQueue(req, res)) return;

    const result = await updateQueueUseCase.execute(
      req.user.id,
      req.params.requestId,
      {
        note: req.body.note,
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
    if (!ensureReaderForQueue(req, res)) return;

    const result = await cancelQueueUseCase.execute(req.user.id, req.params.requestId);
    if (!result) {
      return res.status(404).json({
        message: "Pending queue request not found for this user",
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
    if (!ensureReaderForQueue(req, res)) return;

    const result = await getQueueUseCase.execute(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
