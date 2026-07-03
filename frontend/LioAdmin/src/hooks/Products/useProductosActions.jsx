import url from "../../utils/apiUrl";
import { toast } from "sonner";

const useProductosActions = () => {
    // Crea un nuevo producto (usa FormData porque incluye la imagen)
    const createProducto = async (formData) => {
        try {
            const response = await fetch(`${url}/productos`, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message || "Error al crear producto");
                return { ok: false };
            }

            toast.success("Producto creado exitosamente");
            return { ok: true };
        } catch (error) {
            console.log(error);
            toast.error("Error al crear el producto");
            return { ok: false };
        }
    };

    // Actualiza un producto existente, con o sin nueva imagen
    const updateProducto = async (id, formData) => {
        try {
            const response = await fetch(`${url}/productos/${id}`, {
                method: "PUT",
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message || "Error al actualizar producto");
                return { ok: false };
            }

            toast.success("Producto actualizado exitosamente");
            return { ok: true };
        } catch (error) {
            console.log(error);
            toast.error("Error al actualizar el producto");
            return { ok: false };
        }
    };

    // Elimina un producto por su ID
    const deleteProducto = async (id) => {
        try {
            const response = await fetch(`${url}/productos/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message || "Error al eliminar producto");
                return { ok: false };
            }

            toast.success("Producto eliminado exitosamente");
            return { ok: true };
        } catch (error) {
            console.log(error);
            toast.error("Error al eliminar el producto");
            return { ok: false };
        }
    };

    return {
        createProducto,
        updateProducto,
        deleteProducto
    };
};

export default useProductosActions;
