
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../services/api";
import Toast from "../components/Toast";
import { Pencil, Search, Trash2 } from "lucide-react";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [projectRes, issueRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get("/issues", { params: { projectId: id, status: statusFilter, priority: priorityFilter, search } })
      ]);
      setProject(projectRes.data.project || projectRes.data);
      setIssues(issueRes.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load project");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  let ignore = false;

  const loadProjectData = async () => {
    try {
      const [projectRes, issueRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get("/issues", { params: { projectId: id, status: statusFilter, priority: priorityFilter, search } })
      ]);

      if (!ignore) {
        setProject(projectRes.data.project || projectRes.data);
        setIssues(issueRes.data);
        setError("");
      }

    } catch (err) {
      if (!ignore) {
        setError(
          err.response?.data?.message || "Unable to load project"
        );
      }
    } finally {
      if (!ignore) {
        setLoading(false);
      }
    }
  };

  loadProjectData();

  return () => {
    ignore = true;
  };
}, [id, statusFilter, priorityFilter, search]);


  // Create issue
  const createIssue = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await api.post("/issues", {
        title: title.trim(),
        description: description.trim(),
        priority,
        projectId: id
      });

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setNotice("Issue created successfully.");

      await fetchData();
      window.dispatchEvent(new Event("sprintboard:data-changed"));

    } catch (err) {
      setError(
        err.response?.data?.message || "Issue creation failed"
      );
    }
  };

  // Update issue status
  const updateStatus = async (issueId, status) => {
    try {
      setError("");

      await api.put(`/issues/${issueId}`, { status });
      setNotice("Issue status updated.");

      await fetchData();
      window.dispatchEvent(new Event("sprintboard:data-changed"));

    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update issue"
      );
    }
  };

  // Delete issue
  const deleteIssue = async (issueId) => {
    if (!window.confirm("Delete this issue?")) return;

    try {
      setError("");

      await api.delete(`/issues/${issueId}`);
      setNotice("Issue deleted successfully.");

      await fetchData();
      window.dispatchEvent(new Event("sprintboard:data-changed"));

    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete issue"
      );
    }
  };

  // Edit issue
  const editIssue = async (issue) => {
    const newTitle = window.prompt(
      "Enter issue title",
      issue.title
    );

    if (!newTitle || !newTitle.trim()) return;

    try {
      setError("");

      await api.put(`/issues/${issue._id}`, {
        title: newTitle.trim()
      });

      setNotice("Issue updated successfully.");
      await fetchData();
      window.dispatchEvent(new Event("sprintboard:data-changed"));

    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update issue"
      );
    }
  };

  if (loading && !project) {
    return <p>Loading project...</p>;
  }

  if (!project) {
    return <p>{error || "Project not found"}</p>;
  }

  return (
    <div>
      <Toast message={notice} />

      {error && (
        <p className="error">{error}</p>
      )}

      <div className="section-heading"><div><p className="eyebrow">Project workspace</p><h1>{project.name}</h1><p>{project.description || "No description yet."}</p></div></div>

      <h2>Create Issue</h2>

      <form
        className="project-form"
        onSubmit={createIssue}
      >

        <input
          type="text"
          placeholder="Issue title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Priority values must match the backend enum */}

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button className="button button-primary" type="submit">
          Create Issue
        </button>

      </form>

      <div className="filters">
        <label className="input-with-icon">
          <Search size={16} aria-hidden="true" />
          <input placeholder="Search issue title..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option><option>To Do</option><option>In Progress</option><option>Done</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All priorities</option><option>Low</option><option>Medium</option><option>High</option>
        </select>
      </div>

      <h2>Project Issues ({issues.length})</h2>

      <div className="issues-list">

        {issues.map((issue) => (

          <div className="issue-card" key={issue._id}>

            <div>
              <h3>{issue.title}</h3>

              <p>{issue.description}</p>

              <span
                className={`priority ${issue.priority?.toLowerCase()}`}
              >
                {issue.priority}
              </span>

              <button
                className="button button-edit"
                type="button"
                onClick={() => editIssue(issue)}
              >
                <Pencil size={15} />
                Edit
              </button>
            </div>            <div className="issue-actions">
              <span className={`status ${issue.status?.toLowerCase().replace(" ", "-")}`}>{issue.status}</span>
              <select
                value={issue.status}
                onChange={(e) =>
                  updateStatus(issue._id, e.target.value)
                }
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <button
                className="button button-danger icon-button"
                type="button"
                onClick={() => deleteIssue(issue._id)}
                aria-label={`Delete ${issue.title}`}
              >
                <Trash2 size={16} />
              </button>
            </div>

          </div>

        ))}

      </div>

      {issues.length === 0 && (
        <p>No issues in this project.</p>
      )}

    </div>
  );
}

export default ProjectDetails;
