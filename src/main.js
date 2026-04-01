import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

async function loadMatches() {
    const querySnapshot = await getDocs(collection(db, "Match"));

    let liveMatchesHTML = "";
    let upcomingMatchesHTML = "";
    let upcomingMatches = [];

    querySnapshot.forEach((doc) => {
        const match = doc.data();
        const status = (match.status || "").trim().toLowerCase();
        const matchId = doc.id; // Capture the Firestore ID

        // ================= LIVE MATCHES =================
        if (status === "live") {
            // Wrapped in <a> tag with docID parameter
            liveMatchesHTML += `
                <a href="Match_Details.html?docID=${matchId}" class="match-link">
                    <div class="match-card">
                        <div class="team-side">
                            <span class="material-symbols-outlined flag-icon">flag</span>
                            <div class="team-name">${match.home_team}</div>
                        </div>

                        <div class="match-middle">
                            <div class="live-pill">🔴 LIVE</div>
                            <div class="score-row">
                                <span>${match.home_points_scored}</span>
                                <span>vs</span>
                                <span>${match.away_points_scored}</span>
                            </div>
                            <div class="live-time">${match.time_start}</div>
                        </div>

                        <div class="team-side">
                            <span class="material-symbols-outlined flag-icon">flag</span>
                            <div class="team-name">${match.away_team}</div>
                        </div>
                    </div>
                </a>
            `;
        }

        // ================= UPCOMING MATCHES =================
        if (status === "upcoming") {
            upcomingMatches.push({ ...match, id: matchId }); // Store ID with match data
        }
    });

    // SORT upcoming matches by date (closest first)
    upcomingMatches.sort((a, b) => {
        return new Date(a.start_date) - new Date(b.start_date);
    });

    // render sorted matches
    upcomingMatches.forEach((match) => {
        // Wrapped in <a> tag with docID parameter
        upcomingMatchesHTML += `
            <a href="Match_Details.html?docID=${match.id}" class="match-link">
                <div class="match-card">
                    <div class="team-side">
                        <span class="material-symbols-outlined flag-icon">flag</span>
                        <div class="team-name">${match.home_team}</div>
                    </div>

                    <div class="match-middle">
                        <div class="upcoming-vs">vs</div>
                        <div class="match-date">${match.time_start}</div>
                    </div>

                    <div class="team-side">
                        <span class="material-symbols-outlined flag-icon">flag</span>
                        <div class="team-name">${match.away_team}</div>
                    </div>
                </div>
            </a>
        `;
    });

    const liveContainer = document.getElementById("live-matches");
    const upcomingContainer = document.getElementById("upcoming-matches");

    if (liveContainer) liveContainer.innerHTML = liveMatchesHTML;
    if (upcomingContainer) upcomingContainer.innerHTML = upcomingMatchesHTML;
}

loadMatches();