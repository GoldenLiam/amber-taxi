import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home, Trip, Login, RideDetail, Register, RegisterTrip } from "../pages";

// Socket
import { SocketTransportationContextProvider } from "../sockets";
import { SocketTransportationContextProviderForRegisterTrip } from "../sockets";

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Home />}>
                </Route>

                <Route path="/trip/:uuid" element={
                    <SocketTransportationContextProvider>
                        <Trip />
                    </SocketTransportationContextProvider>
                }>
                </Route>
                
                <Route path="/ride-detail/:uuid" element={<RideDetail />}>
                </Route>

                <Route path="/login" element={ <Login/> }>
                </Route>

                <Route path="/register-trip" element={
                    <SocketTransportationContextProviderForRegisterTrip>
                        <RegisterTrip />
                    </SocketTransportationContextProviderForRegisterTrip>
                }>
                </Route>

                <Route path="/register" element={ <Register/> }>
                </Route>

            </Routes>
        </Router>
    );
}