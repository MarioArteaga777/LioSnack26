import { NavLink, useNavigate } from "react-router";
import img from "../../img/Logo.png";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

import {
  FiHome,
  FiUsers,
  FiBox,
  FiUser,
  FiUserCheck,
  FiFolder,
  FiEdit2,
  FiDollarSign,
  FiTruck,
  FiChevronDown,
  FiLogOut,
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
    to: "/production",
    label: "Producción",
    icon: FiFolder,
  },
  {
    to: "/users",
    label: "Usuarios",
    icon: FiUserCheck,
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
    to: "/perfil",
    label: "Perfil",
    icon: FiUser,
  },
];

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="w-60 h-screen bg-gray-300 text-black flex flex-col shrink-0 rounded-r-lg shadow-lg">
      <div className="flex items-center justify-center py-6">
        <img src={img} alt="Logo" className="size-32 object-contain" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon, children }) => {
          // Link with submenu
          if (children) {
            return (
              <div key={label}>
                <button
                  onClick={() => setOpenMenu(openMenu === label ? null : label)}
                  className="w-full flex items-center justify-between px-15 py-3.5 hover:bg-white/30"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    {label}
                  </div>

                  <FiChevronDown
                    className={`transition-transform duration-300 ${
                      openMenu === label ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openMenu === label ? "max-h-40" : "max-h-0"
                  }`}
                >
                  {children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      className={({ isActive }) =>
                        `block w-full rounded px-4 py-3.5 text-center transition ${
                          isActive ? "bg-white font-bold" : "hover:bg-white/30"
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

          // Normal link
          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-15 py-3.5 transition ${
                  isActive ? "bg-white font-bold" : "hover:bg-white/30"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 border-t border-black/10 px-15 py-3.5 transition hover:bg-white/30"
      >
        <FiLogOut size={16} />
        Cerrar sesión
      </button>
    </aside>
  );
};

export default Sidebar;
