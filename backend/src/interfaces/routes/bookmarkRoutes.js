const router = require("express").Router();

const BookmarkController = require("../controllers/bookmarkController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const RoleMiddleware = require("../middleware/RoleMiddleware");


router.get("/", BookmarkController.getBookmarks);  //-----------



router.post(
    "/",
    AuthMiddleware,
    RoleMiddleware("reader", "author", "librarian"),
    BookmarkController.createBookmark
);

router.put(
    "/:id",
    AuthMiddleware,
    RoleMiddleware("reader", "author", "librarian"),
    BookmarkController.updateBookmark
);

router.delete(
    "/:id",
    AuthMiddleware,
    RoleMiddleware("reader", "author", "librarian"),
    BookmarkController.deleteBookmark
);


module.exports = router;