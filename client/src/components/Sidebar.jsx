
import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    FolderKanban,
    ListTodo,
    Activity as ActivityIcon,
    LogOut,
    Zap
} from "lucide-react";

function Sidebar() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const links = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard
        },
        {
            name: "Projects",
            path: "/projects",
            icon: FolderKanban
        },
        {
            name: "Issues",
            path: "/issues",
            icon: ListTodo
        },
        {
            name: "Activity",
            path: "/activity",
            icon: ActivityIcon
        }
    ];

    return (
        <aside className="sidebar">

            <div className="brand">
                <Zap size={25} />
                <h2>SprintBoard</h2>
            </div>

            <p className="nav-label">WORKSPACE</p>

            <nav>
                {links.map(link => {
                    const Icon = link.icon;

                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            <Icon size={19} />
                            <span>{link.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <button className="logout-btn" onClick={logout}>
                <LogOut size={19} />
                <span>Logout</span>
            </button>

        </aside>
    );
}

export default Sidebar;
