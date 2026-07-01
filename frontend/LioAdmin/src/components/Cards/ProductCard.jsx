const ProductCard = ({ image, name, stock, price }) => {
  const inStock = stock > 0;

  return (
    <div className="relative w-64 rounded-2xl bg-[#2a1f5e] p-4 shadow-xl overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3b2d7a] to-[#2a1f5e] opacity-80 pointer-events-none" />

      <div className="relative flex flex-col items-center">
        {/* Imagen del producto */}
        <div className="h-32 w-32 flex items-center justify-center mb-3">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain drop-shadow-lg"
          />
        </div>

        {/* Nombre */}
        <h3 className="text-white text-sm font-medium text-center mb-3">
          {name}
        </h3>

        {/* Badges: stock y precio */}
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${
              inStock
                ? "bg-pink-500/20 text-pink-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-pink-400" />
            En Stock: {stock}
          </span>

          <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white">
            Precio: ${price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;