
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import api from "../services/api";

function Issues() {

    const [issues, setIssues] = useState([]);
    const [projects, setProjects] = useState([]);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [project, setProject] = useState("");

    const [loading, setLoading] = useState(true);

    // Load projects
    useEffect(() => {
        api.get("/projects")
            .then(res => setProjects(res.data))
            .catch(console.error);
    }, []);

    // Fetch issues when filters change
    useEffect(() => {

        const timer = setTimeout(async () => {

            try {
                setLoading(true);

                const params = {
                    search,
                    status,
                    priority,
                    project
                };

                const res = await api.get("/issues", { params });

                setIssues(res.data);

            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }

        }, 400);

        return () => clearTimeout(timer);

    }, [search, status, priority, project]);

    return (
        <div>

            <h1>All Issues</h1>
            <p>Search and manage your issues.</p>

            <div className="filters">

                <label className="input-with-icon">
                    <Search size={16} aria-hidden="true" />
                    <input
                        placeholder="Search issue title..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </label>

                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>

                <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                >
                    <option value="">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                <select
                    value={project}
                    onChange={e => setProject(e.target.value)}
                >
                    <option value="">All Projects</option>

                    {projects.map(p => (
                        <option value={p._id} key={p._id}>
                            {p.name}
                        </option>
                    ))}

                </select>

            </div>

            {loading ? (
                <p>Loading issues...</p>
            ) : (

                <div className="issues-list">

                    {issues.map(issue => (

                        <div className="issue-card" key={issue._id}>

                            <div>
                                <h3>{issue.title}</h3>
                                <p>{issue.description}</p>
                                <small>
                                    Project: {issue.projectId?.name}
                                </small>
                            </div>

                            <span className={`priority ${issue.priority?.toLowerCase()}`}>
                                {issue.priority}
                            </span>

                            <span className={`status ${issue.status?.toLowerCase().replace(" ", "-")}`}>
                                {issue.status}
                            </span>

                        </div>

                    ))}

                    {issues.length === 0 && (
                        <p>No matching issues found.</p>
                    )}

                </div>

            )}

        </div>
    );
}

export default Issues;
