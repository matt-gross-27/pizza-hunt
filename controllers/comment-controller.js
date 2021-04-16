const { Comment, Pizza } = require('../models');

const commentController = {
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } },
          { new: true }
        );
      })
      .then(data => {
        if (!data) {
          res.status(404).json({ message: 'No pizza found with this id.' })
          return;
        }
        res.json(data);
      })
      .catch(err => res.json(err));
  },

  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then(data => {
        if (!data) {
          return res.status(404).json({ message: 'No comment found with this id.' })
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then(data => {
        if (!data) {
          res.status(404).json({ message: 'No pizza found with this id.' })
          return;
        }
        res.json(data);
      })
      .catch(err => res.json(err));
  },

  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true, runValidators: true }
    )
    .then(data => {
      if (!data) {
        res.status(404).json({ message: 'No pizza found with this id.' })
        return;
      }
      res.json(data);
    })
    .catch(err => res.json(err));
  },

  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then(data => res.json(data))
      .catch(err => res.json(err));
  }
};

module.exports = commentController;
