const OrderItem = ({ product, status, image }) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-[#6AA5D9]/60 px-4 py-3 shadow-sm">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate text-gray-800">
          Producto: {product}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-gray-500">Estado:</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {status}
          </span>
        </div>
      </div>
      <img
        src={image}
        alt={product}
        loading="lazy"
        width={48}
        height={48}
        className="h-12 w-12 rounded-lg object-cover shrink-0"
      />
    </div>
  );
};

export default OrderItem;