import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";

function DashboardLayout() {
    const navigate = useNavigate();

    const navItems = [
        {
            path: "/dashboard",
            label: "Overview",
            icon: "⌂",
            end: true
        },
        {
            path: "/dashboard/clients",
            label: "Clients & Roster",
            icon: "♙"
        },
        {
            path: "/dashboard/booking",
            label: "Sessions & Calendar",
            icon: "◷"
        },
        {
            path: "/dashboard/notes",
            label: "Clinical Notes",
            icon: "▤"
        },
        {
            path: "/dashboard/analytics",
            label: "Analytics & Billing",
            icon: "◒"
        },
        {
            path: "/dashboard/payments",
            label: "Payments",
            icon: "₹"
        },
        {
            path: "/dashboard/packages",
            label: "Packages",
            icon: "▥"
        },
        {
            path: "/dashboard/chat",
            label: "Client Chat",
            icon: "○"
        },
        {
            path: "/dashboard/availability",
            label: "Availability",
            icon: "◴"
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="clinical-app">

            {/* SIDEBAR */}
            <aside className="clinical-sidebar">

                <div className="brand-header">
                    <div className="brand-logo">
                        U
                    </div>

                    <div>
                        <div className="brand-name">
                            Unfazed
                        </div>

                        <div className="brand-subtitle">
                            Clinical Care
                        </div>
                    </div>
                </div>

                <nav className="clinical-nav">

                    <div className="nav-heading">
                        PRACTICE MENU
                    </div>

                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `clinical-nav-item ${isActive
                                    ? "active"
                                    : ""
                                }`
                            }
                        >
                            <span className="nav-icon">
                                {item.icon}
                            </span>

                            <span>
                                {item.label}
                            </span>
                        </NavLink>
                    ))}

                </nav>

                {/* PROFILE */}
                <div className="therapist-profile">

                    <div className="profile-avatar">
                        U
                    </div>

                    <div className="profile-info">
                        <strong>
                            Therapist
                        </strong>

                        <span>
                            Clinical Practice
                        </span>
                    </div>

                    <button
                        className="settings-button"
                        title="Settings"
                    >
                        ⚙
                    </button>

                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    <span>↪</span>
                    Logout
                </button>

            </aside>

            {/* MAIN AREA */}
            <main className="clinical-main">

                {/* TOP BAR */}
                <header className="clinical-header">

                    <div className="breadcrumb">

                        <span className="portal-name">
                            Unfazed Portal
                        </span>

                        <span className="breadcrumb-divider">
                            /
                        </span>

                        <span>
                            Clinical Dashboard
                        </span>

                    </div>

                    <div className="header-right">

                        <div className="practice-status">
                            <span className="status-dot"></span>
                            Practice Active
                        </div>

                    </div>

                </header>

                {/* PAGE CONTENT */}
                <section className="clinical-content">
                    <Outlet />
                </section>

            </main>

        </div>
    );
}

export default DashboardLayout;