import { useEffect, useState } from "react";

function Analytics() {
    const [analytics, setAnalytics] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const loadAnalytics = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/analytics",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load analytics"
                );
            }

            setAnalytics(data);

        } catch (error) {
            setMessage(error.message);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div style={{ padding: "40px" }}>
                <h1>Analytics Dashboard</h1>
                <p>Loading analytics...</p>
            </div>
        );
    }

    // Upgrade / access restriction
    if (message) {
        return (
            <div
                style={{
                    padding: "40px",
                    maxWidth: "700px"
                }}
            >
                <h1>Analytics Dashboard</h1>

                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "25px"
                    }}
                >
                    <h2>Premium Feature</h2>

                    <p>{message}</p>

                    <button>
                        Upgrade Subscription
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "1100px"
            }}
        >
            <h1>Analytics Dashboard</h1>

            <p>
                View your practice performance and revenue
                statistics.
            </p>

            <hr />

            {/* ============================= */}
            {/* ANALYTICS STAT CARDS */}
            {/* ============================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(4, 1fr)",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >

                {/* Total Revenue */}

                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px"
                    }}
                >
                    <h3>Total Revenue</h3>

                    <h2>
                        ₹
                        {Number(
                            analytics.totalRevenue || 0
                        ).toFixed(2)}
                    </h2>
                </div>


                {/* Active Clients */}

                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px"
                    }}
                >
                    <h3>Active Clients</h3>

                    <h2>
                        {analytics.activeClients || 0}
                    </h2>
                </div>


                {/* Total Bookings */}

                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px"
                    }}
                >
                    <h3>Total Bookings</h3>

                    <h2>
                        {analytics.totalBookings || 0}
                    </h2>
                </div>


                {/* No-Show Rate */}

                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        padding: "20px"
                    }}
                >
                    <h3>No-Show Rate</h3>

                    <h2>
                        {analytics.noShowRate || 0}%
                    </h2>
                </div>

            </div>


            {/* ============================= */}
            {/* REVENUE TREND */}
            {/* ============================= */}

            <hr
                style={{
                    marginTop: "40px"
                }}
            />

            <h2>Revenue Trend</h2>

            {analytics.revenueTrend.length === 0 ? (

                <p>
                    No revenue data available yet.
                </p>

            ) : (

                <div>

                    {analytics.revenueTrend.map(
                        (item, index) => (

                            <div
                                key={index}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    padding: "15px",
                                    marginBottom: "10px"
                                }}
                            >

                                <strong>
                                    {item._id.month}/
                                    {item._id.year}
                                </strong>

                                <p>
                                    Revenue: ₹
                                    {Number(
                                        item.revenue
                                    ).toFixed(2)}
                                </p>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default Analytics;