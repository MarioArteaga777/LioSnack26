import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import apiUrl from "../../utils/apiUrl";
import { toast } from "sonner";
import useNavigate, { data } from "react-router-dom";

API_URL = `${apiUrl}/users`;

const useDataUser = () => {
  const [userData, setUserData] = useState([]);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const getUsers = async () => {
    try {
      const response = await fetch(`${API_URL}`);
      if (!response.ok) {
        toast.error("Failed to fetch users");
        throw new Error("Failed to fetch user");
      }
      const data = await response.json();
      setUserData(userData);
    } catch (error) {
      console.log("Error fetching users: " + error);
      toast.error("Error fetching users");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUserById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}}`);
      if (!response.ok) {
        toast.error("Failed to fetch specific user " + error);
        throw new Error("Failed to fetch specific user");
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.log("Error fetching: " + error);
      toast.error("Error fetching");
    }
  };

  const saveUser = async (dataForm) => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForm),
      });
      if (!response.ok) {
        toast.error("Failed to save user, check the fields to avoid erros.");
        throw new Error("Failed to save user");
      }
      toast.success("User saved successfully");
      console.log(response);
    } catch (error) {
      console.log("Error al enviar el usuario: " + error);
    } finally {
      reset();
      getUsers();
    }
  };

  const updateUser = async (dataForm) => {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForm),
      });
      if (!response.ok) {
        toast.error("Failed to updated a user, unexpected error");
        throw new Error("Failed to updated user");
      }
    } catch (error) {
      console.log("Error updating user " + error);
      toast.error("Failed to update user");
    } finally {
      reset();
      getUsers();
    }
  };

  const handleUserAction = (dataForm) => {
    if (id) {
      updateUser(dataForm);
    } else {
      saveUser(dataForm);
    }
  };

  const handleUpdateUser = () => {
    navigate(`/users/${id}`);
  };

  const loadUser = async () => {
    if (id) {
      const user = await getUserById(id);
      if (user) {
        reset({
          nombre: user?.name,
          apellido: user?.lastName,
          correo: user?.email,
          Verificado: user?.isVerified,
        });
      }
    }
  };

  const deleteUser = async () => {
    try {
      const response = await fetch(`${apiUrl}/${id}`);
    } catch (error) {}
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  return {
    userData,
    setUserData,
    saveUser,
    updateUser,
    deleteUser,
    handleUpdateUser,
    handleSubmit: handleSubmit(handleUserAction),
    getUserById,
    register,
    errors
  };
};

export default useDataUser;
