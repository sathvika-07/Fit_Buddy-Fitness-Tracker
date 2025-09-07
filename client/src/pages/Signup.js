import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { createUser } from "../utils/API";
import Auth from "../utils/auth";
import Header from "../components/Header";

export default function Signup() {
  const loggedIn = Auth.loggedIn();

  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Track individual field errors
  const [errors, setErrors] = useState({});

  // Show backend error alert
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Validate fields and return errors object
  const validateFields = () => {
    const errs = {};

    if (!formState.username.trim()) {
      errs.username = "Username is required";
    }

    if (!formState.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errs.email = "Email is invalid";
    }

    if (!formState.password.trim()) {
      errs.password = "Password is required";
    } else if (formState.password.length < 4) {
      errs.password = "Password must be at least 4 characters";
    }

    return errs;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({ ...formState, [name]: value });

    // Clear error message for the changed field on input
    setErrors((prev) => ({ ...prev, [name]: null }));
    setShowAlert(false); // Hide server alert on typing
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await createUser(formState);
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Signup failed");
        setShowAlert(true);
        return;
      }

      Auth.login(data.token);
    } catch (err) {
      setErrorMessage("Network error or server not responding");
      setShowAlert(true);
    }
  };

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="signup d-flex flex-column align-items-center justify-content-center text-center">
      <Header />
      <form
        onSubmit={handleFormSubmit}
        className="signup-form d-flex flex-column"
        noValidate
      >
        <label htmlFor="username" className="label-required">
          Username
        </label>
        <div className="input-error-wrapper">
          <input
            className="form-input"
            style={{ borderColor: errors.username ? "red" : undefined }}
            value={formState.username}
            placeholder="Your username"
            name="username"
            type="text"
            onChange={handleChange}
          />
          {errors.username && (
            <p className="error-text">{errors.username}</p>
          )}
        </div>

        <label htmlFor="email" className="label-required">
          Email
        </label>
        <div className="input-error-wrapper">
          <input
            className="form-input"
            style={{ borderColor: errors.email ? "red" : undefined }}
            value={formState.email}
            placeholder="youremail@gmail.com"
            name="email"
            type="email"
            onChange={handleChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <label htmlFor="password" className="label-required">
          Password
        </label>
        <div className="input-error-wrapper">
          <input
            className="form-input"
            style={{ borderColor: errors.password ? "red" : undefined }}
            value={formState.password}
            placeholder="********"
            name="password"
            type="password"
            onChange={handleChange}
          />
          {errors.password && (
            <p className="error-text">{errors.password}</p>
          )}
        </div>

        <div className="btn-div">
          <button className="signup-btn mx-auto my-auto">Sign Up</button>
        </div>

        <p className="link-btn">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        {showAlert && <div className="err-message">{errorMessage}</div>}
      </form>
    </div>
  );
}
