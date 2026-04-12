//  Handles HTTP request/response mapping and delegates business logic to use cases.

const path = require("path");
const fs = require("fs");

const BookRepositoryImpl = require("../../infrastructure/repositories/BookRepositoryImpl");
const BorrowRepositoryImpl = require("../../infrastructure/repositories/BorrowRepositoryImpl");
const CreateBook = require("../../application/usecases/book/createBook");
const GetBooks = require("../../application/usecases/book/getBooks");
const UpdateBook = require("../../application/usecases/book/updateBook");
const DeleteBook = require("../../application/usecases/book/deleteBook");
const ReadBook = require("../../application/usecases/book/ReadBook");
const ApproveBook = require("../../application/usecases/book/ApproveBook");
const bookSearchService = require("../../infrastructure/services/BookSearchService");

const bookRepository = new BookRepositoryImpl();
const borrowRepository = new BorrowRepositoryImpl();
const createUseCase = new CreateBook(bookRepository);
const getUseCase = new GetBooks(bookRepository);
const updateUseCase = new UpdateBook(bookRepository);
const deleteUseCase = new DeleteBook(bookRepository);
const readUseCase = new ReadBook(borrowRepository, bookRepository);
const approveUseCase = new ApproveBook(bookRepository);

exports.createBook = async (req, res) => {
  try {
    const result = await createUseCase.execute({
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      type: req.body.type || "book",
      status: req.user.role === "librarian" ? "approved" : "pending",
      uploadedBy: req.user.id,
      categoryId: req.body.categoryId,
      description: req.body.description,
      totalCopies: Number(req.body.totalCopies),
      filePath: req.file ? req.file.path : null,
      coverImage: req.body.coverImage || null,
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
    const result = await updateUseCase.execute(
      req.params.bookId,
      {
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        categoryId: req.body.categoryId,
        description: req.body.description,
        totalCopies: req.body.totalCopies !== undefined ? Number(req.body.totalCopies) : undefined,
        availableCopies: req.body.availableCopies !== undefined ? Number(req.body.availableCopies) : undefined,
      },
      req.user.id,
      req.user.role,
    );

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const result = await deleteUseCase.execute(
      req.params.bookId,
      req.user.id,
      req.user.role,
    );
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
      req.user.role
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

exports.getMyBooks = async (req, res) => {
  try {
    const result = await getUseCase.executeByUploader(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPendingBooks = async (req, res) => {
  try {
    const result = await getUseCase.executePending();
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.approveBook = async (req, res) => {
  try {
    const result = await approveUseCase.execute({
      id: req.params.bookId,
      status: req.body.status,
    });
    res.json(result);
  } catch (error) {
    const status = error.message === "Book not found" ? 404 : 400;
    res.status(status).json({ message: error.message });
  }
};

exports.searchExternal = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const results = await bookSearchService.search(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "External search failed", error: error.message });
  }
};

exports.getFreeExternalBooks = async (req, res) => {
  try {
    const { subject } = req.query;
    const results = await bookSearchService.searchFreeBooks(subject || "fiction");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch free books", error: error.message });
  }
};
