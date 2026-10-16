import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/user.js";

const userController = {};

// Devuelve todas las cuentas de usuarios sin exponer la contraseña
userController.getUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Crea un usuario desde el panel administrativo. El rol se elige entre
// "admin" (acceso a LioAdmin) y "cliente" (cuenta de la tienda en línea).
// La cuenta nace verificada porque ya fue validada por un administrador.
userController.createUser = async (req, res) => {
  try {
    let { name, lastName, email, password, role } = req.body;

    name = name?.trim();
    lastName = lastName?.trim();
    email = email?.trim().toLowerCase();

    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ message: "Nombre, apellido, correo y contraseña son requeridos" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    if (!["cliente", "admin"].includes(role)) {
      return res.status(400).json({ message: "El rol debe ser 'cliente' o 'admin'" });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser?.isVerified) {
      return res.status(400).json({ message: "El correo ya está en uso" });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    let savedUser;

    if (existingUser) {
      // Reutiliza un registro pendiente (sin verificar) con el mismo correo.
      existingUser.name = name;
      existingUser.lastName = lastName;
      existingUser.password = passwordHash;
      existingUser.role = role;
      existingUser.isVerified = true;
      existingUser.verificationCode = null;
      existingUser.verificationCodeExpires = null;
      if (req.file) {
        existingUser.image = req.file.path;
        existingUser.public_id = req.file.filename;
      }
      savedUser = await existingUser.save();
    } else {
      const newUser = new userModel({
        name,
        lastName,
        email,
        password: passwordHash,
        role,
        isVerified: true,
        image: req.file?.path || null,
        public_id: req.file?.filename || null,
      });
      savedUser = await newUser.save();
    }

    const { password: _password, ...safeUser } = savedUser.toObject();

    return res.status(201).json({ message: "Usuario creado exitosamente", user: safeUser });
  } catch (error) {
    console.error("Error creating user: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Elimina un usuario por su ID
userController.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (deletedUser.public_id) {
      await cloudinary.uploader.destroy(deletedUser.public_id);
    }

    return res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error deleting user: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Actualiza los datos de un usuario; la contraseña solo se rehashea si fue enviada.
// La foto de perfil se sube/reemplaza en Cloudinary si llega un archivo, o se
// elimina si el cliente manda removeImage=true sin archivo nuevo.
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
      removeImage,
    } = req.body;

    name = name?.trim();
    lastName = lastName?.trim();
    email = email?.trim().toLowerCase();

    if (name && (name.length < 3 || name.length > 15)) {
      return res.status(400).json({ message: "Nombre inválido (debe tener entre 3 y 15 caracteres)" });
    }

    const userFound = await userModel.findById(req.params.id);

    if (!userFound) {
      return res.status(404).json({ message: "Usuario no encontrado" });
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

    if (req.file) {
      if (userFound.public_id) {
        await cloudinary.uploader.destroy(userFound.public_id);
      }
      updateData.image = req.file.path;
      updateData.public_id = req.file.filename;
    } else if (removeImage === "true" || removeImage === true) {
      if (userFound.public_id) {
        await cloudinary.uploader.destroy(userFound.public_id);
      }
      updateData.image = null;
      updateData.public_id = null;
    }

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({ message: "Usuario actualizado con éxito", user: updatedUser });
  } catch (error) {
    console.error("Error updating user: " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default userController;