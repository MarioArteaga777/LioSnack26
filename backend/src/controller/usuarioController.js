import bcryptjs from "bcryptjs";
import userModel from "../models/users.js";

const userController = {};

userController.getUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

userController.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error al eliminar usuario: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

userController.updateUser = async (req, res) => {
  try {
    let {
      name,
      lastName,
      email,
      password,
      isVerified,
      loginAttempts,
      timeOut,
    } = req.body;

    name = name?.trim();
    lastName = lastName?.trim();
    email = email?.trim().toLowerCase();

    if (name && (name.length < 3 || name.length > 15)) {
      return res.status(400).json({ message: "Nombre inválido (debe tener entre 3 y 15 caracteres)" });
    }

    const updateData = {
      name,
      lastName,
      email,
      isVerified,
      loginAttempts,
      timeOut,
    };

    if (password && password.trim() !== "") {
      updateData.password = await bcryptjs.hash(password, 10);
    }

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ message: "Usuario actualizado con éxito", user: updatedUser });
  } catch (error) {
    console.error("Error al actualizar usuario: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default userController;