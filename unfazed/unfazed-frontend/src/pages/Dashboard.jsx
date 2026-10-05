import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
    const [analytics, setAnalytics] = useState({
        activeClients: 0,
        totalBookings: 0,
        totalRevenue: 0,
        noShowRate: 0
    });

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "https://unfazed-backend-xnph.onrender.com/api/analytics",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                setAnalytics({
                    activeClients: data.activeClients || 0,
                    totalBookings: data.totalBookings || 0,
                    totalRevenue: data.totalRevenue || 0,
                    noShowRate: data.noShowRate || 0
                });

            } catch (error) {
                console.error(
                    "Dashboard analytics error:",
                    error
                );
            }
        };

        loadAnalytics();
    }, []);

    return (
        <div className="dashboard-page">

            {/* =========================================
                WELCOME
            ========================================= */}

            <section className="welcome-section">

                <p className="dashboard-eyebrow">
                    OVERVIEW
                </p>

                <h1 className="dashboard-title">
                    Good to see you.
                </h1>

                <p className="dashboard-subtitle">
                    Here's a quick look at what's happening
                    in your practice.
                </p>

            </section>


            {/* =========================================
                STATISTICS
            ========================================= */}

            <section className="dashboard-stats">

                <div className="stat-card">

                    <div className="stat-icon">
                        ♙
                    </div>

                    <div className="stat-label">
                        Active Clients
                    </div>

                    <div className="stat-value">
                        {analytics.activeClients}
                    </div>

                    <div className="stat-description">
                        Clients in your practice
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        ▣
                    </div>

                    <div className="stat-label">
                        Total Bookings
                    </div>

                    <div className="stat-value">
                        {analytics.totalBookings}
                    </div>

                    <div className="stat-description">
                        Sessions booked
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        ₹
                    </div>

                    <div className="stat-label">
                        Revenue
                    </div>

                    <div className="stat-value">
                        ₹
                        {Number(
                            analytics.totalRevenue || 0
                        ).toLocaleString("en-IN")}
                    </div>

                    <div className="stat-description">
                        Successful payments
                    </div>

                </div>


                <div className="stat-card">

                    <div className="stat-icon">
                        ◷
                    </div>

                    <div className="stat-label">
                        No-Show Rate
                    </div>

                    <div className="stat-value">
                        {analytics.noShowRate}%
                    </div>

                    <div className="stat-description">
                        Across your bookings
                    </div>

                </div>

            </section>


            {/* =========================================
                QUICK ACTIONS
            ========================================= */}

            <section className="dashboard-section">

                <div className="section-heading">

                    <p className="section-eyebrow">
                        SHORTCUTS
                    </p>

                    <h2 className="section-title">
                        Quick actions
                    </h2>

                    <p className="section-description">
                        Jump straight into your most-used tools.
                    </p>

                </div>


                <div className="quick-actions">

                    <Link
                        to="/dashboard/clients"
                        className="action-card"
                    >

                        <div className="action-icon">
                            +
                        </div>

                        <div className="action-title">
                            Add Client
                        </div>

                        <div className="action-description">
                            Create a new client profile
                        </div>

                        <span className="action-arrow">
                            →
                        </span>

                    </Link>


                    <Link
                        to="/dashboard/availability"
                        className="action-card"
                    >

                        <div className="action-icon">
                            ◷
                        </div>

                        <div className="action-title">
                            Set Availability
                        </div>

                        <div className="action-description">
                            Define your working hours
                        </div>

                        <span className="action-arrow">
                            →
                        </span>

                    </Link>


                    <Link
                        to="/dashboard/booking"
                        className="action-card"
                    >

                        <div className="action-icon">
                            ▣
                        </div>

                        <div className="action-title">
                            Book Session
                        </div>

                        <div className="action-description">
                            Schedule a therapy session
                        </div>

                        <span className="action-arrow">
                            →
                        </span>

                    </Link>


                    <Link
                        to="/dashboard/notes"
                        className="action-card"
                    >

                        <div className="action-icon">
                            ✎
                        </div>

                        <div className="action-title">
                            Create Note
                        </div>

                        <div className="action-description">
                            Record a clinical session note
                        </div>

                        <span className="action-arrow">
                            →
                        </span>

                    </Link>

                </div>

            </section>


            {/* =========================================
                PRACTICE TOOLS
            ========================================= */}

            <section className="dashboard-section">

                <div className="section-heading">

                    <p className="section-eyebrow">
                        PRACTICE
                    </p>

                    <h2 className="section-title">
                        Your practice
                    </h2>

                    <p className="section-description">
                        Everything you need to manage your
                        therapy practice.
                    </p>

                </div>


                <div className="practice-grid">

                    <Link
                        to="/dashboard/payments"
                        className="practice-card"
                    >

                        <span className="practice-icon">
                            ₹
                        </span>

                        <div>
                            <div className="practice-title">
                                Payments
                            </div>

                            <div className="practice-description">
                                Collect payments, track
                                transactions and generate invoices.
                            </div>
                        </div>

                    </Link>


                    <Link
                        to="/dashboard/packages"
                        className="practice-card"
                    >

                        <span className="practice-icon">
                            ▥
                        </span>

                        <div>
                            <div className="practice-title">
                                Packages
                            </div>

                            <div className="practice-description">
                                Manage 3, 6 and 12-session packages.
                            </div>
                        </div>

                    </Link>


                    <Link
                        to="/dashboard/chat"
                        className="practice-card"
                    >

                        <span className="practice-icon">
                            ○
                        </span>

                        <div>
                            <div className="practice-title">
                                Client Chat
                            </div>

                            <div className="practice-description">
                                Communicate with clients in real time.
                            </div>
                        </div>

                    </Link>


                    <Link
                        to="/dashboard/analytics"
                        className="practice-card"
                    >

                        <span className="practice-icon">
                            ↗
                        </span>

                        <div>
                            <div className="practice-title">
                                Analytics
                            </div>

                            <div className="practice-description">
                                Track revenue, bookings and
                                practice metrics.
                            </div>
                        </div>

                    </Link>

                </div>

            </section>

        </div>
    );
}

export default Dashboard;