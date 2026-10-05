import { useEffect, useState } from "react";

function Packages() {
    const [packages, setPackages] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        sessions: "3",
        pricePerSession: "",
        expiryDays: "90"
    });

    const [client, setClient] = useState({
        name: "",
        email: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");


    // LOAD PACKAGES
    const loadPackages = async () => {
        try {
            const response = await fetch(
                "https://unfazed-backend-xnph.onrender.com/api/packages",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load packages"
                );
            }

            setPackages(data.packages || []);

        } catch (error) {
            setMessage(error.message);
        }
    };


    useEffect(() => {
        loadPackages();
    }, []);


    // PACKAGE FORM
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    // CREATE PACKAGE
    const handleCreatePackage = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "https://unfazed-backend-xnph.onrender.com/api/packages",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to create package"
                );
            }

            setMessage(
                "Package created successfully."
            );

            setFormData({
                name: "",
                sessions: "3",
                pricePerSession: "",
                expiryDays: "90"
            });

            loadPackages();

        } catch (error) {
            setMessage(error.message);
        }
    };


    // LOAD RAZORPAY
    const loadRazorpay = () => {
        return new Promise((resolve) => {

            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script =
                document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);

            script.onerror = () => resolve(false);

            document.body.appendChild(script);
        });
    };


    // VERIFY PAYMENT
    const verifyPayment = async (response) => {
        try {
            const verifyResponse = await fetch(
                "https://unfazed-backend-xnph.onrender.com/api/payments/verify",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        razorpay_order_id:
                            response.razorpay_order_id,

                        razorpay_payment_id:
                            response.razorpay_payment_id,

                        razorpay_signature:
                            response.razorpay_signature
                    })
                }
            );

            const data =
                await verifyResponse.json();

            if (!verifyResponse.ok) {
                throw new Error(
                    data.message ||
                    "Payment verification failed"
                );
            }

            setMessage(
                "Payment successful and verified!"
            );

        } catch (error) {

            console.error(
                "VERIFICATION ERROR:",
                error
            );

            setMessage(
                error.message ||
                "Payment verification failed"
            );
        }
    };


    // PAYMENT
    const handlePayment = async (pkg) => {

        if (!client.name || !client.email) {
            setMessage(
                "Please enter the client name and email first."
            );
            return;
        }

        setLoading(true);
        setMessage("");

        try {

            const razorpayLoaded =
                await loadRazorpay();

            if (!razorpayLoaded) {
                throw new Error(
                    "Razorpay checkout failed to load."
                );
            }


            // CREATE ORDER
            const response = await fetch(
                "https://unfazed-backend-xnph.onrender.com/api/payments/order",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        clientName: client.name,
                        clientEmail: client.email,
                        amount: pkg.totalPrice
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to create payment order"
                );
            }


            // RAZORPAY CHECKOUT
            const options = {

                key: data.keyId,

                amount: data.order.amount,

                currency: data.order.currency,

                name: "Unfazed",

                description:
                    `${pkg.name} - ${pkg.sessions} Sessions`,

                order_id: data.order.id,

                prefill: {
                    name: client.name,
                    email: client.email
                },

                theme: {
                    color: "#3399cc"
                },


                // PAYMENT SUCCESS
                handler: async function (response) {

                    console.log(
                        "Razorpay Response:",
                        response
                    );

                    setMessage(
                        "Payment received. Verifying..."
                    );

                    await verifyPayment(
                        response
                    );
                },


                // CHECKOUT CLOSED
                modal: {
                    ondismiss: function () {

                        setMessage(
                            "Payment window was closed."
                        );

                    }
                }

            };


            const paymentObject =
                new window.Razorpay(options);

            paymentObject.open();


        } catch (error) {

            console.error(
                "PAYMENT ERROR:",
                error
            );

            setMessage(
                error.message ||
                "Payment failed"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "900px"
            }}
        >

            <h1>Session Packages</h1>

            <p>
                Create and purchase therapy session packages.
            </p>


            <hr />


            {/* CREATE PACKAGE */}

            <h2>Create Package</h2>

            <form onSubmit={handleCreatePackage}>

                <div style={{ marginBottom: "15px" }}>

                    <label>
                        Package Name
                    </label>

                    <br />

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Starter Package"
                        required
                    />

                </div>


                <div style={{ marginBottom: "15px" }}>

                    <label>
                        Number of Sessions
                    </label>

                    <br />

                    <select
                        name="sessions"
                        value={formData.sessions}
                        onChange={handleChange}
                    >

                        <option value="3">
                            3 Sessions
                        </option>

                        <option value="6">
                            6 Sessions
                        </option>

                        <option value="12">
                            12 Sessions
                        </option>

                    </select>

                </div>


                <div style={{ marginBottom: "15px" }}>

                    <label>
                        Price Per Session (₹)
                    </label>

                    <br />

                    <input
                        type="number"
                        name="pricePerSession"
                        value={formData.pricePerSession}
                        onChange={handleChange}
                        placeholder="e.g. 500"
                        min="1"
                        required
                    />

                </div>


                <div style={{ marginBottom: "15px" }}>

                    <label>
                        Expiry (Days)
                    </label>

                    <br />

                    <input
                        type="number"
                        name="expiryDays"
                        value={formData.expiryDays}
                        onChange={handleChange}
                        min="1"
                        required
                    />

                </div>


                <button type="submit">
                    Create Package
                </button>

            </form>


            <hr />


            {/* CLIENT DETAILS */}

            <h2>Client Details</h2>

            <div style={{ marginBottom: "15px" }}>

                <label>
                    Client Name
                </label>

                <br />

                <input
                    type="text"
                    value={client.name}
                    onChange={(e) =>
                        setClient({
                            ...client,
                            name: e.target.value
                        })
                    }
                    placeholder="Enter client name"
                />

            </div>


            <div style={{ marginBottom: "20px" }}>

                <label>
                    Client Email
                </label>

                <br />

                <input
                    type="email"
                    value={client.email}
                    onChange={(e) =>
                        setClient({
                            ...client,
                            email: e.target.value
                        })
                    }
                    placeholder="Enter client email"
                />

            </div>


            <hr />


            {/* MESSAGE */}

            {message && (
                <p>
                    {message}
                </p>
            )}


            {/* AVAILABLE PACKAGES */}

            <h2>
                Available Packages
            </h2>


            {packages.length === 0 ? (

                <p>
                    No packages created yet.
                </p>

            ) : (

                <div>

                    {packages.map((pkg) => (

                        <div
                            key={pkg._id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "10px",
                                padding: "20px",
                                marginBottom: "15px"
                            }}
                        >

                            <h2>
                                {pkg.name}
                            </h2>

                            <p>
                                <strong>
                                    {pkg.sessions}
                                </strong>{" "}
                                sessions
                            </p>

                            <p>
                                ₹{pkg.pricePerSession}
                                {" "}per session
                            </p>

                            <p>
                                <strong>
                                    Total: ₹{pkg.totalPrice}
                                </strong>
                            </p>

                            <p>
                                Valid for{" "}
                                {pkg.expiryDays} days
                            </p>


                            <button
                                onClick={() =>
                                    handlePayment(pkg)
                                }
                                disabled={loading}
                            >

                                {loading
                                    ? "Processing..."
                                    : `Pay ₹${pkg.totalPrice}`}

                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Packages;