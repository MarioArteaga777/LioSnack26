import SearchBar from "../components/SearchBar";
import SideBar from "../components/SideBar";
import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import bgImg from "../assets/AbstractBG.png"

const Layout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('fakestore_token') || sessionStorage.getItem('fakestore_token');

    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [navigate, token]);

    if (!token) return null;

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
    )
}

/**style={{backgroundPosition: "center", backgroundImage: `url(${bgImg})`}} */

export default Layout