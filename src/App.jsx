import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import PhoneAuthPage from "./pages/PhoneAuth";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
                path="/phoneauth"
                element={<PhoneAuthPage />}
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
