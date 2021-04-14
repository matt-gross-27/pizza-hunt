const router = require('express').Router();
const { addComment, removeComment, getAllComment } = require('../../controllers/comment-controller');

router.route('/').get(getAllComment);

router.route('/:pizzaId').post(addComment);

router.route('/:pizzaId/:commentId').delete(removeComment);

module.exports = router;