import { doc, getDoc } from "firebase/firestore";
import { db } from './firebaseConfig.js';

// 1. Initial variables
let scoreArg = 0;
let scoreBra = 0;
let isMatchDone = false; 

async function loadMatchData() {
   const params = new URLSearchParams(window.location.search);
   const id = params.get("docID") || localStorage.getItem('matchDocID');

   if (!id) {
       console.error("No Match ID found! Please go through the home page.");
       return;
   }

   try {
       const matchDoc = await getDoc(doc(db, "Match", id));
       if (matchDoc.exists()) {
           const data = matchDoc.data();
          
           scoreArg = Number(data.home_points_scored) || 0;
           scoreBra = Number(data.away_points_scored) || 0;

           // --- UPDATING TEAM NAMES DYNAMICALLY ---
           // This updates the names in the scoreboard (class: team-name)
           const teamNames = document.querySelectorAll('.team-name');
           if (teamNames.length >= 2) {
               teamNames[0].innerText = data.home_team || "HOME";
               teamNames[1].innerText = data.away_team || "AWAY";
           }

           // This updates the small labels in the stats section (class: team-label)
           const teamLabels = document.querySelectorAll('.team-label');
           if (teamLabels.length >= 2) {
               teamLabels[0].innerText = data.home_team || "HOME";
               teamLabels[1].innerText = data.away_team || "AWAY";
           }

           // Check if the status is "done"
           if (data.status === "done") {
               isMatchDone = true;
               const liveIndicator = document.querySelector('.live-indicator');
               if (liveIndicator) {
                   liveIndicator.innerText = "● FINAL";
                   liveIndicator.style.color = "black";
               }
               const btn = document.getElementById('update-btn');
               if (btn) {
                   btn.disabled = true;
                   btn.innerText = "MATCH OVER";
               }
           }

           document.getElementById('score-arg').innerText = scoreArg;
           document.getElementById('score-bra').innerText = scoreBra;
          
           updateStat('shots', scoreArg, scoreBra);
           console.log("Match data loaded successfully!");
       }
   } catch (error) {
       console.error("Error loading match data:", error);
   }
}

loadMatchData();

// --- SIMULATOR ---
const matchInterval = setInterval(() => {
 if (isMatchDone) {
   clearInterval(matchInterval);
   return;
 }

 const argEl = document.getElementById('score-arg');
 if (!argEl) return;

 let nextArg = scoreArg;
 let nextBra = scoreBra;

 if (Math.random() > 0.5) { nextArg++; } else { nextBra++; }
 updateScore(nextArg, nextBra);

 const stats = ['shots', 'fouls', 'ycard', 'rcard'];
 const randomStat = stats[Math.floor(Math.random() * stats.length)];
 const statArg = document.getElementById(`val-${randomStat}-arg`);
 const statBra = document.getElementById(`val-${randomStat}-bra`);

 if (statArg && statBra) {
   let currentArgStat = parseInt(statArg.innerText) || 0;
   let currentBraStat = parseInt(statBra.innerText) || 0;
   if (Math.random() > 0.5) {
     updateStat(randomStat, currentArgStat + 1, currentBraStat);
   } else {
     updateStat(randomStat, currentArgStat, currentBraStat + 1);
   }
 }

 if (nextArg >= 11 || nextBra >= 11) {
   clearInterval(matchInterval);
   const liveIndicator = document.querySelector('.live-indicator');
   if (liveIndicator) { liveIndicator.innerText = "● FINAL"; }
 }
}, 3000);

// --- HELPER FUNCTIONS ---
function updateScore(newArg, newBra) {
 const argEl = document.getElementById('score-arg');
 const braEl = document.getElementById('score-bra');
 if (!argEl || !braEl) return;

 if (newArg > scoreArg) fireConfetti(['#75AADB', '#FFFFFF']);
 else if (newBra > scoreBra) fireConfetti(['#FEDD00', '#009739']);

 argEl.innerText = newArg;
 braEl.innerText = newBra;
 scoreArg = newArg;
 scoreBra = newBra;
 updateStat('shots', newArg, newBra);
}

function updateStat(statName, argVal, braVal) {
   const argEl = document.getElementById(`val-${statName}-arg`);
   const braEl = document.getElementById(`val-${statName}-bra`);
   const fillEl = document.getElementById(`fill-${statName}`);

   if (argEl && braEl && fillEl) {
       argEl.innerText = argVal;
       braEl.innerText = braVal;
       const total = (argVal + braVal) || 1;
       fillEl.style.width = (argVal / total * 100) + "%";
   }
}

function fireConfetti(teamColors) {
 const confettiFunc = window.confetti || confetti;
 if (!confettiFunc) return;
 confettiFunc({ origin: { y: 0.7 }, colors: teamColors, particleCount: 150, spread: 70 });
}

// --- REDIRECT LOGIC ---
const updateBtn = document.getElementById('update-btn');
if (updateBtn) {
   updateBtn.addEventListener('click', () => {
       const params = new URLSearchParams(window.location.search);
       const matchId = params.get("docID") || localStorage.getItem('matchDocID');
       if (matchId) {
           window.location.href = `updateMatchInfo.html?docID=${matchId}`;
       } else {
           alert("Match ID not found. Go back to the match list.");
       }
   });
}

