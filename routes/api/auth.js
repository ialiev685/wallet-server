import express from 'express';
import { AuthController } from '../../controllers/index.js';
import { asyncWrapper } from '../../helpers/index.js';
import { vld, authMiddleware } from '../../middlewares/index.js';
import { joiUserSchema } from '../../models/User.js';

const router = express.Router();
const authValidation = vld(joiUserSchema);

router.post(
  '/signup',
  authValidation,
  asyncWrapper(AuthController.registrationCtrl),
);

router.post('/login', authValidation, asyncWrapper(AuthController.loginCtrl));

router.post('/logout', authMiddleware, asyncWrapper(AuthController.logoutCtrl));

router.get(
  '/current',
  authMiddleware,
  asyncWrapper(AuthController.findCurrentUserCtrl),
);

export default router;
