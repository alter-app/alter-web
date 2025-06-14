import Header from "./Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => (
    <div>
        <Header />
        <main>
            <Outlet />
        </main>
    </div>
);

export default MainLayout;
