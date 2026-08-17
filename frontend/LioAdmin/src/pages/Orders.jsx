import { Plus, RefreshCw } from "lucide-react";
import { useState } from "react";

import Button from "../components/Button";
import OrderCard from "../components/Cards/OrderCard";
import OrderDetailsModal from "../components/Cards/OrderDetailsModal";
import OrderForm from "../forms/OrderForm";

import confirmToast from "../utils/confirmToast";
import { estadoColor, formatHora, resumenItems } from "../utils/pedidoFormat";

import useFetchPedidos from "../hooks/Orders/useFetchPedidos";
import usePedidosActions from "../hooks/Orders/usePedidosActions";
import useFetchClientes from "../hooks/Customers/useFetchClientes";
import useFetchProductos from "../hooks/Products/useFetchProductos";
import useAuth from "../hooks/useAuth";

const Orders = () => {
  const { pedidos, getPedidos, loading } = useFetchPedidos();

  const { createPedido, updatePedido, deletePedido } = usePedidosActions();

  const { clientes } = useFetchClientes();
  const { productos } = useFetchProductos();
  const { user } = useAuth();

  const vendedorAsignado = [user?.name, user?.lastName]
    .filter(Boolean)
    .join(" ");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPedido, setEditingPedido] = useState(null);
  const [detailsPedido, setDetailsPedido] = useState(null);

  // Pedidos ordenados del más reciente al más antiguo.
  const sortedPedidos = [...pedidos].sort(
    (a, b) => new Date(b.fecha_pedido) - new Date(a.fecha_pedido),
  );

  const ultimoPedido = sortedPedidos[0] ?? null;

  const openCreateForm = () => {
    setEditingPedido(null);
    setIsModalOpen(true);
  };

  const openUpdateForm = (pedido) => {
    setEditingPedido(pedido);
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setEditingPedido(null);
    setIsModalOpen(false);
  };

  const handleSavePedido = async (data) => {
    const result = editingPedido
      ? await updatePedido(editingPedido._id, data)
      : await createPedido(data);

    if (result.ok) {
      await getPedidos();
      closeForm();
    }
  };

  const handleDelete = async (pedido) => {
    const confirmed = await confirmToast(
      `¿Eliminar el pedido de "${pedido.cliente || "cliente sin nombre"}"?`,
    );

    if (!confirmed) return;

    const result = await deletePedido(pedido._id);

    if (result.ok) {
      await getPedidos();
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-white text-lg">Cargando Pedidos...</p>
      </div>
    );
  }

  return (
    <div>
      <OrderForm
        id="order-form"
        isOpen={isModalOpen}
        onClose={closeForm}
        onSubmit={handleSavePedido}
        initialData={editingPedido}
        clientes={clientes}
        productos={productos}
        vendedorAsignado={vendedorAsignado}
      />

      <OrderDetailsModal
        id="order-details"
        pedido={detailsPedido}
        onClose={() => setDetailsPedido(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="mb-12 mt-6 text-3xl font-semibold text-white">Pedidos</h1>

        <Button text="Nuevo Pedido" icon={Plus} onClick={openCreateForm} />
      </div>

      {/* Último pedido */}
      <div className="mb-10">
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={getPedidos}
            className="flex items-center gap-2 rounded-full bg-sky-400/80 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Actualizar
          </button>
        </div>

        {ultimoPedido ? (
          <div className="flex items-center gap-6 rounded-2xl bg-gradient-to-r from-[#1B022C] to-[#3D2F80] p-6 shadow-xl">
            <p className="text-white font-semibold shrink-0">Último pedido:</p>

            <div className="flex flex-1 flex-wrap items-center justify-between gap-4 text-sm text-white">
              <div className="space-y-1">
                <p>
                  <span className="text-white/70">Producto: </span>
                  {resumenItems(ultimoPedido.items)}
                </p>

                <p>
                  <span className="text-white/70">Cliente: </span>
                  {ultimoPedido.cliente || "Sin cliente"}
                </p>

                <p>
                  <span className="text-white/70">Hora de pedido: </span>
                  {formatHora(ultimoPedido.fecha_pedido)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${estadoColor(
                    ultimoPedido.estado_pedido,
                  )}`}
                >
                  Estado: {ultimoPedido.estado_pedido || "Pendiente"}
                </span>

                <button
                  type="button"
                  onClick={() => setDetailsPedido(ultimoPedido)}
                  className="rounded-full bg-sky-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-sky-600 transition"
                >
                  Detalles
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-gradient-to-r from-[#1B022C] to-[#3D2F80] p-6 text-center text-white/70">
            Aún no hay pedidos registrados.
          </div>
        )}
      </div>

      {/* Grid de pedidos */}
      <div className="rounded-3xl bg-gradient-to-b from-[#2A1F5E]/60 to-[#3D2F80]/60 p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {sortedPedidos.length > 0 ? (
            sortedPedidos.map((pedido) => (
              <OrderCard
                key={pedido._id}
                pedido={pedido}
                onUpdate={() => openUpdateForm(pedido)}
                onDetails={() => setDetailsPedido(pedido)}
                onDelete={() => handleDelete(pedido)}
              />
            ))
          ) : (
            <div className="col-span-full">
              <p className="text-center text-white text-lg">
                No existen pedidos registrados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
