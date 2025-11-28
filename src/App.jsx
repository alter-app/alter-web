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
import MyPage from './pages/user/MyPage';
import MyJob from './pages/user/MyJob';
import ApplicantListPage from './pages/owner/ApplicantListPage';
import SentReputationListPageOwner from './pages/owner/SentReputationListPage';
import ReputationNotificationListPage from './pages/owner/ReputationNotificationListPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Main from './pages/owner/Main';
import WorkplaceDetail from './components/owner/workplace/WorkplaceDetail';
import ManagerMyPage from './pages/owner/ManagerMyPage';
import WorkplaceDetailPage from './components/user/myJob/workplaceDetail/WorkplaceDetailPage';
import OwnerWorkplaceDetailPage from './components/owner/workplace/workplaceDetail/WorkplaceDetailPage';
import ReputationWrite from './pages/ReputationWrite';
import ReputationListPage from './pages/user/ReputationListPage';
import SentReputationListPage from './pages/user/SentReputationListPage';
import SentSubstituteRequestListPage from './pages/user/SentSubstituteRequestListPage';
import ReceivedSubstituteRequestListPage from './pages/user/ReceivedSubstituteRequestListPage';
import OwnerSubstituteRequestListPage from './pages/owner/OwnerSubstituteRequestListPage';
import ScheduleListPage from './pages/user/ScheduleListPage';
import ApplicationListPage from './pages/user/ApplicationListPage';
import ScheduleRequestPage from './pages/user/ScheduleRequestPage';
import NotificationListPage from './pages/user/NotificationListPage';
import ManagerNotificationListPage from './pages/owner/ManagerNotificationListPage';
import ChatListPage from './pages/user/ChatListPage';
import ChatRoomPage from './pages/user/ChatRoomPage';
import ManagerChatListPage from './pages/owner/ManagerChatListPage';
import ManagerChatRoomPage from './pages/owner/ManagerChatRoomPage';
import SettingsPage from './pages/user/SettingsPage';

function App() {
    return (
        <>
            <Routes>
                <Route element={<FooterLayout />}>
                    <Route
                        path='*'
                        element={<NotFound />}
                    />
                </Route>

                <Route element={<MainLayout />}>
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
                        path='/mypage'
                        element={
                            <ProtectedRoute>
                                <MyPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/settings'
                        element={
                            <ProtectedRoute>
                                <SettingsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/my-applications'
                        element={
                            <ProtectedRoute>
                                <MyJob />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/reputation-write'
                        element={
                            <ProtectedRoute>
                                <ReputationWrite />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/reputation-list'
                        element={
                            <ProtectedRoute>
                                <ReputationListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/sent-reputation-list'
                        element={
                            <ProtectedRoute>
                                <SentReputationListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/sent-substitute-request-list'
                        element={
                            <ProtectedRoute>
                                <SentSubstituteRequestListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/received-substitute-request-list'
                        element={
                            <ProtectedRoute>
                                <ReceivedSubstituteRequestListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/schedule-list'
                        element={
                            <ProtectedRoute>
                                <ScheduleListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/schedule-request'
                        element={
                            <ProtectedRoute>
                                <ScheduleRequestPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/application-list'
                        element={
                            <ProtectedRoute>
                                <ApplicationListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/notifications'
                        element={
                            <ProtectedRoute>
                                <NotificationListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/chat'
                        element={
                            <ProtectedRoute>
                                <ChatListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/chat/rooms/:chatRoomId'
                        element={
                            <ProtectedRoute>
                                <ChatRoomPage />
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
                        path='/main'
                        element={
                            <ProtectedRoute requiredScope='MANAGER'>
                                <Main />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/workplace/detail/:id'
                        element={
                            <ProtectedRoute requiredScope='MANAGER'>
                                <WorkplaceDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/owner/workplace/:workplaceId/:workplaceName'
                        element={
                            <ProtectedRoute requiredScope='MANAGER'>
                                <OwnerWorkplaceDetailPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/my-job/workplace/:workplaceId/:workplaceName'
                        element={
                            <ProtectedRoute>
                                <WorkplaceDetailPage />
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
                        path='/applicant'
                        element={
                            <ProtectedRoute requiredScope='MANAGER'>
                                <ApplicantListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/owner/sent-reputation'
                        element={
                            <ProtectedRoute requiredScope='MANAGER'>
                                <SentReputationListPageOwner />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/owner/reputation-notification'
                        element={
                            <ProtectedRoute requiredScope='MANAGER'>
                                <ReputationNotificationListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/owner/substitute-requests'
                        element={
                            <ProtectedRoute requiredScope='MANAGER'>
                                <OwnerSubstituteRequestListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/owner/notifications'
                        element={
                            <ProtectedRoute requiredScope='MANAGER'>
                                <ManagerNotificationListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/owner/chat'
                        element={
                            <ProtectedRoute requiredScope='MANAGER'>
                                <ManagerChatListPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/owner/chat/rooms/:chatRoomId'
                        element={
                            <ProtectedRoute requiredScope='MANAGER'>
                                <ManagerChatRoomPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/owner/mypage'
                        element={
                            <ProtectedRoute requiredScope='MANAGER'>
                                <ManagerMyPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </>
    );
}

export default App;
