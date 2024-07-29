import { Router } from "express";
import { registerUser, login } from "../controllers/user.controller.js";

const router = Router();

router.route('/login').post(login);
router.route('/register').post(registerUser);

export {router}