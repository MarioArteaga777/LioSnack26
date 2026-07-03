import url from "../../utils/apiUrl";
import { toast } from "sonner";

const useUsuariosActions = () => {
    const createUsuario = async (data) => {
        try {
            const response = await fetch(`${url}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message || "Error al crear usuario");
                return { ok: false };
            }

            toast.success("Usuario creado exitosamente");
            return { ok: true };
        } catch (error) {
            console.log(error);
            toast.error("Error al crear el usuario");
            return { ok: false };
        }
    };

    const updateUsuario = async (id, data) => {
        try {
            const response = await fetch(`${url}/usuarios/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message || "Error al actualizar usuario");
                return { ok: false };
            }

            toast.success("Usuario actualizado exitosamente");
            return { ok: true };
        } catch (error) {
            console.log(error);
            toast.error("Error al actualizar el usuario");
            return { ok: false };
        }
    };

    const deleteUsuario = async (id) => {
        try {
            const response = await fetch(`${url}/usuarios/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message || "Error al eliminar usuario");
                return { ok: false };
            }

            toast.success("Usuario eliminado exitosamente");
            return { ok: true };
        } catch (error) {
            console.log(error);
            toast.error("Error al eliminar el usuario");
            return { ok: false };
        }
    };

    return {
        createUsuario,
        updateUsuario,
        deleteUsuario
    };
};

export default useUsuariosActions;
