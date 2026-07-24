import url from "../../utils/apiUrl";
import { toast } from "sonner";

const useUsuariosActions = () => {
    // Registra un nuevo usuario (usa el endpoint de registro)
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

    // Actualiza los datos de un usuario existente.
    // Acepta un objeto plano (JSON) o un FormData (cuando incluye la foto de perfil).
    const updateUsuario = async (id, data) => {
        try {
            const isFormData = data instanceof FormData;

            const response = await fetch(`${url}/usuarios/${id}`, {
                method: "PUT",
                headers: isFormData ? undefined : { "Content-Type": "application/json" },
                body: isFormData ? data : JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message || "Error al actualizar usuario");
                return { ok: false };
            }

            const result = await response.json();
            toast.success("Usuario actualizado exitosamente");
            return { ok: true, user: result.user };
        } catch (error) {
            console.log(error);
            toast.error("Error al actualizar el usuario");
            return { ok: false };
        }
    };

    // Elimina un usuario por su ID
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
