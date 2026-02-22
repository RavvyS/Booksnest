const CommentRepositoryImpl = require("../../infrastructure/repositories/CommentRepositoryImpl");
const CreateComment = require("../../application/usecases/comment/createComment");

exports.createComment = async (req, res) => {

  try {

    const repository = new CommentRepositoryImpl();
    const useCase = new CreateComment(repository);

    const result = await useCase.execute({
      content: req.body.content,
      userId: req.user.id,
      materialId: req.body.materialId,
    });

    res.status(201).json(result);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }

};