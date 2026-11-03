
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Issues from "./pages/Issues";
import Activity from "./pages/Activity";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                    <Route path="/projects" element={<Layout><Projects /></Layout>} />
                    <Route path="/projects/:id" element={<Layout><ProjectDetails /></Layout>} />
                    <Route path="/issues" element={<Layout><Issues /></Layout>} />
                    <Route path="/activity" element={<Layout><Activity /></Layout>} />
                </Route>

                <Route path="/" element={<Navigate to="/dashboard" />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
