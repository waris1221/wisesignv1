import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <Navbar/>
            <Outlet/>
            {/* gggggg */}
        </>
    )
}

export default Layout;