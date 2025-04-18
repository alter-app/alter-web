import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import PhoneAuthPage from "./pages/PhoneAuth";
import KakaoCallback from "./pages/callback/KakaoCallback";
import AppleCallback from "./pages/callback/AppleCallback";
import styled from "styled-components";

const Background = styled.div`
    min-height: 100%;
    min-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

function App() {
    return (
        <Background>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/signup"
                    element={<SignUp />}
                />
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
                    element={<AppleCallback />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Background>
    );
}

export default App;
