// "use client";
import React, { useState } from "react";
import styles from "./register.module.css";
import { useNavigate } from "react-router-dom";
import hari from "./hariback.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EVENT_GROUPS = [
  { title: "Technical", mode: "tech" },
  { title: "Non-Technical", mode: "non-tech" },
  { title: "Workshop", mode: "workshop" },
];

// Event Group Component
function EventGroupCard({ 
  title, 
  events, 
  selectedEvents, 
  toggleEvent, 
  isFull, 
  isHurryUp,
  teamData,
  setTeamRole,
  setTeamName,
  setTeamCode 
}) {
  const [expanded, setExpanded] = useState(true);
  const icon = title === "Technical" ? "⚡" : title === "Non-Technical" ? "🎭" : "🔧";

  return (
    <div className={`${styles.eventGroupCard} ${expanded ? styles.expanded : ''}`}>
      <div className={styles.groupHeader} onClick={() => setExpanded(!expanded)}>
        <div className={styles.groupTitle}>
          <span className={styles.groupIcon}>{icon}</span>
          <h3>{title} Events</h3>
          <span className={styles.groupBadge}>{events.length} events</span>
        </div>
        <span className={styles.expandIcon}>{expanded ? '−' : '+'}</span>
      </div>
      
      {expanded && (
        <div className={styles.eventsList}>
          {events.map((event) => {
            const selected = selectedEvents.some((s) => s.event_name === event.event_name);
            const radioGroupName = `role-${event.event_name.replace(/\s+/g, "-")}`;
            const hurryUp = isHurryUp(event);
            const full = isFull(event);

            return (
              <div key={event.event_name} className={`${styles.eventCard} ${selected ? styles.selected : ''} ${full ? styles.full : ''}`}>
                <div className={styles.eventCardHeader}>
                  <div className={styles.eventCheckbox}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleEvent(event)}
                      disabled={full}
                      id={`event-${event.event_name}`}
                    />
                    <label htmlFor={`event-${event.event_name}`}>
                      <span className={styles.eventName}>{event.event_name}</span>
                      <span className={styles.eventPrice}>
                        {event.event_mode === "workshop" ? "₹300" : "₹200"}
                      </span>
                    </label>
                  </div>
                  
                  <div className={styles.eventStatus}>
                    {full && <span className={styles.fullBadge}>FULL</span>}
                    {hurryUp && !full && <span className={styles.hurryBadge}>🔥 Hurry!</span>}
                    <span className={styles.eventType}>{event.event_type === "team" ? "👥 Team" : "👤 Solo"}</span>
                  </div>
                </div>

                {selected && event.event_type === "team" && (
                  <div className={styles.teamSection}>
                    <div className={styles.roleSelector}>
                      <label className={styles.radioOption}>
                        <input
                          type="radio"
                          name={radioGroupName}
                          checked={teamData[event.event_name]?.role === "leader"}
                          onChange={() => setTeamRole(event.event_name, "leader")}
                        />
                        <span className={styles.radioCustom}></span>
                        <span className={styles.roleLabel}>Team Leader</span>
                      </label>
                      
                      <label className={styles.radioOption}>
                        <input
                          type="radio"
                          name={radioGroupName}
                          checked={teamData[event.event_name]?.role === "member"}
                          onChange={() => setTeamRole(event.event_name, "member")}
                        />
                        <span className={styles.radioCustom}></span>
                        <span className={styles.roleLabel}>Team Member</span>
                      </label>
                    </div>

                    {teamData[event.event_name]?.role === "leader" && (
                      <div className={styles.leaderInputs}>
                        <div className={styles.inputField}>
                          <label>Team Name</label>
                          <input
                            type="text"
                            placeholder="e.g., Code Warriors"
                            value={teamData[event.event_name]?.teamName || ""}
                            onChange={(e) => setTeamName(event.event_name, e.target.value)}
                          />
                        </div>
                        <div className={styles.inputField}>
                          <label>Team Code (Auto-generated)</label>
                          <input
                            type="text"
                            value={teamData[event.event_name]?.teamCode || `T-${Math.random().toString(36).slice(2, 7).toUpperCase()}`}
                            readOnly
                            className={styles.autoField}
                          />
                        </div>
                      </div>
                    )}

                    {teamData[event.event_name]?.role === "member" && (
                      <div className={styles.memberInputs}>
                        <div className={styles.inputField}>
                          <label>Enter Team Code</label>
                          <input
                            type="text"
                            placeholder="e.g., T-ABC123"
                            value={teamData[event.event_name]?.teamCode || ""}
                            onChange={(e) => setTeamCode(event.event_name, e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selected && event.description && (
                  <div className={styles.eventDescription}>
                    <p>{event.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Payment Summary Component
function PaymentSummary({ selectedEvents, totalAmount, paymentSuccess, loading, handlePayment, food, setFood }) {
  const hasTech = selectedEvents.some(e => e.event_mode === "tech");
  const hasNonTech = selectedEvents.some(e => e.event_mode === "non-tech");
  const workshops = selectedEvents.filter(e => e.event_mode === "workshop");

  return (
    <div className={styles.paymentCard}>
      <div className={styles.paymentHeader}>
        <h3>Payment Summary</h3>
        <div className={styles.totalAmount}>
          <span>Total</span>
          <span className={styles.amount}>₹{totalAmount}</span>
        </div>
      </div>

      <div className={styles.breakdown}>
        <div className={styles.breakdownItem}>
          <span>Technical/Non-Technical Events</span>
          <span>{(hasTech || hasNonTech) ? "₹200" : "₹0"}</span>
        </div>
        {workshops.map((workshop, index) => (
          <div key={index} className={styles.breakdownItem}>
            <span>{workshop.event_name}</span>
            <span>₹300</span>
          </div>
        ))}
      </div>

      <div className={styles.foodSection}>
        <h4>Food Preference</h4>
        <div className={styles.foodOptions}>
          <label className={styles.foodOption}>
            <input
              type="radio"
              name="food"
              value="veg"
              checked={food === "veg"}
              onChange={() => setFood("veg")}
            />
            <span className={styles.foodRadio}></span>
            <span className={styles.foodLabel}>Vegetarian</span>
          </label>
          <label className={styles.foodOption}>
            <input
              type="radio"
              name="food"
              value="nonveg"
              checked={food === "nonveg"}
              onChange={() => setFood("nonveg")}
            />
            <span className={styles.foodRadio}></span>
            <span className={styles.foodLabel}>Non-Vegetarian</span>
          </label>
        </div>
      </div>

      {!paymentSuccess ? (
        <button
          className={styles.payButton}
          onClick={handlePayment}
          disabled={selectedEvents.length === 0 || loading}
        >
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Processing...
            </>
          ) : selectedEvents.length === 0 ? (
            "Select Events to Pay"
          ) : (
            `Pay ₹${totalAmount}`
          )}
        </button>
      ) : (
        <div className={styles.paymentSuccess}>
          <div className={styles.successIcon}>✓</div>
          <div className={styles.successText}>
            <h4>Payment Successful!</h4>
            <p>You can now complete your registration</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const events = hari.events || [];

  // UI & selection state
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [teamData, setTeamData] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [activeTab, setActiveTab] = useState("events");

  // form + payment
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    college: "",
    year: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [food, setFood] = useState("");

  // Helpers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculateAmount = (selectedArr) => {
    let hasTech = false;
    let hasNonTech = false;
    let workshopCount = 0;

    selectedArr.forEach((e) => {
      if (e.event_mode === "tech") hasTech = true;
      if (e.event_mode === "non-tech") hasNonTech = true;
      if (e.event_mode === "workshop") workshopCount++;
    });

    let amount = 0;
    if (hasTech || hasNonTech) amount += 200;
    amount += workshopCount * 300;

    return amount;
  };

  const validate = () => {
    const err = {};

    if (!form.name.trim()) err.name = "Name is required";
    if (!form.mobile) {
      err.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      err.mobile = "Enter a valid 10-digit mobile number";
    }
    if (!form.email) {
      err.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|.*\.edu\.in)$/.test(form.email)) {
      err.email = "Only gmail.com or *.edu.in emails are allowed";
    }
    if (!form.college.trim()) err.college = "College name is required";
    if (!form.year) err.year = "Select your year";

    setErrors(err);
    const firstError = Object.values(err)[0];
    if (firstError) toast.error(firstError);

    return Object.keys(err).length === 0;
  };

  const isHurryUp = (event) => {
    if (!event.onlineSlots || event.onlineSlots === 0) return false;
    const percentageLeft = (event.onlineRemaining / event.onlineSlots) * 100;
    return percentageLeft <= 30;
  };

  const isFull = (event) => event.status === "FULL" || event.remainingSlots === 0;

  const canSelectEvent = (event) => {
    const selected = selectedEvents;
    const hasWorkshop = selected.some((e) => e.event_mode === "workshop");
    const hasHackQuest = selected.some((e) => e.event_name === "HackQuest");

    const techCount = selected.filter((e) => e.event_mode === "tech").length;
    const nonTechCount = selected.filter((e) => e.event_mode === "non-tech").length;

    if (isFull(event)) return "This event is already full";
    if (event.event_mode === "workshop" && selected.length > 0) return "Workshop must be selected alone";
    if (hasWorkshop) return "You cannot select other events with Workshop";
    if (event.event_name === "HackQuest" && selected.length > 0) return "HackQuest must be selected alone";
    if (hasHackQuest) return "You cannot select other events with HackQuest";
    if (selected.length >= 2) return "You can select only 2 events";
    if (event.event_mode === "tech" && techCount >= 2) return "Only 2 technical events allowed";
    if (event.event_mode === "non-tech" && nonTechCount >= 2) return "Only 2 non-technical events allowed";

    return null;
  };

  const toggleEvent = (event) => {
    const alreadySelected = selectedEvents.some((e) => e.event_name === event.event_name);
    if (alreadySelected) {
      const updated = selectedEvents.filter((e) => e.event_name !== event.event_name);
      setSelectedEvents(updated);
      setTeamData((prev) => {
        const copy = { ...prev };
        delete copy[event.event_name];
        return copy;
      });
      setTotalAmount(calculateAmount(updated));
      toast.info(`${event.event_name} removed`);
      return;
    }

    const err = canSelectEvent(event);
    if (err) {
      toast.error(err);
      return;
    }

    const updated = [...selectedEvents, event];
    setSelectedEvents(updated);
    setTotalAmount(calculateAmount(updated));

    if (event.event_mode === "workshop") {
      toast.success(`${event.event_name} added — ₹300`);
    } else if (event.event_mode === "tech" || event.event_mode === "non-tech") {
      toast.success(`${event.event_name} added — Tech/Non-Tech price applies (₹200)`);
    } else {
      toast.success(`${event.event_name} selected`);
    }
  };

  const setTeamRole = (eventName, role) => {
    setTeamData((prev) => ({ ...prev, [eventName]: { ...(prev[eventName] || {}), role } }));
  };

  const setTeamName = (eventName, teamName) => {
    setTeamData((prev) => ({ ...prev, [eventName]: { ...(prev[eventName] || {}), teamName } }));
  };

  const setTeamCode = (eventName, teamCode) => {
    setTeamData((prev) => ({ ...prev, [eventName]: { ...(prev[eventName] || {}), teamCode } }));
  };

  const handlePayment = () => {
    if (selectedEvents.length === 0) {
      toast.warn("Select at least one event before payment");
      return;
    }
    setTotalAmount(calculateAmount(selectedEvents));
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaymentSuccess(true);
      toast.success("Payment successful!");
    }, 1500);
  };

  const handleRegister = () => {
    if (!paymentSuccess) {
      toast.warn("Please complete payment before registering.");
      return;
    }

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (selectedEvents.length === 0) {
      toast.warn("Please select at least one event");
      return;
    }

    if (!food) {
      toast.warn("Please select a food preference");
      return;
    }

    for (const se of selectedEvents) {
      if (se.event_type === "team") {
        const td = teamData[se.event_name];
        if (!td || !td.role) {
          toast.warn(`Please choose role (Leader/Member) for "${se.event_name}".`);
          return;
        }
        if (td.role === "leader" && (!td.teamName || !td.teamName.trim())) {
          toast.warn(`As Team Leader for "${se.event_name}" provide Team Name.`);
          return;
        }
        if (td.role === "member" && (!td.teamCode || !td.teamCode.trim())) {
          toast.warn(`As Team Member for "${se.event_name}" provide Team Code.`);
          return;
        }
      }
    }

    console.log("Register payload:", { form, selectedEvents, teamData, totalAmount, food });
    setShowPopup(true);
  };

  return (
    <div className={styles.registerContainer}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className={styles.headerTitle}>
          <h1>Event Registration</h1>
          <p>Sync up 2k25 • Official Registration Portal</p>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2500} theme="dark" />

      {/* Main Content - Split Layout */}
      <div className={styles.mainContent}>
        {/* Left Column - Registration Form */}
        <div className={styles.leftColumn}>
          {/* Tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "details" ? styles.active : ''}`}
              onClick={() => setActiveTab("details")}
            >
              <span className={styles.tabIcon}>👤</span>
              Personal Details
            </button>
            <button
              className={`${styles.tab} ${activeTab === "events" ? styles.active : ''}`}
              onClick={() => setActiveTab("events")}
            >
              <span className={styles.tabIcon}>🎯</span>
              Select Events
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === "details" ? (
              <div className={styles.detailsForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })}
                      placeholder="Enter your full name"
                      className={errors.name ? styles.error : ''}
                    />
                    {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                  </div>

                  <div className={styles.formField}>
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={form.mobile}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) setForm({ ...form, mobile: value });
                      }}
                      placeholder="10-digit mobile number"
                      className={errors.mobile ? styles.error : ''}
                    />
                    {errors.mobile && <span className={styles.fieldError}>{errors.mobile}</span>}
                  </div>

                  <div className={styles.formField}>
                    <label>Email ID *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase() })}
                      placeholder="example@gmail.com or *.edu.in"
                      className={errors.email ? styles.error : ''}
                    />
                    {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                  </div>

                  <div className={styles.formField}>
                    <label>College Name *</label>
                    <input
                      type="text"
                      name="college"
                      value={form.college}
                      onChange={handleChange}
                      placeholder="Enter your college name"
                      className={errors.college ? styles.error : ''}
                    />
                    {errors.college && <span className={styles.fieldError}>{errors.college}</span>}
                  </div>

                  <div className={styles.formField}>
                    <label>Year of Study *</label>
                    <select
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      className={errors.year ? styles.error : ''}
                    >
                      <option value="">Select Year</option>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                      <option>Other</option>
                    </select>
                    {errors.year && <span className={styles.fieldError}>{errors.year}</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.eventsSelection}>
                {EVENT_GROUPS.map((group) => (
                  <EventGroupCard
                    key={group.mode}
                    title={group.title}
                    events={events.filter((e) => e.event_mode === group.mode)}
                    selectedEvents={selectedEvents}
                    toggleEvent={toggleEvent}
                    isFull={isFull}
                    isHurryUp={isHurryUp}
                    teamData={teamData}
                    setTeamRole={setTeamRole}
                    setTeamName={setTeamName}
                    setTeamCode={setTeamCode}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Selected Events Summary */}
          {selectedEvents.length > 0 && (
            <div className={styles.selectedEvents}>
              <h4>Selected Events ({selectedEvents.length})</h4>
              <div className={styles.selectedList}>
                {selectedEvents.map((event) => (
                  <div key={event.event_name} className={styles.selectedItem}>
                    <span>{event.event_name}</span>
                    <span className={styles.eventPriceTag}>
                      {event.event_mode === "workshop" ? "₹300" : "₹200"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Payment & Summary */}
        <div className={styles.rightColumn}>
          <PaymentSummary
            selectedEvents={selectedEvents}
            totalAmount={totalAmount}
            paymentSuccess={paymentSuccess}
            loading={loading}
            handlePayment={handlePayment}
            food={food}
            setFood={setFood}
          />

          {/* Register Button */}
          {paymentSuccess && (
            <button className={styles.registerButton} onClick={handleRegister}>
              Complete Registration
            </button>
          )}

          {/* Rules & Info */}
          <div className={styles.infoCard}>
            <h4>Registration Rules</h4>
            <ul>
              <li>✓ Max 2 events per participant</li>
              <li>✓ Workshops must be selected alone</li>
              <li>✓ Technical/Non-technical combo allowed</li>
              <li>✓ Team events require role selection</li>
              <li>✓ Food preference is mandatory</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showPopup && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalIcon}>🎉</div>
            <h2>Registration Successful!</h2>
            <p>Your registration has been confirmed. A confirmation email has been sent to {form.email}.</p>
            <p className={styles.modalNote}>Keep your payment receipt and team codes handy.</p>
            <button
              className={styles.modalButton}
              onClick={() => {
                setShowPopup(false);
                navigate("/");
              }}
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}