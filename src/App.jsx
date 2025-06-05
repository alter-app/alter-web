import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import PhoneAuthPage from './pages/PhoneAuth';
import KakaoCallback from './pages/callback/KakaoCallback';
import AppleCallback from './pages/callback/AppleCallback';
import MainLayout from './layouts/MainLayout';
import FooterLayout from './layouts/FooterLayout';
import JobLookupMap from './pages/JobLookupMap';
import JobPosting from './pages/JobPosting';

function App() {
    return (
        <>
            <Routes>
                <Route element={<FooterLayout />}>
                    <Route path='/' element={<Home />} />
                    <Route
                        path='/login'
                        element={<Login />}
                    />
                    <Route
                        path='/signup'
                        element={<SignUp />}
                    />
                    <Route
                        path='/phoneauth'
                        element={<PhoneAuthPage />}
                    />
                    <Route
                        path='/oauth/kakao/callback'
                        element={<KakaoCallback />}
                    />
                    <Route
                        path='/auth/apple/callback'
                        element={<AppleCallback />}
                    />
                    <Route
                        path='*'
                        element={<NotFound />}
                    />
                </Route>

                <Route element={<MainLayout />}>
                    <Route
                        path='job-lookup-map'
                        element={<JobLookupMap />}
                    />
                    <Route
                        path='posting'
                        element={<JobPosting />}
                    />
                </Route>
            </Routes>
        </>
    );
}

export default App;
