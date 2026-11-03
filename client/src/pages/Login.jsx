
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Zap } from "lucide-react";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const res = await api.post("/auth/login", form);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            navigate("/dashboard");

        } catch (error) {
            setError(
                error.response?.data?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <form onSubmit={handleSubmit} className="auth-form">

                <p className="auth-brand"><Zap size={16} /> SprintBoard</p>
                <h1>Welcome Back</h1>
                <p>Login to SprintBoard</p>

                {error && <p className="error">{error}</p>}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <div className="password-field"><input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>

                <button className="button button-primary" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p>
                    Don't have an account?
                    <Link to="/register"> Register</Link>
                </p>

            </form>

        </div>
    );
}

export default Login;
