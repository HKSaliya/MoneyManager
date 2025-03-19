import NavBar from "./NavBar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
    return (
        <>
            <NavBar />
            <div className="flex max-w-6xl mx-auto border border-red-500">
                <Sidebar />
                <div className="flex-1 p-6">{children}</div>
            </div>
        </>
    )
}

export default Layout;
