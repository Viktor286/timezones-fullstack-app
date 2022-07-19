import express from 'express';
import userController from './../controllers/userController.js';
import authController from './../controllers/authController.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/logout', authController.logout);

router.route('/').get(userController.getAllUsers).post(userController.createUser);

router
  .route('/:email')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
