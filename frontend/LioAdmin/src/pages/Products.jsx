import { Plus } from "lucide-react";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";

const products = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    name: "Snack liofilizado de Manzana",
    stock: 0,
    price: 2.50,
}));

const Products = () => {
    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-20">
                <h1 className="mb-12 mt-6 text-2xl md:text-3xl font-semibold text-white">Productos</h1>

                <Button
                    text="Nuevo Producto"
                    icon={Plus}
                    onClick={() => console.log("abrir modal")}
                />
            </div>
            <div className="flex justify-center">
                {/* Grid de productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-4 ">
                    {products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Products;