import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { loginUser } from "../utils/API";
import Auth from "../utils/auth";
import Header from "../components/Header";

export default function Login() {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loggedIn = Auth.loggedIn();

  // Validation function
  const validateFields = () => {
    const errs = {};

    if (!formState.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errs.email = "Email is invalid *";
    }

    if (!formState.password.trim()) {
      errs.password = "Password is required";
    }

    return errs;
  };

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });

    // Clear individual error on typing
    setErrors((prev) => ({ ...prev, [name]: null }));
    setShowAlert(false);
  };

  // Handle form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await loginUser(formState);
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Login failed. Please try again.");
        setShowAlert(true);
        return;
      }

      Auth.login(data.token);
    } catch (err) {
      console.error(err);
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
        {/* Email */}
        <label htmlFor="email" className="label-required">
          Email
        </label>
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

        {/* Password */}
        <label htmlFor="password" className="label-required">
          Password
        </label>
        <input
          className="form-input"
          style={{ borderColor: errors.password ? "red" : undefined }}
          value={formState.password}
          placeholder="********"
          name="password"
          type="password"
          onChange={handleChange}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}

        {/* Submit Button */}
        <div className="btn-div">
          <button type="submit" className="signup-btn mx-auto my-auto">
            Login
          </button>
        </div>

        {/* Switch to signup */}
        <p className="link-btn">
          New to FitTrack? <Link to="/signup">Create one</Link>
        </p>

        {/* Server error message */}
        {showAlert && <div className="err-message">{errorMessage}</div>}
      </form>
    </div>
  );
}
