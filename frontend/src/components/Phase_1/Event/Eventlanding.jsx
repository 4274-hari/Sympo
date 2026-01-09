import React from "react";
import eventsData from "./eventlist.json";
import styles from "./Eventlanding.module.css";
import capwall from "../../Assets/capwall1.png";
import ironwall from "../../Assets/ironwall2.jpg";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Award,
  BookOpen,
  AlertCircle,
  ArrowLeft,
  Phone,
  ChevronRight,
  Star,
  Trophy,
  Award as CertificateIcon,
  Book,
  Cpu,
  Zap,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Prize from "../Prize/prize";


const Eventlanding = () => {
  const { category, id } = useParams();
  const eventType = { category, id };
  const event = eventsData?.[eventType.category]?.[eventType.id];

  const navigate = useNavigate();

  if (!event) return <p>Event not found</p>;

  // Background logic
  const bgImage = eventType.category === "tech" ? ironwall : capwall;

  // Helper function to render icon based on event category
  const getCategoryIcon = () => {
    switch(eventType.category) {
      case "tech":
        return <Cpu size={20} className={styles.techIcon} />;
      case "nontech":
        return <Book size={20} className={styles.nontechIcon} />;
      case "workshop":
        return <Zap size={20} className={styles.workshopIcon} />;
      default:
        return <Award size={20} />;
    }
  };

  return (
    <section
      className={styles.page}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.overlay}>
        <div className={styles.container}>
          
          {/* Header with back button */}
          <div className={styles.header}>
            <button
              onClick={() => navigate(-1)}
              className={styles.backButton}
            >
              <ArrowLeft size={20} />
              <span>Back to Events</span>
            </button>

            <div className={styles.eventCategory}>
              {getCategoryIcon()}
              <span className={styles.categoryLabel}>
                {eventType.category === "tech" ? "Technical Event" : 
                 eventType.category === "nontech" ? "Non-Technical Event" : "Workshop"}
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            
            {/* Left column */}
            <div className={styles.left}>
              <div className={styles.eventImageContainer}>
                <img
                  src={event.sympoImg}
                  alt={event.title}
                  className={styles.eventImage}
                />
                <div className={styles.imageOverlay}>
                  <div className={styles.eventBadge}>
                    <Star size={16} />
                    <span>Featured Event</span>
                  </div>
                </div>
              </div>

              <div className={styles.eventHeader}>
                <h1>{event.title}</h1>
                <div className={styles.eventMeta}>
                  <span className={styles.eventId}>
                    <Award size={16} />
                    ID: {event.id}
                  </span>
                </div>
              </div>

              <p className={styles.description}>{event.description}</p>

              {/* Quick Info Grid */}
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <Calendar size={20} />
                  </div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Session</span>
                    <span className={styles.infoValue}>{event.session}</span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <Clock size={20} />
                  </div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Time</span>
                    <span className={styles.infoValue}>{event.time}</span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <MapPin size={20} />
                  </div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Venue</span>
                    <span className={styles.infoValue}>{event.place}</span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <Users size={20} />
                  </div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Team Size</span>
                    <span className={styles.infoValue}>{event.teamlimit}</span>
                  </div>
                </div>

                {event.spotRegistration && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <Zap size={20} />
                    </div>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>On-Spot Registration</span>
                      <span className={styles.infoValue}>
                        {event.spotRegistration ? "Available" : "Not Available"}
                      </span>
                    </div>
                  </div>
                )}

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <BookOpen size={20} />
                  </div>
                  <div className={styles.infoContent}>
                    <span className={styles.infoLabel}>Level</span>
                    <span className={styles.infoValue}>
                      {event.prerequisites ? event.prerequisites : "Beginner Friendly"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Information */}
              <div className={styles.detailsSection}>
                <h2>
                  <Trophy size={20} />
                  Event Price
                </h2>
               {/* <Prize /> */}
               <p className="text-center">To Be Announced 🤷‍♂️</p>
              </div>
            </div>

            {/* Right column */}
            <div className={styles.right}>
              {/* Rules */}
              <div className={styles.section}>
                <h2>
                  <AlertCircle size={20} />
                  Rules & Guidelines
                </h2>
                <ul>
                  {event.rules.map((item, i) => (
                    <li key={i}>
                      <ChevronRight size={16} />
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Event Leadership */}
              <div className={styles.leadershipSection}>
                <h2>
                  <Trophy size={20} />
                  Event Coordinators
                </h2>

                {/* Event Leadership */}
                {event.coordinators && event.coordinators.length > 0 && (
                  <div className={styles.leadershipSection}>
                    <div className={styles.leaderGrid}>
                      {event.coordinators.map((leader, i) => (
                        <div key={i} className={styles.leaderCard}>


                          <div className={styles.leaderInfo}>
                            <span className={styles.leaderName}>{leader.name}</span>

                            <div className={styles.contactInfo}>
                              <a href={`tel:${leader.phone}`}>
                                <Phone size={16} />
                                {leader.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Urgent Banner */}
              <div className={styles.urgentBanner}>
                <AlertCircle size={24} />
                <div className={styles.urgentContent}>
                  <h3>Limited Availability</h3>
                  <p>{event.hurryUp}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <button
                  onClick={() => navigate("/register")}
                  className={styles.secondaryButton}
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Eventlanding;