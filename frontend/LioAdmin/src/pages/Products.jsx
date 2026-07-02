import { Plus } from "lucide-react";
import { toast } from "sonner";
import ProductCard from "../components/Cards/ProductCard";
import ProductDetailsModal from "../components/Cards/ProductDetailsModal";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import ProductForm from "../forms/ProductForm";
import confirmToast from "../utils/confirmToast";
import useFetchProductos from "../hooks/Products/useFetchProductos";
import useProductosActions from "../hooks/Products/useProductosActions";

const Products = () => {
  const { productos, setProductos, getProductos, loading } = useFetchProductos();
  const { createProducto, updateProducto, deleteProducto } = useProductosActions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailsProduct, setDetailsProduct] = useState(null);

  const openCreateForm = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openUpdateForm = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeForm = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (data) => {
    // Verificar que hay imagen al crear
    if (!editingProduct && !data.image) {
      toast.error("Por favor selecciona una imagen");
      return;
    }

    const formData = new FormData();
    formData.append("Nombre", data.name);
    formData.append("SKU", data.sku);
    formData.append("Precio", data.price);

    // Si hay imagen, se agrega
    if (data.image) {
      formData.append("Imagen", data.image);
    }

    if (editingProduct) {
      const result = await updateProducto(editingProduct._id, formData);
      if (result.ok) {
        await getProductos();
        closeForm();
      }
    } else {
      const result = await createProducto(formData);
      if (result.ok) {
        await getProductos();
        closeForm();
      }
    }
  };

  const handleDelete = async (product) => {
    const confirmed = await confirmToast(
      `¿Eliminar "${product.Nombre}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;
    
    const result = await deleteProducto(product._id);
    if (result.ok) {
      await getProductos();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div>
      <ProductForm
        id="my-dialog"
        isOpen={isModalOpen}
        onClose={closeForm}
        onSubmit={handleSaveProduct}
        initialData={editingProduct}
      />

      <ProductDetailsModal
        id="product-details"
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-20">
        <h1 className="mb-12 mt-6 text-2xl md:text-3xl font-semibold text-white">
          Productos
        </h1>

        <Button
          text="Nuevo Producto"
          icon={Plus}
          onClick={openCreateForm}
        />
      </div>

      <div className="flex justify-center">
        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-x-8 gap-y-6 ">
          {productos.length > 0 ? (
            productos.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.Nombre}
                price={product.Precio}
                image={product.Imagen}
                sku={product.SKU}
                onUpdate={() => openUpdateForm(product)}
                onDetails={() => setDetailsProduct(product)}
                onDelete={() => handleDelete(product)}
              />
            ))
          ) : (
            <p className="text-white">No hay productos disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
