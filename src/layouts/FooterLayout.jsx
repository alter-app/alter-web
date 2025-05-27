import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const FooterLayout = () => (
    <div>
        <Header />
        <main>
            <Outlet />
        </main>
        <Footer />
    </div>
);

export default FooterLayout;
