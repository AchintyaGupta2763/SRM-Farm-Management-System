import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import DailyMemorandum from './components/DailyMemorandum';
import FarmProduces from './components/FarmProduces';
import Forecast from './components/Forecast';
import Programme from './components/Programme';
import PurchaseRegister from './components/PurchaseRegister';
import StockRegister from './components/StockRegister';
import FarmToolsMovement from './components/FarmToolsMovement';
import MovementRegister from './components/MovementRegister';
import ApprovedCSVList from "./components/ApprovedCSVList";

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    return children;
};

const AppRoutes = () => {
    const { user } = useAuth();
    
    return (
        <>
            {user && <Navbar />}
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
                <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
                <Route
                    path="/home" element={<ProtectedRoute><LandingPage /></ProtectedRoute>}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/daily-memorandum" element={<DailyMemorandum />} />
                <Route path="/farm-produces" element={<FarmProduces />} />
                <Route path="/forecast" element={<Forecast />} />
                <Route path="/programme" element={<Programme />} />
                <Route path="/purchase-register" element={<PurchaseRegister />} />
                <Route path="/stock-register" element={<StockRegister />} />
                <Route path="/farm-tools" element={<FarmToolsMovement />} />
                <Route path="/movement-register" element={<MovementRegister />} />
                <Route path="/approved-csvs" element={<ApprovedCSVList />} />
                <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;