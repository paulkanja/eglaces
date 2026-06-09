import { Route, Routes } from "react-router"

import HomePage  from "./pages/Home.jsx"
import LoginPage from "./pages/Login.jsx"
import SignupPage from "./pages/Signup.jsx"

const SERVER_URL = "http://localhost:5050"

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomePage server={SERVER_URL}/>} />
                <Route path="/login" element={<LoginPage server={SERVER_URL} />} />
                <Route path="/signup" element={<SignupPage server={SERVER_URL} />} />
            </Routes>
        </>
    )
}
