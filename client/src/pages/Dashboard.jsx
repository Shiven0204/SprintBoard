import { useCallback, useEffect, useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Clock3,
    FolderKanban,
    ListTodo,
    RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import ActivityFeed from "../components/ActivityFeed";
import api from "../services/api";

const initialStats = {
    totalProjects: 0,
    totalIssues: 0,
    openIssues: 0,
    inProgressIssues: 0,
    completedIssues: 0,
    highPriorityIssues: 0
};

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [stats, setStats] = useState(initialStats);
    const [projects, setProjects] = useState([]);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true);
            const [statsResponse, projectsResponse, issuesResponse] = await Promise.all([
                api.get("/dashboard/stats"),
                api.get("/projects"),
                api.get("/issues")
            ]);
            setStats({ ...initialStats, ...statsResponse.data });
            setProjects(projectsResponse.data);
            setIssues(issuesResponse.data.slice(0, 5));
            setError("");
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Unable to load dashboard");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const initialLoad = window.setTimeout(fetchDashboard, 0);
        window.addEventListener("sprintboard:data-changed", fetchDashboard);
        return () => {
            window.clearTimeout(initialLoad);
            window.removeEventListener("sprintboard:data-changed", fetchDashboard);
        };
    }, [fetchDashboard]);

    const cards = [
        ["Total Projects", stats.totalProjects, FolderKanban, "indigo"],
        ["Total Issues", stats.totalIssues, ListTodo, "blue"],
        ["Open Issues", stats.openIssues, Clock3, "slate"],
        ["In Progress", stats.inProgressIssues, AlertTriangle, "amber"],
        ["Completed", stats.completedIssues, CheckCircle2, "green"],
        ["High Priority", stats.highPriorityIssues, AlertTriangle, "red"]
    ];

    return (
        <div className="dashboard">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Workspace overview</p>
                    <h1>Welcome back, {user.name?.split(" ")[0] || "there"}.</h1>
                    <p>Keep your projects moving and your team aligned.</p>
                </div>
                <button className="button button-secondary" onClick={fetchDashboard} disabled={loading}>
                    <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
                </button>
            </div>

            {error && <div className="alert error">{error}</div>}
            {loading && !projects.length ? (
                <div className="loading-state">Loading your workspace...</div>
            ) : (
                <>
                    <div className="stats-grid">
                        {cards.map(([label, value, Icon, tone]) => (
                            <div className="stat-card" key={label}>
                                <div className={`stat-icon ${tone}`}><Icon size={20} /></div>
                                <p>{label}</p>
                                <strong>{value}</strong>
                            </div>
                        ))}
                    </div>
                    <div className="dashboard-columns">
                        <section className="panel">
                            <div className="section-heading"><div><h2>Project overview</h2><p>Your latest workspaces</p></div><Link to="/projects" className="text-link">View all</Link></div>
                            {projects.length === 0 ? <div className="empty-state"><FolderKanban size={28} /><p>No projects yet. Create your first project to get started.</p><Link className="button button-primary" to="/projects">Create project</Link></div> :
                                <div className="overview-list">{projects.slice(0, 4).map(project => <Link className="overview-row" to={`/projects/${project._id}`} key={project._id}><span className="project-mark"><FolderKanban size={17} /></span><span><strong>{project.name}</strong><small>{project.description || "No description"}</small></span><b>{project.issueCount || 0} issues</b></Link>)}</div>}
                        </section>
                        <section className="panel">
                            <div className="section-heading"><div><h2>Recent issues</h2><p>Latest updates across projects</p></div><Link to="/issues" className="text-link">View all</Link></div>
                            {issues.length === 0 ? <div className="empty-state"><ListTodo size={28} /><p>No issues to show yet.</p></div> : <div className="overview-list">{issues.map(issue => <Link className="overview-row" to={`/projects/${issue.projectId?._id}`} key={issue._id}><span><strong>{issue.title}</strong><small>{issue.projectId?.name || "Project"}</small></span><span className={`status ${issue.status.toLowerCase().replace(" ", "-")}`}>{issue.status}</span></Link>)}</div>}
                        </section>
                    </div>
                    <ActivityFeed />
                </>
            )}
        </div>
    );
}

export default Dashboard;
