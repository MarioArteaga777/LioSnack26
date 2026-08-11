import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { UserRound, Pencil, LogOut, Camera, X } from "lucide-react";

import Button from "../components/Button";
import useAuth from "../hooks/useAuth";
import useUsuariosActions from "../hooks/Users/useUsuariosActions";

// Perfil del usuario logueado: solo Nombre y Apellido son editables,
// Correo y Rol se muestran de solo lectura. La foto se sube/elimina
// haciendo click sobre el avatar.
const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { updateUsuario } = useUsuariosActions();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");

  const startEditing = () => {
    setName(user?.name ?? "");
    setLastName(user?.lastName ?? "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedLastName = lastName.trim();

    if (trimmedName.length < 3 || trimmedName.length > 15) {
      toast.error("El nombre debe tener entre 3 y 15 caracteres");
      return;
    }

    if (!trimmedLastName) {
      toast.error("El apellido es requerido");
      return;
    }

    setSaving(true);
    const result = await updateUsuario(user.id, {
      name: trimmedName,
      lastName: trimmedLastName,
    });
    setSaving(false);

    if (result.ok) {
      updateUser({ name: trimmedName, lastName: trimmedLastName });
      setIsEditing(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleAvatarClick = () => {
    if (uploadingImage) return;
    fileInputRef.current?.click();
  };

  // Sube (o reemplaza) la foto de perfil apenas se elige un archivo
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo más tarde

    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    const result = await updateUsuario(user.id, formData);
    setUploadingImage(false);

    if (result.ok) {
      updateUser({ image: result.user?.image ?? null });
      toast.success("Foto de perfil actualizada");
    }
  };

  const handleRemoveImage = async (e) => {
    e.stopPropagation();

    if (uploadingImage) return;

    const formData = new FormData();
    formData.append("removeImage", "true");

    setUploadingImage(true);
    const result = await updateUsuario(user.id, formData);
    setUploadingImage(false);

    if (result.ok) {
      updateUser({ image: null });
      toast.success("Foto de perfil eliminada");
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-8 items-center justify-center">
      <h1 className="mb-8 mt-6 text-2xl md:text-3xl font-semibold text-white">
        Mi Perfil
      </h1>

      <div className="rounded-3xl bg-gradient-to-r from-[#1B022C] to-[#3D2F80] p-8 shadow-xl">
        <div className="flex justify-evenly align-items gap-8 sm:flex-row sm:items-start">
          {/* Avatar: click para subir/cambiar foto, botón "x" para eliminarla */}
          <div className="relative shrink-0 ">
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploadingImage}
              aria-label="Cambiar foto de perfil"
              className="group relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-full bg-white/10 disabled:cursor-wait"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt="Foto de perfil"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-16 w-16 text-white/70" />
              )}

              <div
                className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity ${
                  uploadingImage
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <Camera className="h-8 w-8 text-white" />
              </div>
            </button>

            {user.image && !uploadingImage && (
              <button
                type="button"
                onClick={handleRemoveImage}
                aria-label="Eliminar foto de perfil"
                className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white transition hover:bg-rose-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Datos del usuario */}
          <div className="flex w-full max-w-xl flex-col gap-3">
            {isEditing ? (
              <form onSubmit={handleSave} className="flex flex-col gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre"
                  autoFocus
                  className="w-full rounded-full bg-white/10 px-4 py-2 text-sm text-white outline-none placeholder:text-white/50"
                />

                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Apellido"
                  className="w-full rounded-full bg-white/10 px-4 py-2 text-sm text-white outline-none placeholder:text-white/50"
                />

                {/* Solo lectura: no se pueden editar */}
                <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white/60">
                  Correo: {user.email}
                </span>

                <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white/60">
                  Rol: Administrador
                </span>

                <div className="mt-4 flex gap-3">
                  <Button
                    type="submit"
                    text={saving ? "Guardando..." : "Guardar"}
                    size="md"
                    disabled={saving}
                  />

                  <Button
                    type="button"
                    text="Cancelar"
                    variant="secondary"
                    size="md"
                    onClick={cancelEditing}
                    disabled={saving}
                  />
                </div>
              </form>
            ) : (
              <>
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white w-full">
                  Nombre: {user.name}
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                  Apellido: {user.lastName}
                </span>

                {/* Solo lectura: no se pueden editar */}
                <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white/60">
                  Correo: {user.email}
                </span>

                <span className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white/60">
                  Rol: Administrador
                </span>

                <div className="mt-4 flex gap-3">
                  <Button
                    type="button"
                    text="Editar"
                    icon={Pencil}
                    size="md"
                    onClick={startEditing}
                  />

                  <Button
                    type="button"
                    text="Cerrar Sesión"
                    icon={LogOut}
                    variant="secondary"
                    size="md"
                    onClick={handleLogout}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
