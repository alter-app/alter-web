import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import PhoneAuthPage from "./pages/PhoneAuth";
import KakaoCallback from "./pages/callback/KakaoCallback";
import AppleCallBack from "./pages/callback/AppleCallback";

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
            <Route
                path="/oauth/kakao/callback"
                element={<KakaoCallback />}
            />
            <Route
                path="/auth/apple/callback"
                element={<AppleCallBack />}
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
