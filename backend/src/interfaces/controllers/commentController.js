const CommentRepositoryImpl = require("../../infrastructure/repositories/CommentRepositoryImpl");
const CreateComment = require("../../application/usecases/comment/createComment");
const GetComments = require("../../application/usecases/comment/getComments");
const UpdateComment = require("../../application/usecases/comment/updateComment");
const DeleteComment = require("../../application/usecases/comment/deleteComment");

const repository = new CommentRepositoryImpl();
const createUseCase = new CreateComment(repository);
const getUseCase = new GetComments(repository);
const updateUseCase = new UpdateComment(repository);
const deleteUseCase = new DeleteComment(repository);

exports.createComment = async (req, res) => {

  try {
    const result = await createUseCase.execute({
      content: req.body.content,
      userId: req.user.id,
      materialId: req.body.materialId,
    });

    res.status(201).json(result);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }

};

exports.getComments = async (req, res) => {
  try {
    const result = await getUseCase.execute({
      materialId: req.query.materialId,
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const result = await updateUseCase.execute({
      commentId: req.params.commentId,
      content: req.body.content,
      user: req.user,
    });

    res.json(result);
  } catch (error) {
    const status = error.message === "Comment not found" ? 404 : 403;
    res.status(status).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await deleteUseCase.execute({
      commentId: req.params.commentId,
      user: req.user,
    });

    res.status(204).send();
  } catch (error) {
    const status = error.message === "Comment not found" ? 404 : 403;
    res.status(status).json({ message: error.message });
  }
};
