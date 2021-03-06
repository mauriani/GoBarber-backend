import { Router } from 'express';

import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';
import uploadConfig from '@config/upload';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig.multer);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  usersController.create,
);

// vamos criar um rota para alterar um único usuário, por isso estamos utilizando o patch
usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar') /** nome do campo que vai conter essa imagem */,
  userAvatarController.update,
);
export default usersRouter;
