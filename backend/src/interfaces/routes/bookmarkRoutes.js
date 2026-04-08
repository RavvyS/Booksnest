//  Defines HTTP routes and middleware chain for this module.

const router = require("express").Router();

const BookmarkController = require("../controllers/bookmarkController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const RoleMiddleware = require("../middleware/RoleMiddleware");


router.get("/", AuthMiddleware, BookmarkController.getBookmarks);



router.post(
    "/",
    AuthMiddleware,
    RoleMiddleware("reader"),
    BookmarkController.createBookmark
);

router.put(
    "/:id",
    AuthMiddleware,
    RoleMiddleware("reader"),
    BookmarkController.updateBookmark
);

router.delete(
    "/:id",
    AuthMiddleware,
    RoleMiddleware("reader"),
    BookmarkController.deleteBookmark
);


module.exports = router;
