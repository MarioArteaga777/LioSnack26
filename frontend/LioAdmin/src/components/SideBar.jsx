import { NavLink } from "react-router";
import img from "../../img/Logo.png"
import { useState } from "react";
import {
  FiHome,
  FiPackage,
  FiUsers,
  FiBox,
  FiUser,
  FiFolder,
  FiEdit2,
  FiSmile,
  FiDollarSign,
  FiTruck,
  FiChevronDown
} from "react-icons/fi";

export const links = [
  {
    to: "/home",
    label: "Inicio",
    icon: FiHome,
  },
  {
    to: "/products",
    label: "Productos",
    icon: FiBox,
  },
  {
    to: "/customers",
    label: "Clientes",
    icon: FiUsers,
  },
  {
    to: "/orders",
    label: "Pedidos",
    icon: FiTruck,
  },
  {
    label: "Cuentas",
    icon: FiDollarSign,
    children: [
      {
        to: "/sales/receivable",
        label: "Cuentas por Cobrar",
      },
      {
        to: "/sales/payable",
        label: "Cuentas por Pagar",
      },
    ],
  },
  {
    to: "/codes",
    label: "Códigos",
    icon: FiEdit2,
  },
  {
    to: "/perfil",
    label: "Perfil",
    icon: FiUser,
  },
];

const Sidebar = () => {

  const [openMenu, setOpenMenu] = useState(null);

  return (
    <aside className="w-60 h-screen bg-gray-300 text-black flex flex-col shrink-0">
      <div className="flex items-center justify-center py-6">
        <img src={img} alt="Logo" className="size-32 object-contain" />
      </div>
      {links.map(({ to, label, icon: Icon, children }) => {

        // Si tiene submenu
        if (children) {
          return (
            <div key={label}>

              <button
                onClick={() =>
                  setOpenMenu(openMenu === label ? null : label)
                }
                className="w-full flex items-center justify-between px-15 py-3.5 bg-white/30 hover:bg-white/30"
              >
                <div className="flex items-center gap-3 ">
                  <Icon size={16} />
                  {label}
                </div>

                <FiChevronDown
                  className={`transition-transform duration-300 ${openMenu === label ? "rotate-180" : ""
                    }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${openMenu === label ? "max-h-40" : "max-h-0"
                  }`}
              >
                {children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className={({ isActive }) =>
                      `w-full flex items-center justify-center block mr-2 px-4 py-3.5 rounded transition ${isActive
                        ? "bg-white font-bold"
                        : "hover:bg-white/30"
                      }`
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>

            </div>
          );
        }

        // Si NO tiene submenu
        return (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-15 py-3.5 transition ` +
              (isActive
                ? "bg-white font-bold"
                : "hover:bg-white/30")
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        );
      })}
    </aside>
  );
};

export default Sidebar