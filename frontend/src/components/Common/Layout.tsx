import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <div className="my-2">
                <Outlet />
            </div>
        </div>
    )    
}

export default Layout;