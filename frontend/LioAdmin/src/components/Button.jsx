const variants = {
  primary: "bg-[#201D73] hover:bg-[#0077DF] text-white",
  secondary: "bg-white/10 hover:bg-white/20 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const sizes = {
  sm: "py-1.5 px-3 text-sm",
  md: "py-2 px-4 text-sm",
  lg: "py-3 px-6 text-base",
  xl: "py-4 px-8 text-lg",
};

const Button = ({
  type = "button",
  onClick,
  text,
  icon: Icon,
  variant = "primary",
  size = "xl",
  disabled = false,
  className = "",
  id=""
}) => {
  return (
    <button
      command="show-modal"
      commandfor={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2
        font-semibold rounded-lg transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        w-63
        h-15
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {Icon && <Icon className="h-7 w-7" />}
      {text}
    </button>
  );
};

export default Button;
