//  Handles HTTP request/response mapping for Borrowing functionality.

const BookRepositoryImpl = require("../../infrastructure/repositories/BookRepositoryImpl");
const BorrowRepositoryImpl = require("../../infrastructure/repositories/BorrowRepositoryImpl");
const QueueRepositoryImpl = require("../../infrastructure/repositories/QueueRepositoryImpl");
const BorrowBook = require("../../application/usecases/borrow/BorrowBook");
const ReturnBook = require("../../application/usecases/borrow/ReturnBook");
const GetBorrowHistory = require("../../application/usecases/borrow/GetBorrowHistory");

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
    const result = await returnUseCase.execute(
      req.user.id,
      req.params.bookId,
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyBorrows = async (req, res) => {
  try {
    const result = await historyUseCase.execute(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
