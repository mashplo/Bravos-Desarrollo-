import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PayOut() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <main>
            <h1>Página de Pay Out</h1>
        </main>
    );
}