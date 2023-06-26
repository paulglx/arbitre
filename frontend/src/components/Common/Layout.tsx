import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div className="mx-auto max-w-8xl px-2 sm:px-3 lg:px-4">
            <div className="my-2">
                <Outlet />
            </div>
        </div>
    )    
}

export default Layout;