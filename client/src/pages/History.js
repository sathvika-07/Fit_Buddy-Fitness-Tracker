import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { getMe } from '../utils/API';
import Auth from "../utils/auth";
import { formatDate } from '../utils/dateFormat';
import Header from "../components/Header";
import cardioIcon from "../assets/images/cardio.png";
import resistanceIcon from "../assets/images/resistance.png";

export default function History() {
  const [exerciseData, setExerciseData] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(6);
  const [loading, setLoading] = useState(true);

  const loggedIn = Auth.loggedIn();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = loggedIn ? Auth.getToken() : null;
        if (!token) return;

        const response = await getMe(token);
        const result = await response.json();

        if (!result.success) {
          throw new Error("Failed to fetch user data");
        }

        const user = result.data;

        // ✅ Combine cardio + resistance exercises
        const cardio = user.cardio || [];
        const resistance = user.resistance || [];
        const combined = [...cardio, ...resistance];

        // ✅ Format and sort by date
        const formatted = combined
          .map(item => ({
            ...item,
            date: formatDate(item.date)
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setExerciseData(formatted);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [loggedIn]);

  const showMoreItems = () => {
    setDisplayedItems(prev => prev + 6);
  };

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className='history'>
      <Header />
      <div className="d-flex flex-column align-items-center">
        <h2 className='title'>History</h2>

        {loading ? (
          <p>Loading...</p>
        ) : exerciseData.length ? (
          <div className='history-data'>
            {(() => {
              let lastDateDisplayed = null;

              return exerciseData.slice(0, displayedItems).map((exercise) => {
                const showDate = exercise.date !== lastDateDisplayed;
                lastDateDisplayed = exercise.date;

                return (
                  <div className='history-div d-flex' key={exercise._id}>
                    {showDate && (
                      <div className='date d-flex align-items-center'>{exercise.date}</div>
                    )}
                    <Link className='text-decoration-none' to={`/history/${exercise.type}/${exercise._id}`}>
                      {exercise.type === "cardio" ? (
                        <div className="history-card cardio-title d-flex">
                          <div className='d-flex align-items-center'>
                            <img alt="cardio" src={cardioIcon} className="history-icon" />
                          </div>
                          <div>
                            <p className='history-name'>{exercise.name}</p>
                            <p className='history-index'>{exercise.distance} miles</p>
                          </div>
                        </div>
                      ) : (
                        <div className="history-card resistance-title d-flex">
                          <div className='d-flex align-items-center'>
                            <img alt="resistance" src={resistanceIcon} className="history-icon" />
                          </div>
                          <div>
                            <p className='history-name'>{exercise.name}</p>
                            <p className='history-index'>{exercise.weight} pounds</p>
                          </div>
                        </div>
                      )}
                    </Link>
                  </div>
                );
              });
            })()}

            {exerciseData.length > displayedItems && (
              <div className='d-flex justify-content-center'>
                <button className='show-btn' onClick={showMoreItems}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  Show More
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className='history-text'>No exercise data yet...</h3>
            <Link to="/exercise"><button className='home-btn'>Add Exercise</button></Link>
          </div>
        )}
      </div>
    </div>
  );
}
