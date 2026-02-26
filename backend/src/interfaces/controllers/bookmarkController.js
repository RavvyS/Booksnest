const BookmarkRepositoryImpl = require("../../infrastructure/repositories/BookmarkRepositoryImpl");
const CreateBookmark = require("../../application/usecases/CreateBookmark");
const DeleteBookmark = require("../../application/usecases/DeleteBookmark");
const GetBookmarks = require("../../application/usecases/GetBookmarks");
const UpdateBookmark = require("../../application/usecases/UpdateBookmark");

const repository = new BookmarkRepositoryImpl();
const createUseCase = new CreateBookmark(repository);
const deleteUseCase = new DeleteBookmark(repository);
const getUseCase = new GetBookmarks(repository);
const updateUseCase = new UpdateBookmark(repository);


// Create a new bookmark
exports.createBookmark = async (req, res) => {
    try {
        const result = await createUseCase.execute({
            userId: req.user.id,
            materialId: req.body.materialId,
            materialTitle: req.body.materialTitle,
            materialContentUrl: req.body.materialContentUrl,
            note: req.body.note
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a bookmark by ID------------------------------------------------
exports.GetBookmarks = async (req,res) =>{
    try{
        const result = await getUseCase.execute({
            userId: req.query.userId,
        });
        res.json(result);
    } catch(error){
        res.status(400).json({ error: error.message });
    }
};


// update a bookmark by ID
exports.UpdateBookmark = async (req,res) =>{
    try{
        const result = await updateUseCase.execute({
            id: req.params.id,
            note: req.body.note
        });
        res.json(result);
    } catch(error){
        const status = error.message === "Material not found" ? 404 : 400;
        res.status(status).json({ message: error.message });
    }
};

// Delete a bookmark by ID
exports.deleteBookmark = async (req, res) => {
    try {
        const result = await deleteUseCase.execute({    
            id: req.params.id,
            userId: req.user.userId//-----------------------------------------
        });
        res.status(204).send();
    } catch (error) {
        const status = error.message === "Bookmark not found" ? 404 : 400;
        res.status(status).json({ message: error.message });
    }   
};



