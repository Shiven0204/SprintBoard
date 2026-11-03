
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Zap } from "lucide-react";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
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

            await api.post("/auth/register", form);

            navigate("/login");

        } catch (error) {
            setError(
                error.response?.data?.message || "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <form onSubmit={handleSubmit} className="auth-form">

                <p className="auth-brand"><Zap size={16} /> SprintBoard</p>
                <h1>Create Account</h1>
                <p>Join SprintBoard</p>

                {error && <p className="error">{error}</p>}

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <div className="password-field"><input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={form.password} onChange={handleChange} minLength={6} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>

                <button className="button button-primary" disabled={loading}>
                    {loading ? "Creating..." : "Register"}
                </button>

                <p>
                    Already registered?
                    <Link to="/login"> Login</Link>
                </p>

            </form>

        </div>
    );
}

export default Register;
