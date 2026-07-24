import express from "express";
import userController from "../controller/usuarioController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = express.Router();

router.route("/")
    .get(userController.getUsers);

router.route("/:id")
    .put(upload.single("image"), userController.updateUser)
    .delete(userController.deleteUser);

export default router;