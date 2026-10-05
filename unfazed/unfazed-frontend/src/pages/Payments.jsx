import { useEffect, useState } from "react";

function Payments() {
    const [payments, setPayments] = useState([]);
    const [formData, setFormData] = useState({
        clientName: "",
        clientEmail: "",
        amount: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const loadPayments = async () => {
        try {
            const response = await fetch(
                "https://unfazed-backend-xnph.onrender.com/api/payments",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                setPayments(data.payments || []);
            }
        } catch (error) {
            console.error(
                "Failed to load payments:",
                error
            );
        }
    };

    useEffect(() => {
        loadPayments();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const createPayment = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                "https://unfazed-backend-xnph.onrender.com/api/payments/create-order",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        clientName:
                            formData.clientName,
                        clientEmail:
                            formData.clientEmail,
                        amount:
                            Number(formData.amount)
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to create payment"
                );
            }

            // Razorpay checkout
            const options = {
                key: data.keyId,

                amount:
                    data.order.amount,

                currency:
                    data.order.currency,

                name: "Unfazed",

                description:
                    "Therapy Session Payment",

                order_id:
                    data.order.id,

                handler: async function (
                    response
                ) {

                    try {

                        const verifyResponse =
                            await fetch(
                                "https://unfazed-backend-xnph.onrender.com/api/payments/verify",
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json",

                                        Authorization:
                                            `Bearer ${token}`
                                    },

                                    body: JSON.stringify(
                                        response
                                    )
                                }
                            );

                        const verifyData =
                            await verifyResponse.json();

                        if (!verifyResponse.ok) {
                            throw new Error(
                                verifyData.message ||
                                "Payment verification failed"
                            );
                        }

                        setMessage(
                            "Payment successful!"
                        );

                        setFormData({
                            clientName: "",
                            clientEmail: "",
                            amount: ""
                        });

                        loadPayments();

                    } catch (error) {

                        setMessage(
                            error.message
                        );
                    }
                },

                prefill: {
                    name:
                        formData.clientName,

                    email:
                        formData.clientEmail
                },

                theme: {
                    color: "#111827"
                }
            };

            const razorpay =
                new window.Razorpay(
                    options
                );

            razorpay.open();

        } catch (error) {

            setMessage(
                error.message
            );

        } finally {
            setLoading(false);
        }
    };

    const downloadInvoice = (paymentId) => {

        const url =
            `https://unfazed-backend-xnph.onrender.com/api/invoices/${paymentId}`;

        window.open(url, "_blank");
    };

    return (
        <div
            style={{
                padding: "35px"
            }}
        >

            <h1>
                Payments
            </h1>

            <p
                style={{
                    color: "#666"
                }}
            >
                Create therapy session payments
                and view payment history.
            </p>

            <hr />

            {/* PAYMENT FORM */}

            <div
                style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "25px",
                    maxWidth: "600px",
                    marginTop: "25px"
                }}
            >

                <h2>
                    Create Payment
                </h2>

                <form
                    onSubmit={createPayment}
                >

                    <div
                        style={{
                            marginBottom: "15px"
                        }}
                    >
                        <label>
                            Client Name
                        </label>

                        <br />

                        <input
                            type="text"
                            name="clientName"
                            value={
                                formData.clientName
                            }
                            onChange={
                                handleChange
                            }
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px"
                            }}
                        />
                    </div>


                    <div
                        style={{
                            marginBottom: "15px"
                        }}
                    >
                        <label>
                            Client Email
                        </label>

                        <br />

                        <input
                            type="email"
                            name="clientEmail"
                            value={
                                formData.clientEmail
                            }
                            onChange={
                                handleChange
                            }
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px"
                            }}
                        />
                    </div>


                    <div
                        style={{
                            marginBottom: "15px"
                        }}
                    >
                        <label>
                            Amount (₹)
                        </label>

                        <br />

                        <input
                            type="number"
                            name="amount"
                            value={
                                formData.amount
                            }
                            onChange={
                                handleChange
                            }
                            min="1"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px"
                            }}
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Processing..."
                            : "Pay with Razorpay"}
                    </button>

                </form>


                {message && (
                    <p
                        style={{
                            marginTop: "15px"
                        }}
                    >
                        {message}
                    </p>
                )}

            </div>


            {/* PAYMENT HISTORY */}

            <div
                style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "25px",
                    marginTop: "30px"
                }}
            >

                <h2>
                    Payment History
                </h2>

                {payments.length === 0 ? (

                    <p>
                        No payments yet.
                    </p>

                ) : (

                    <div
                        style={{
                            overflowX: "auto"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse:
                                    "collapse"
                            }}
                        >

                            <thead>

                                <tr>

                                    <th
                                        style={{
                                            textAlign:
                                                "left",
                                            padding:
                                                "12px",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >
                                        Client
                                    </th>

                                    <th
                                        style={{
                                            textAlign:
                                                "left",
                                            padding:
                                                "12px",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >
                                        Amount
                                    </th>

                                    <th
                                        style={{
                                            textAlign:
                                                "left",
                                            padding:
                                                "12px",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >
                                        Status
                                    </th>

                                    <th
                                        style={{
                                            textAlign:
                                                "left",
                                            padding:
                                                "12px",
                                            borderBottom:
                                                "1px solid #ddd"
                                        }}
                                    >
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {payments.map(
                                    (payment) => (

                                        <tr
                                            key={
                                                payment._id
                                            }
                                        >

                                            <td
                                                style={{
                                                    padding:
                                                        "12px"
                                                }}
                                            >
                                                {
                                                    payment.clientName
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "12px"
                                                }}
                                            >
                                                ₹
                                                {Number(
                                                    payment.amount
                                                ).toFixed(2)}
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "12px"
                                                }}
                                            >
                                                {
                                                    payment.status
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "12px"
                                                }}
                                            >

                                                {payment.status ===
                                                    "successful" && (

                                                        <button
                                                            onClick={() =>
                                                                downloadInvoice(
                                                                    payment._id
                                                                )
                                                            }
                                                        >
                                                            Invoice
                                                        </button>

                                                    )}

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Payments;