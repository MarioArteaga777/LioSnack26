import SearchBar from "../components/SearchBar";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router";
import bgImg from "../assets/AbstractBG.png";

// La autenticación ya se valida en PrivateRoute (usa AuthContext),
// así que este layout no necesita revisar la sesión por su cuenta.
const Layout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#110226]">
      <SideBar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <SearchBar />
        <main className="flex-1 overflow-y-auto p-6 pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

/**style={{backgroundPosition: "center", backgroundImage: `url(${bgImg})`}} */

export default Layout;
