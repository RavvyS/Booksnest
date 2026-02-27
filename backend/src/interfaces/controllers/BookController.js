const path = require("path");
const fs = require("fs");

const BookRepositoryImpl = require("../../infrastructure/repositories/BookRepositoryImpl");
const BorrowRepositoryImpl = require("../../infrastructure/repositories/BorrowRepositoryImpl");
const CreateBook = require("../../application/usecases/book/createBook");
const GetBooks = require("../../application/usecases/book/getBooks");
const UpdateBook = require("../../application/usecases/book/updateBook");
const DeleteBook = require("../../application/usecases/book/deleteBook");
const ReadBook = require("../../application/usecases/book/ReadBook");

const bookRepository = new BookRepositoryImpl();
const borrowRepository = new BorrowRepositoryImpl();
const createUseCase = new CreateBook(bookRepository);
const getUseCase = new GetBooks(bookRepository);
const updateUseCase = new UpdateBook(bookRepository);
const deleteUseCase = new DeleteBook(bookRepository);
const readUseCase = new ReadBook(borrowRepository, bookRepository);

exports.createBook = async (req, res) => {
  try {
    const result = await createUseCase.execute({
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      categoryId: req.body.categoryId,
      description: req.body.description,
      totalCopies: Number(req.body.totalCopies),
      filePath: req.file ? req.file.path : null,
    });

    res.status(201).json(result);
  } catch (error) {
    // Clean up uploaded file if book creation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const result = await getUseCase.execute();
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const result = await getUseCase.executeById(req.params.bookId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const result = await updateUseCase.execute(req.params.bookId, {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      categoryId: req.body.categoryId,
      description: req.body.description,
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const result = await deleteUseCase.execute(req.params.bookId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Secure read endpoint.
 * Validates borrow permission (returned=false + dueDate > now)
 * then streams the PDF file directly. No static URL exposed.
 */
exports.readBook = async (req, res) => {
  try {
    const { filePath } = await readUseCase.execute(
      req.user.id,
      req.params.bookId,
    );

    // Verify file exists on disk
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Book file not found on server" });
    }

    // Stream the file — never expose the URL
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="book-${req.params.bookId}.pdf"`,
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    const status = error.message.includes("Access denied") ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
};
