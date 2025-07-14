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
import JobLookupMap from './pages/user/JobLookupMap';
import JobPosting from './pages/owner/JobPosting';
import JobApply from './pages/user/JobApply';
import MyPage from './pages/user/MyPage';
import ManagerPage from './pages/owner/ManagerPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

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
                        path='/manager'
                        element={
                            <ProtectedRoute requiredScope='MANAGER'>
                                <ManagerPage />
                            </ProtectedRoute>
                        }
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
                        path='/mypage'
                        element={
                            <ProtectedRoute>
                                <MyPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path='/job-lookup-map'
                        element={
                            <ProtectedRoute>
                                <JobLookupMap />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/posting'
                        element={
                            <ProtectedRoute requiredScope='MANAGER'>
                                <JobPosting />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/apply'
                        element={
                            <ProtectedRoute>
                                <JobApply />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </>
    );
}

export default App;
