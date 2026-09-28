import { X, Trash2, Minus, Plus, Info, PlusCircle } from "lucide-react";
import { useCart } from "../context/CartContext"; // Ajusta la ruta de tu context según corresponda
import useProducts from "../hooks/useProducts";

// Cuántos productos recomendados mostrar, estilo Daily Harvest.
const MAX_RECOMMENDED = 3;

export default function AddedToCartPopup({ onProductDetail }) {
  const { 
    popupOpen, 
    setPopupOpen, 
    lastAddedProduct, 
    cart, 
    cartCount, 
    setCartOpen,
    addToCart,
    increment, 
    decrement, 
    remove 
  } = useCart();

  // Traemos el catálogo real para sugerir otros productos (se pide una sola
  // vez; el hook cachea nada entre renders pero la lista es pequeña).
  const { products } = useProducts();

  if (!popupOpen) return null;

  // Buscamos el producto actual en el carrito para reflejar su cantidad en tiempo real
  const currentItem = cart.find((item) => item.id === lastAddedProduct?.id) || lastAddedProduct;

  // Recomendados = catálogo real, excluyendo el que se acaba de agregar.
  const recommended = products
    .filter((p) => p.id !== lastAddedProduct?.id)
    .slice(0, MAX_RECOMMENDED);

  // Lógica de la barra de progreso (ejemplo basado en 6 ítems mínimos)
  const MIN_ITEMS = 6;
  const remainingItems = Math.max(0, MIN_ITEMS - cartCount);
  const progressPercentage = Math.min(100, (cartCount / MIN_ITEMS) * 100);

  function handleViewCart() {
    setPopupOpen(false);
    setCartOpen(true); // Abre tu CartDrawer lateral existente
  }

  function handleViewDetail() {
    // lastAddedProduct trae el producto completo (imagePath, descripción, etc.);
    // currentItem puede venir recortado del carrito, así que usamos el original.
    if (!lastAddedProduct || !onProductDetail) return;
    setPopupOpen(false);
    onProductDetail(lastAddedProduct);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center overflow-y-auto bg-black/60 px-4 pb-6 pt-20 transition-opacity sm:pt-24"
      onClick={() => setPopupOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-drop relative h-fit w-full max-w-md rounded-2xl border border-nebula-border bg-void-soft p-6 shadow-2xl backdrop-blur-md"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold tracking-wide text-stardust">
            ADDED TO CART
          </h2>
          <button
            onClick={() => setPopupOpen(false)}
            aria-label="Cerrar"
            className="rounded-full p-1.5 text-mist hover:bg-nebula-light hover:text-stardust transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Barra de progreso de mínimo de productos */}
        <div className="mb-6">
          <p className="font-body text-sm font-semibold text-stardust mb-2">
            {remainingItems > 0 ? `${remainingItems} more to continue` : "¡Mínimo alcanzado!"}
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-nebula-border">
            <div 
              className="h-full bg-bloom transition-all duration-300 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-mist">
            <span>{MIN_ITEMS} item minimum</span>
            <span>10% off $100 or more</span>
          </div>
        </div>

        {/* Producto recién agregado */}
        {currentItem && (
          <div className="mb-2 flex items-center gap-3 rounded-xl border border-nebula-border bg-nebula p-3">
            <img 
              src={currentItem.image} 
              alt={currentItem.name} 
              className="h-16 w-16 rounded-lg object-cover bg-nebula-light"
            />
            <div className="flex-1">
              <p className="font-body text-sm font-medium text-stardust">
                {currentItem.name}
              </p>
              <p className="font-body text-xs text-mist">
                ${currentItem.price.toFixed(2)}
              </p>
            </div>

            {/* Controles de cantidad y eliminar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => remove(currentItem.id)}
                className="p-1 text-mist-dim hover:text-coral transition-colors"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5 rounded-md border border-nebula-border px-2 py-1">
                <button
                  onClick={() => decrement(currentItem.id)}
                  className="text-mist hover:text-stardust"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-4 text-center font-body text-xs font-semibold text-stardust">
                  {currentItem.qty}
                </span>
                <button
                  onClick={() => increment(currentItem.id)}
                  className="text-mist hover:text-stardust"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Botón para ver el producto a detalle (sólo si tenemos a dónde llevarlo) */}
        {onProductDetail && lastAddedProduct && (
          <button
            onClick={handleViewDetail}
            className="mb-6 flex w-full items-center justify-center gap-1.5 py-1 font-body text-xs font-medium text-mist transition-colors hover:text-teal"
          >
            <Info className="h-3.5 w-3.5" />
            Ver producto a detalle
          </button>
        )}

        {/* Productos recomendados, estilo Daily Harvest */}
        {recommended.length > 0 && (
          <div className="mb-6">
            <p className="mb-3 font-body text-xs font-semibold uppercase tracking-wider text-mist">
              También te puede interesar
            </p>
            <div className="grid grid-cols-3 gap-2">
              {recommended.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col rounded-xl border border-nebula-border bg-nebula p-2"
                >
                  <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-lg bg-nebula-light">
                    {product.imagePath ? (
                      <img
                        src={product.imagePath}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                    <button
                      onClick={() => addToCart(product)}
                      aria-label={`Agregar ${product.name} al carrito`}
                      className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-bloom text-bloom-ink shadow-md transition-transform hover:scale-110"
                    >
                      <PlusCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </button>
                  </div>
                  <p className="line-clamp-2 font-body text-[11px] font-medium leading-tight text-stardust">
                    {product.name}
                  </p>
                  <p className="mt-0.5 font-body text-[11px] text-mist">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón inferior para ver el carrito completo */}
        <button
          onClick={handleViewCart}
          className="w-full rounded-full border border-stardust py-3.5 text-center font-body text-sm font-semibold text-stardust transition-all hover:bg-stardust hover:text-void-soft"
        >
          VIEW CART ({cartCount})
        </button>

      </div>
    </div>
  );
}
