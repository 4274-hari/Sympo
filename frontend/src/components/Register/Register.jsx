import { useEffect, useState } from "react"
import styles from "./register.module.css"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle, Users, User, Sparkles, Clock, AlertCircle, CreditCard } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'

const EVENT_GROUPS = [
  { title: "Technical", mode: "tech", gradient: "from-cyan-500 to-blue-600" },
  { title: "Non-Technical", mode: "non-tech", gradient: "from-emerald-500 to-teal-600" },
  { title: "Workshop", mode: "workshop", gradient: "from-amber-500 to-orange-600" },
]

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
  setTeamCode,
  gradient,
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={styles.eventGroup}>
      <div className={`${styles.groupHeader} bg-gradient-to-r ${gradient}`} onClick={() => setExpanded(!expanded)}>
        <div className={styles.groupInfo}>
          <h3>{title}</h3>
          <span className={styles.eventCount}>{events.length} events</span>
        </div>
        <span className={styles.expandBtn}>{expanded ? "−" : "+"}</span>
      </div>

      {expanded && (
        <div className={styles.eventsGrid}>
          {events.map((event) => {
            const selected = selectedEvents.some((s) => s.event_name === event.event_name)
            const hurryUp = isHurryUp(event)
            const full = isFull(event)

            return (
              <div
                key={event.event_name}
                className={`${styles.eventCard} ${selected ? styles.selected : ""} ${full ? styles.disabled : ""}`}
              >
                <div className={styles.eventHeader}>
                  <div className={styles.eventTitle}>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleEvent(event)}
                      disabled={full}
                      id={`evt-${event.event_name}`}
                      className={styles.checkbox}
                    />
                    <label htmlFor={`evt-${event.event_name}`}>
                      <span className={styles.eventName}>{event.event_name}</span>
                    </label>
                  </div>

                  <div className={styles.badges}>
                    {full && <span className={styles.fullBadge}>Slot Full</span>}
                    {hurryUp && !full && (
                      <span className={styles.hurryBadge}>
                        <Clock size={12} /> {event.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.eventMeta}>
                  <span className={styles.metaItem}>
                    {event.event_type === "team" ? <Users size={14} /> : <User size={14} />}
                    {event.event_type === "team" ? "Team Event" : "Solo Event"}
                  </span>
                  <span
                    className={`${styles.sessionBadge} ${
                      event.isBoth ? styles.multiSession : styles.singleSession
                    }`}
                  >
                    {event.isBoth ? "2 Sessions" : "Single Session"}
                  </span>
                  {event.event_mode === "workshop" && (
                    <span className={`${styles.priceTag} bg-gradient-to-r ${gradient}`}>₹300</span>
                  )}
                </div>

                {selected && event.event_type === "team" && (
                  <div className={styles.teamConfig}>
                    <div className={styles.roleToggle}>
                      <button
                        type="button"
                        className={teamData[event.event_name]?.role === "leader" ? styles.active : ""}
                        onClick={() => setTeamRole(event.event_name, "leader")}
                      >
                        Team Leader
                      </button>
                      <button
                        type="button"
                        className={teamData[event.event_name]?.role === "member" ? styles.active : ""}
                        onClick={() => setTeamRole(event.event_name, "member")}
                      >
                        Team Member
                      </button>
                    </div>

                    {teamData[event.event_name]?.role === "leader" && (
                      <div className={styles.teamInputs}>
                        <input
                          type="text"
                          placeholder="Team Name"
                          value={teamData[event.event_name]?.teamName || ""}
                          onChange={(e) => setTeamName(event.event_name, e.target.value)}
                        />
                      </div>
                    )}

                    {teamData[event.event_name]?.role === "member" && (
                      <div className={styles.teamInputs}>
                        <input
                          type="text"
                          placeholder="Enter Team Code"
                          value={teamData[event.event_name]?.teamCode || ""}
                          onChange={(e) => setTeamCode(event.event_name, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])

  const [selectedEvents, setSelectedEvents] = useState([])
  const [teamData, setTeamData] = useState({})
  const [totalAmount, setTotalAmount] = useState(0)
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    college: "",
    year: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [food, setFood] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responce = await axios.get('/api/events/live_slots');

        setEvents(responce.data.events)
        
      } catch (error) {
        console.error("Error fetching events details", error);
      }
    }

    fetchData();
  }, [])

  const doBarrelRoll = () => {
    document.body.classList.add("do-barrel-roll");
    new Audio("/thanku.mp3").play();


    // remove class after animation so it can run again if needed
    setTimeout(() => {
      document.body.classList.remove("do-barrel-roll");
    }, 1000);
  };

  const isSoloOnlyEvent = (event) => {
    return (
      event.event_mode === "workshop" ||
      event.event_name.toLowerCase().includes("hackquest")
    );
  };

  const isSingleSessionEvent = (event) => !event.isBoth;
  const isMultiSessionEvent = (event) => event.isBoth;

  const getSelectedSessions = () => {
    return selectedEvents
      .map(e => teamData[e.event_name]?.session)
      .filter(Boolean);
  };

  const calculateAmount = (selectedArr) => {
    let hasTech = false
    let hasNonTech = false
    let workshopCount = 0

    selectedArr.forEach((e) => {
      if (e.event_mode === "tech") hasTech = true
      if (e.event_mode === "non-tech") hasNonTech = true
      if (e.event_mode === "workshop") workshopCount++
    })

    let amount = 0
    if (hasTech || hasNonTech) amount += 200
    amount += workshopCount * 300

    return amount
  }

  const validate = () => {
    const err = {}

    if (!form.name.trim()) err.name = "Name is required"
    if (!form.mobile) {
      err.mobile = "Mobile number is required"
    } else if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      err.mobile = "Enter a valid 10-digit mobile number"
    }
    if (!form.email) {
      err.email = "Email is required"
    } else if (!/^[a-zA-Z0-9._%+-]+@(gmail\.com|.*\.edu\.in)$/.test(form.email)) {
      err.email = "Only gmail.com or *.edu.in emails are allowed"
    }
    if (!form.college.trim()) err.college = "College name is required"
    if (!form.year) err.year = "Select your year"

    setErrors(err)
    const firstError = Object.values(err)[0]

    return Object.keys(err).length === 0
  }

  const isHurryUp = (event) => event.status === "HURRY_UP";

  const isFull = (event) => event.status === "FULL" || event.remainingSlots === 0

  const canSelectEvent = (event) => {
    const selected = selectedEvents;

    const hasSoloOnly = selected.some((e) => isSoloOnlyEvent(e));
    const selectingSoloOnly = isSoloOnlyEvent(event);

    if (isFull(event)) return "This event is already full";

    if (selectingSoloOnly && selected.length > 0) {
      return "Workshop / HackQuest must be selected alone";
    }

    if (!selectingSoloOnly && hasSoloOnly) {
      return "Workshop / HackQuest must be selected alone";
    }

    if (selected.length >= 2) {
      return "You can select only 2 events at once";
    }

    const selectedSessions = getSelectedSessions();

    if (event.isBoth && selectedSessions.length === 1) {
      // Allow selection, but radio button will restrict session choice
      return null;
    }

    if (selected.length === 1) {
      const firstEvent = selected[0];

      // If first is single-session, second must be multi-session
      if (
        (isSingleSessionEvent(firstEvent) &&
        isSingleSessionEvent(event)) ||
        (isMultiSessionEvent(firstEvent) &&
        isMultiSessionEvent(event))
      ) {
        return "If you choose a single-session event, the second event must be a 2-session event";
      }
    }

    return null;
  };

  const toggleEvent = (event) => {
    const alreadySelected = selectedEvents.some((e) => e.event_name === event.event_name)
    if (alreadySelected) {
      const updated = selectedEvents.filter((e) => e.event_name !== event.event_name)
      setSelectedEvents(updated)
      setTeamData((prev) => {
        const copy = { ...prev }
        delete copy[event.event_name]
        return copy
      })
      setTotalAmount(calculateAmount(updated))
      setPaymentSuccess(false)
      return
    }

    const err = canSelectEvent(event);
    if (err) {
      toast.info(err, {
        icon: "⚠️",
      });
      return;
    }

    const updated = [...selectedEvents, event]
    setSelectedEvents(updated)
    setTotalAmount(calculateAmount(updated))
    setPaymentSuccess(false)
  }

  const setTeamRole = (eventName, role) => {
    setTeamData((prev) => ({ ...prev, [eventName]: { ...(prev[eventName] || {}), role } }))
  }

  const setTeamName = (eventName, teamName) => {
    setTeamData((prev) => ({ ...prev, [eventName]: { ...(prev[eventName] || {}), teamName } }))
  }

  const setTeamCode = (eventName, teamCode) => {
    setTeamData((prev) => ({ ...prev, [eventName]: { ...(prev[eventName] || {}), teamCode } }))
  }

  const yearMap = {
    "1st Year": 1,
    "2nd Year": 2,
    "3rd Year": 3,
    "4th Year": 4
  }

  const buildRegistrationData = () => ({
    name: form.name,
    college: form.college,
    email: form.email,
    food: food,
    phone: form.mobile,
    student_year: yearMap[form.year],
    registration_mode: "online",

    events: selectedEvents.map((event) => {
      const team = teamData[event.event_name];

      return {
        event_name: event.event_name,
        ...(event.isBoth && { session: team.session }),

        ...(event.event_type === "team" && {
          role: team?.role === "leader" ? "lead" : "member",
          ...(team?.role === "leader" && { team_name: team.teamName }),
          ...(team?.role === "member" && { team_code: team.teamCode }),
        }),
      };
    }),
  });


  const handleRegisterAndPay = async () => {
    try {
      if (!validate()) return;

      if (!food) {
        toast.warn("Please select food preference");
        return;
      }

      for (const event of selectedEvents) {
        if (event.event_type === "team") {
          const team = teamData[event.event_name];

          if (!team || !team.role) {
            toast.error(`Select team role for ${event.event_name}`);
            return;
          }

          if (team.role === "leader" && !team.teamName?.trim()) {
            toast.error(`Enter team name for ${event.event_name}`);
            return;
          }

          if (team.role === "member" && !team.teamCode?.trim()) {
            toast.error(`Enter team code for ${event.event_name}`);
            return;
          }
        }
      }

      // BEFORE create_order
      await axios.post("/api/reserve-slots", {
        email: form.email,
        registration_mode: "online",
        events: buildRegistrationData().events
      });

      setLoading(true);
      setIsPaying(true);

      const res = await axios.post(
        "/api/create_order",
        {
          email: form.email,
          events: selectedEvents.map(e => ({
            event_name: e.event_name
          }))
        }
      );

      if (!res.data.success) {
        // release reservation if order creation fails
        await axios.post("/api/release-reservation", {
          email: form.email
        });

        toast.error("Order creation failed");
        setLoading(false);
        setIsPaying(false);
        return;
      }

      openRazorpayCheckout(res.data.order, res.data.amount);

    } catch (err) {
      console.error(err);
      try {
        await axios.post("/api/release-reservation", {
          email: form.email
        });
      } catch (_) {}

      toast.error(
        err.response?.data?.message || "Unable to proceed with payment"
      );
      setLoading(false);
      setIsPaying(false)
    }
  };


  const openRazorpayCheckout = (order, amount) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // 🔑 Razorpay Key ID
      amount: order.amount,
      currency: "INR",
      name: "Sync Up 2k25",
      description: `Cognebula'26 Registration Fee ₹${amount}`,
      order_id: order.id,

      handler: async function (response) {
        await verifyPayment(response);
      },

      prefill: {
        name: form.name,
        email: form.email,
        contact: form.mobile,
      },

      modal: {
        ondismiss: async () => {
          await axios.post("/api/release-reservation", {
            email: form.email
          });
          toast.info("Payment cancelled. Reservation released.");
          setIsPaying(false)
        }
      },

      theme: {
        color: "#6a1b9a",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  const verifyPayment = async (paymentResponse) => {
    try {
      const res = await axios.post(
        "/api/verify",
        {
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }
      );

      if (res.data.success) {
        setPaymentSuccess(true);
        toast.success("Payment successful 🎉");
      } else {
        toast.error("Payment verification failed");
      }

    } catch (err) {
      console.error(err);
      toast.error("Payment verification error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {

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

    const data = buildRegistrationData();

    setLoading(true);

    try {
      const response = await axios.post("/api/register", data,{
        responseType: "blob" 
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/pdf"
        });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "COGNEBULA_Receipt.pdf";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        doBarrelRoll();
        setTimeout(() => setShowPopup(true), 400);
      }

    } catch (error) {
      console.error("Error register", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <div className={styles.container} style={{ background: "transparent" }}>
        <div className="hidden lg:block absolute top-8 right-4 z-20 pointer-events-none">
          <div className="
            flex items-center gap-3
            px-5 py-3
            rounded-full
            bg-gradient-to-r from-[#2a103d]/80 to-[#1a0a1f]/80
            backdrop-blur-xl
            border border-red-400/30
            shadow-[0_0_30px_rgba(239,68,68,0.25)]
          ">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>

            <p className="text-sm text-[#E9DDFF]">
              <span className="font-semibold text-red-400 uppercase">No on-spot registration</span>
              {/* <span className="opacity-70"> for Cognebula 2026</span> */}
            </p>
          </div>
        </div>
        <div className={styles.header}>
          <div className="flex justify-between">
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              Back
            </button>
            <div className="lg:hidden block top-8 right-4 z-20 pointer-events-none">
              <div className="
                flex items-center gap-3
                px-5 py-3
                rounded-full
                bg-gradient-to-r from-[#2a103d]/80 to-[#1a0a1f]/80
                backdrop-blur-xl
                border border-red-400/30
                shadow-[0_0_30px_rgba(239,68,68,0.25)]
              ">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>

                <p className="text-[10px] text-[#E9DDFF]">
                  <span className="font-semibold text-red-400 uppercase">No on-spot registration</span>
                  {/* <span className="opacity-70"> for Cognebula 2026</span> */}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.headerContent}>
            <h1>Event Registration</h1>
            <p>Sync Up Cognebula'26</p>
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
          toastClassName="glass-toast"
          progressClassName="glass-progress"
        />

        <div className={styles.layout}>
          <div className={styles.mainSection}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Sparkles size={24} className={styles.headerIcon} />
                <h2>Personal Information</h2>
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })}
                    placeholder="Enter your full name"
                    className={errors.name ? styles.inputError : ""}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "")
                      if (value.length <= 10) setForm({ ...form, mobile: value })
                    }}
                    placeholder="10-digit mobile number"
                    className={errors.mobile ? styles.inputError : ""}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase() })}
                    placeholder="your.email@gmail.com"
                    className={errors.email ? styles.inputError : ""}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>College Name</label>
                  <input
                    type="text"
                    value={form.college}
                    onChange={(e) => setForm({ ...form, college: e.target.value })}
                    placeholder="Enter your college name"
                    className={errors.college ? styles.inputError : ""}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Year of Study</label>
                  <select
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className={errors.year ? styles.inputError : ""}
                  >
                    <option value="">Select Year</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Users size={24} className={styles.headerIcon} />
                <h2>Select Events</h2>
              </div>
              <div className={styles.eventsContainer}>
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
                    gradient={group.gradient}
                    getSelectedSessions={getSelectedSessions}
                    setTeamData={setTeamData}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.summaryCard}>
              <h3>Order Summary</h3>

              <div className={styles.summaryItems}>
                {selectedEvents.length === 0 ? (
                  <p className={styles.emptyState}>No events selected</p>
                ) : (
                  selectedEvents.map((event) => (
                    <div key={event.event_name} className={styles.summaryItem}>
                      <span>{event.event_name}</span>
                      <span className={styles.price}>{event.event_mode === "workshop" ? "₹ 300" : ""}</span>
                    </div>
                  ))
                )}
              </div>

              <div className={styles.divider}></div>

              <div className={styles.foodPreference}>
                <label>Food Preference</label>
                <div className={styles.foodOptions}>
                  <button type="button" className={food === "veg" ? styles.active : ""} onClick={() => setFood("veg")}>
                    Vegetarian
                  </button>
                  <button
                    type="button"
                    className={food === "nonveg" ? styles.active : ""}
                    onClick={() => setFood("nonveg")}
                  >
                    Non-Veg
                  </button>
                </div>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.total}>
                <span>Total Amount</span>
                <span className={styles.totalAmount}>₹{totalAmount}</span>
              </div>

              {!paymentSuccess ? (
                <button
                  className={styles.registerBtn}
                  onClick={handleRegisterAndPay}
                  disabled={isPaying || selectedEvents.length === 0}
                >
                  {isPaying ? (
                    "Processing Payment..."
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CreditCard size={18} /> Pay Now
                    </span>
                  )}
                </button>
              ) : (
                <button
                  className={styles.registerBtn}
                  style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? "Completing..." : "Complete Registration"}
                </button>
              )}
            </div>

            <div className={styles.infoCard}>
              <div className="flex items-center gap-4 text-red-400">
                <AlertCircle size={20} />
                <h4>Important Notes</h4>
              </div>
              <ul>
                <li>Maximum 2 events per participant</li>
                <li>2nd event participation is based on time availability</li>
                <li>Workshop / Hack Quest must be selected alone</li>
                <li>Food preference is mandatory</li>
                <li>Team codes are required for team events <br />(Team code will be mailed to Tead Leader)</li>
              </ul>
            </div>
          </div>
        </div>

        {showPopup && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <CheckCircle size={80} className={styles.successIcon} />
                  <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">Registration Confirmed!</h2>
              <p className="text-slate-300">You have successfully registered for Cognebula'26.</p>
              <p className={styles.modalDesc}>Check your email for the confirmation and Food Pass.</p>
              <button className={styles.modalBtn} onClick={() => navigate("/")}>
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}