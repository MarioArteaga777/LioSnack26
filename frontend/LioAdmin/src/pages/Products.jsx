import { Plus } from "lucide-react";
import { toast } from "sonner";
import ProductCard from "../components/Cards/ProductCard";
import ProductDetailsModal from "../components/Cards/ProductDetailsModal";
import Button from "../components/Button";
import { useState } from "react";
import ProductForm from "../forms/ProductForm";
import confirmToast from "../utils/confirmToast";

const initialProducts = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  name: "Snack liofilizado de Manzana",
  stock: 0,
  price: 2.5,
}));

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
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

  const handleSaveProduct = (data) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data } : p))
      );
      toast.success("Producto actualizado");
    } else {
      setProducts((prev) => [...prev, { id: crypto.randomUUID(), ...data }]);
      toast.success("Producto creado");
    }
  };

  const handleDelete = async (product) => {
    const confirmed = await confirmToast(
      `¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
    toast.success("Producto eliminado");
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-4 ">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onUpdate={() => openUpdateForm(product)}
              onDetails={() => setDetailsProduct(product)}
              onDelete={() => handleDelete(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
