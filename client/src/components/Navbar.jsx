function Navbar() {

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    return (
        <header className="navbar">

            <div>
                <h3>Workspace</h3>
                <p>Manage your projects and issues</p>
            </div>

            <div className="navbar-right">

                <div className="user-info">
                    <div className="avatar">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <span>{user.name || "User"}</span>
                </div>

            </div>

        </header>
    );
}

export default Navbar;
