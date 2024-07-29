import { Router } from "express";
import { registerUser, login, logout } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route('/login').post(login);
router.route('/register').post(upload.single('avatar'),registerUser);
router.route('/logout').post(verifyJWT, logout);

export {router}