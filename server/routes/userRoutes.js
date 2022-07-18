import express from 'express';
import userController from './../controllers/userController.js';
import authController from './../controllers/authController.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .post(userController.createUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
