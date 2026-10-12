import { PackageCheck, Plus } from "lucide-react";
import { toast } from "sonner";
import ProductCard from "../components/Cards/ProductCard";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import ProductForm from "../forms/ProductForm";
import confirmToast from "../utils/confirmToast";
import useFetchProductos from "../hooks/Products/useFetchProductos";
import useProductosActions from "../hooks/Products/useProductosActions";
import ProductDetailsModal from "../components/ProductDetailsModal";
import Pagination from "../components/Pagination";
import usePagination from "../hooks/usePagination";
import { useGlobalSearch } from "../context/SearchContext";
import filterItems from "../utils/filterItems";
import EmptyState from "../components/EmptyState";
const Products = () => {
  const { productos, setProductos, getProductos, loading } =
    useFetchProductos();
  const { createProducto, updateProducto, deleteProducto } =
    useProductosActions();
  const { query } = useGlobalSearch();
  const filteredProducts = filterItems(productos, query, (product) => [
    product.Nombre,
    product.SKU,
    product.Precio,
  ]);
  const { currentPage, setCurrentPage, totalPages, pageItems } = usePagination(filteredProducts, 10, query);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailsProduct, setDetailsProduct] = useState(null);

  // Abre el formulario en modo creación
  const openCreateForm = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Abre el formulario precargado con el producto a editar
  const openUpdateForm = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Cierra el formulario y limpia el producto en edición
  const closeForm = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (data) => {
    // Al crear un producto, la imagen es obligatoria
    if (!editingProduct && !data.image) {
      toast.error("Por favor selecciona una imagen");
      return;
    }

    const formData = new FormData();
    formData.append("Nombre", data.name);
    formData.append("SKU", data.sku);
    formData.append("Precio", data.price);

    // Al editar, la imagen es opcional
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

  // Pide confirmación y elimina el producto seleccionado
  const handleDelete = async (product) => {
    const confirmed = await confirmToast(
      `¿Eliminar "${product.Nombre}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmed) return;

    const result = await deleteProducto(product._id);
    if (result.ok) {
      await getProductos();
    }
  };

  // Mientras se obtienen los productos, se muestra un mensaje de carga
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

        <Button text="Nuevo Producto" icon={Plus} onClick={openCreateForm} />
      </div>

      {/* Listado de productos en formato grilla */}
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] justify-items-center gap-7">
        {filteredProducts.length > 0 ? (
          pageItems.map((product) => (
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
        ) : productos.length > 0 ? (
          <p className="text-white">
            No hay productos que coincidan con la búsqueda.
          </p>
        ) : (
          <EmptyState
            icon={PackageCheck}
            title="Aún no hay productos registrados"
            description="Agrega un producto para comenzar a administrar el catálogo desde aquí."
            actionLabel="Registrar producto"
            onAction={openCreateForm}
          />
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Products;
