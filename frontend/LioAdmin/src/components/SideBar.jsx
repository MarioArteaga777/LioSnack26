import { Link } from "react-router";
import img from "../../img/Logo.png"

const SideBar = () => {
  return (
    <div className="flex">
      <div className="w-52 h-screen bg-gray-300 text-black">
          <div className="flex items-center justify-center">
            <img src={img} alt="Logo" className="size-35"/>
          </div>
        <div className="flex flex-col items-center mt-2">
          <nav className="mt-5">
            <ul>
              <li>
                <Link to="/home" className="block py-3.5 px-20 rounded hover:bg-white">
                  Inicio
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
