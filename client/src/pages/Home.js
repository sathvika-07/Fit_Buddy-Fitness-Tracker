import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../utils/auth";
import Container from "react-bootstrap/Container";
import Header from "../components/Header";

export default function Home() {
  const navigate = useNavigate();
  const loggedIn = Auth.loggedIn();
  const [username, setUsername] = useState("");
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    if (loggedIn) {
      const token = Auth.getToken();
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUsername(decoded.data.username);
    }

    const hasVisited = localStorage.getItem("hasVisited");
    if (hasVisited) {
      setIsFirstVisit(false);
    } else {
      localStorage.setItem("hasVisited", "true");
    }
  }, [loggedIn]);

  return (
    <div className="homepage">
      <Header />
      <Container className="home d-flex flex-column align-items-center justify-content-center flex-wrap text-center">

        {/* Personalized welcome */}
        {loggedIn ? (
          <>
            <h2 className="welcome-message">Welcome back, {username} 👋</h2>
            <p className="home-text">
              Ready to log your next workout? Stay consistent and track your progress every day!
            </p>
            <button className="home-btn" onClick={() => navigate("/exercise")}>Add Exercise</button>
          </>
        ) : (
          <>
            <h1 className="home-title">Your Daily Workout Partner</h1>
            <p className="home-text">
              {isFirstVisit
                ? "Track your daily cardio and resistance workouts. Stay consistent, get stronger, and watch your fitness grow!"
                : "Join FitTrack to monitor your fitness journey and build healthy habits that last."}
            </p>
            <button className="home-btn" onClick={() => navigate("/signup")}>Get Started</button>
          </>
        )}

      </Container>
    </div>
  );
}
