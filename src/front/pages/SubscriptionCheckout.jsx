import React from "react";

export const SubscriptionCheckout = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const startSubscription = async (plan) => {

        try {
            const response = await fetch(
                `${backendUrl}/stripe/create-subscription-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        plan: plan,
                        lease_id: 1  
                    }),
                }
            );

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Error Stripe:", data);
            }

        } catch (error) {
            console.error("Error conexión:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Selecciona tu plan</h2>

            <button
                className="btn btn-primary m-2"
                onClick={() => startSubscription("monthly")}
            >
                Mensual
            </button>

            <button
                className="btn btn-success m-2"
                onClick={() => startSubscription("quarterly")}
            >
                Trimestral
            </button>

            <button
                className="btn btn-warning m-2"
                onClick={() => startSubscription("semiannual")}
            >
                Semestral
            </button>

            <button
                className="btn btn-dark m-2"
                onClick={() => startSubscription("annual")}
            >
                Anual
            </button>
        </div>
    );
};