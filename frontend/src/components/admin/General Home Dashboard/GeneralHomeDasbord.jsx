import React, { useEffect, useState } from "react";
import styles from "./General.module.css";

const Gauge = ({ vegCount, nonVegCount }) => {
  const total = vegCount + nonVegCount;
  const r = 90;
  const semiLen = Math.PI * r;
  const vegLen = total ? (vegCount / total) * semiLen : 0;
  const nonLen = total ? (nonVegCount / total) * semiLen : 0;
  const vegAngle = total ? (vegCount / total) * 180 : 0;
  const needleAngle = vegAngle - 90;

  const pathD = `M 10 ${100} A ${r} ${r} 0 0 1 ${190} ${100}`;

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <svg
        viewBox="0 0 200 120"
        className={styles.svgGauge}
        preserveAspectRatio="xMidYMid meet"
      >
        <path d={pathD} className={styles.gaugeBg} />
        <path
          d={pathD}
          className={styles.gaugeVeg}
          style={{
            strokeDasharray: `${vegLen} ${semiLen}`,
            strokeDashoffset: 0,
          }}
        />
        <path
          d={pathD}
          className={styles.gaugeNonVeg}
          style={{
            strokeDasharray: `${nonLen} ${semiLen}`,
            strokeDashoffset: -vegLen,
          }}
        />
        <g transform={`translate(100,100)`}>
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-72"
            className={styles.gaugeNeedle}
            style={{ transform: `rotate(${needleAngle}deg)` }}
          />
        </g>
      </svg>
    </div>
  );
};

const Speedometer = ({ vegCount, nonVegCount }) => {
  return (
    <div className={styles.speedometerLayout}>
  <div className={styles.speedometerLeft}>
    <Gauge vegCount={vegCount} nonVegCount={nonVegCount} />
  </div>

  <div className={styles.speedometerRight}>
    <div className={styles.foodRow}>
      <div className={styles.foodStat}>
        <span className={styles.vegDot} />
        <span>Veg: {vegCount}</span>
      </div>

      <div className={styles.foodStat}>
        <span className={styles.nonVegDot} />
        <span>Non-Veg: {nonVegCount}</span>
      </div>
    </div>

    <div className={styles.foodTotal}>
      Total: {vegCount + nonVegCount}
    </div>
  </div>
</div>

  );
};

const GeneralHome = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRegistrations: 0,
    totalFoodCount: 0,
    vegCount: 0,
    nonVegCount: 0,
    topColleges: [],
    yearWiseCount: {},
    sessionCounts: { morning: 0, evening: 0 },
  });

  const mockData = {
    totalRegistrations: 356,
    totalFoodCount: 289,
    vegCount: 187,
    nonVegCount: 102,
    topColleges: [
      { name: "ABC Engineering College", count: 45 },
      { name: "XYZ Institute of Technology", count: 38 },
      { name: "PQR College of Science", count: 32 },
      { name: "LMN University", count: 28 },
      { name: "DEF Technical Campus", count: 25 },
    ],
    yearWiseCount: {
      firstYear: 85,
      secondYear: 112,
      thirdYear: 97,
      fourthYear: 62,
    },
    sessionCounts: { morning: 143, evening: 213 },
  };

  useEffect(() => {
    setTimeout(() => {
      setDashboardData(mockData);
    }, 500);
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.dashboard}>
        <div className={styles.topSection}>
          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={styles.statTitle}>Total Registrations</div>
              <div className={styles.statValue}>
                {dashboardData.totalRegistrations}
              </div>
              <div className={styles.statSubtitle}>Participants Registered</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statTitle}>Total Food Count</div>
              <div className={styles.statValue}>
                {dashboardData.totalFoodCount}
              </div>
              <div className={styles.statSubtitle}>Meals Requested</div>
            </div>
          </div>

          <div className={styles.speedometerWrapper}>
            <div className={styles.speedometerTitle}>Food Preference Distribution</div>
            <Speedometer
              vegCount={dashboardData.vegCount}
              nonVegCount={dashboardData.nonVegCount}
            />
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={`${styles.dataContainer} ${styles.topColleges}`}>
            <div className={styles.containerTitle}>Top Colleges</div>
            <div className={styles.collegeList}>
              {dashboardData.topColleges.map((college, i) => (
                <div key={i} className={styles.collegeItem}>
                  <div className={styles.collegeRank}>{i + 1}</div>
                  <div className={styles.collegeInfo}>
                    <div className={styles.collegeName}>{college.name}</div>
                    <div className={styles.collegeCount}>{college.count} registrations</div>
                  </div>
                  <div className={styles.collegeBar}>
                    <div
                      className={styles.collegeBarFill}
                      style={{
                        width: `${(college.count / dashboardData.topColleges[0].count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.dataContainer} ${styles.yearWise}`}>
            <h3 className={styles.containerTitle}>📊 Year Wise Count</h3>
            <div className={styles.yearChart}>
              <div className={styles.yearChartBarContainer}>
                <div className={styles.yearChartBarLabel}>1st</div>
                <div className={styles.yearCount}>{dashboardData.yearWiseCount.firstYear}</div>
                <div className={styles.yearChartBar}>
                  <div 
                    className={`${styles.yearChartBarFill} ${styles.year1}`}
                    style={{ height: `${(dashboardData.yearWiseCount.firstYear / 150) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className={styles.yearChartBarContainer}>
                <div className={styles.yearChartBarLabel}>2nd</div>
                <div className={styles.yearCount}>{dashboardData.yearWiseCount.secondYear}</div>
                <div className={styles.yearChartBar}>
                  <div 
                    className={`${styles.yearChartBarFill} ${styles.year2}`}
                    style={{ height: `${(dashboardData.yearWiseCount.secondYear / 150) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className={styles.yearChartBarContainer}>
                <div className={styles.yearChartBarLabel}>3rd</div>
                <div className={styles.yearCount}>{dashboardData.yearWiseCount.thirdYear}</div>
                <div className={styles.yearChartBar}>
                  <div 
                    className={`${styles.yearChartBarFill} ${styles.year3}`}
                    style={{ height: `${(dashboardData.yearWiseCount.thirdYear / 150) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className={styles.yearChartBarContainer}>
                <div className={styles.yearChartBarLabel}>4th</div>
                <div className={styles.yearCount}>{dashboardData.yearWiseCount.fourthYear}</div>
                <div className={styles.yearChartBar}>
                  <div 
                    className={`${styles.yearChartBarFill} ${styles.year4}`}
                    style={{ height: `${(dashboardData.yearWiseCount.fourthYear / 150) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sessionContainer}>
            <div className={`${styles.dataContainer} ${styles.sessionCard}`}>
              <div className={styles.containerTitle}>Morning Session</div>
              <div className={styles.sessionCount}>{dashboardData.sessionCounts.morning}</div>
              <div className={styles.sessionLabel}>Participants</div>
            </div>

            <div className={`${styles.dataContainer} ${styles.sessionCard}`}>
              <div className={styles.containerTitle}>Evening Session</div>
              <div className={styles.sessionCount}>{dashboardData.sessionCounts.evening}</div>
              <div className={styles.sessionLabel}>Participants</div>
            </div>
          </div>
        </div>
      </main>

      {/* <div className={styles.refreshContainer}>
        <button className={styles.refreshButton}>↻ Refresh Data</button>
      </div> */}
    </div>
  );
};

export default GeneralHome;
