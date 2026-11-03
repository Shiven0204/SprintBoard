import ActivityFeed from "../components/ActivityFeed";

function Activity() {
    return (
        <div>
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Workspace history</p>
                    <h1>Activity</h1>
                    <p>See the latest changes across your projects.</p>
                </div>
            </div>
            <ActivityFeed />
        </div>
    );
}

export default Activity;
