"use client";
import React, { useState } from "react";
import styles from "./register.module.css";
import { useNavigate } from "react-router-dom";


export default function RegisterPage() {
  const navigate = useNavigate();
  const [event2Checked, setEvent2Checked] = useState(false);
  const [role, setRole] = useState("");
  const [payNow, setPayNow] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  // states
const [paymentSuccess, setPaymentSuccess] = useState(false);
const [loading, setLoading] = useState(false);
const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    college: "",
    year: "",
  });
   const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const err = {};

    if (!form.name.trim()) err.name = "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.mobile))
      err.mobile = "Enter valid mobile number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Enter valid email";
    if (!form.college.trim()) err.college = "College name required";
    if (!form.year) err.year = "Select year";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

// simulate redirect to payment
const handlePayment = () => {
  setLoading(true);

  // 🔁 Later replace with real payment redirect
  setTimeout(() => {
    setLoading(false);
    setPaymentSuccess(true); // payment success
  }, 2000);
};


  return (
    <div className={styles.container}>
      {/* Astronauts */}
      <div className={styles.astronauts}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={styles.astronaut}>🚀</span>
        ))}
      </div>

      <form className={styles.form}>
        <h1 className={styles.title}>Event Registration</h1>

        {/* Personal Details */}
        <div className={styles.grid}>
      {/* Name */}
      <div className={styles.field}>
  <label>NAME</label>
  <input
    name="name"
    value={form.name}
    placeholder="APPU S"
    onChange={(e) =>
      setForm({ ...form, name: e.target.value.toUpperCase() })
    }
  />
  {errors.name && <span>{errors.name}</span>}
</div>


      {/* Mobile */}
      <div className={styles.field}>
        <label>Mobile Number</label>
        <input
          name="mobile"
          maxLength="10"
          value={form.mobile}
           placeholder="9876543210"
          onChange={handleChange}
        />
        {errors.mobile && <span>{errors.mobile}</span>}
      </div>

      {/* Email */}
      <div className={styles.field}>
        <label>Email ID</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
           placeholder="APPU@GMAIL.COM"
        />
        {errors.email && <span>{errors.email}</span>}
      </div>

      {/* College */}
      <div className={styles.field}>
        <label>College Name</label>
        <input
          name="college"
          value={form.college}
          onChange={handleChange}
          placeholder="ABC ENGINEERING COLLEGE"
        />
        {errors.college && <span>{errors.college}</span>}
      </div>

      {/* Year */}
      <div className={styles.field}>
        <label>Year</label>
        <select
          name="year"
          value={form.year}
          onChange={handleChange}
        >
          <option value="">Select Year</option>
          <option>1st Year</option>
          <option>2nd Year</option>
          <option>3rd Year</option>
          <option>4th Year</option>
          <option>other</option>
        </select>
        {errors.year && <span>{errors.year}</span>}
      </div>
    </div>

        {/* Food */}

      <div className={styles.section}>
  <h3>Events</h3>

  {/* Technical */}
  <div className={styles.eventBox}>
    <h4>Technical</h4>

    <label className={styles.checkCard}>
      <input type="checkbox" />
      <span></span>
      Event 1
    </label>
        <label className={styles.checkCard}>
          <input
            type="checkbox"
            onChange={(e) => setEvent2Checked(e.target.checked)}
          />
          <span></span>
          Event 2 (Team Event)
        </label>

        {event2Checked && (
          <div className={styles.teamBox}>
            <div className={styles.roleGroup}>
              <label className={styles.radioCard}>
                <input
                  type="radio"
                  name="teamRole"
                  onChange={() => setRole("leader")}
                />
                <span></span>
                Team Leader
              </label>

              <label className={styles.radioCard}>
                <input
                  type="radio"
                  name="teamRole"
                  onChange={() => setRole("member")}
                />
                <span></span>
                Team Member
              </label>
            </div>

            {role === "leader" && (
              <div className={styles.teamInputs}>
                <input placeholder="Team Name (Eg: Code Warriors)" />
                <input placeholder="Team Code (Auto Generated)" disabled />
              </div>
            )}

            {role === "member" && (
              <input placeholder="Enter Team Code (Eg: CW1023)" />
            )}
          </div>
        )}
      </div>
  {/* Non Technical */}
            <div className={styles.eventBox}>
              <h4>Non-Technical</h4>

              <label className={styles.checkCard}>
                <input type="checkbox" />
                <span></span>
                Event 1
              </label>

              <label className={styles.checkCard}>
                <input type="checkbox" />
                <span></span>
                Event 2
              </label>
            </div>

            {/* Workshop */}
            <div className={styles.eventBox}>
              <h4>Workshop</h4>

              <label className={styles.checkCard}>
                <input type="checkbox" />
                <span></span>
                Workshop (₹300)
              </label>
            </div>
          </div>
        <div className={styles.section}>
          <h3>Food Preference</h3>
          <div className={styles.radioGroup}>
            <label className={styles.radioCard}>
              <input type="radio" name="food" />
              <span className={styles.customRadio}></span>
              Veg
            </label>

            <label className={styles.radioCard}>
              <input type="radio" name="food" />
              <span className={styles.customRadio}></span>
              Non-Veg
            </label>
          </div>
          </div>

        {/* Payment Section */}
          <div className={styles.section}>
            <h3>Payment</h3>

            {!paymentSuccess ? (
              <button
                type="button"
                className={styles.payBtn}
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? "Redirecting to Payment..." : "Pay Now"}
              </button>
            ) : (
              <div className={styles.paymentSuccess}>
                ✅ Payment Successful
              </div>
            )}
          </div>

          {/* Register Button (ONLY after payment success) */}
         {paymentSuccess && (
  <button
    type="button"
    className={styles.registerBtn}
    onClick={() => setShowPopup(true)}
  >
    Register Now
  </button>
)}

{showPopup && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalBox}>
      <h2>Registration Successful 🎉</h2>
      <p>Confirmation mail has been sent successfully.</p>

      <button
        className={styles.okBtn}
        // onClick={() => router.push("/")}
        onClick={() => navigate('/')}
      >
        OK
      </button>
    </div>
  </div>
)}


          <p className={styles.note}>
            Confirmation email will be sent after successful registration
          </p>
      </form>
    </div>
  );
}
