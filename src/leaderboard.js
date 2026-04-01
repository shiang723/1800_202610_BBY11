// leaderboard.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const firebaseConfig = {
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const suffixes = ["st", "nd", "rd"];

function getRankLabel(rank) {
  if (rank <= 3) return `${rank}${suffixes[rank - 1]}`;
  return `${rank}`;
}

async function loadLeaderboard() {
  const tbody = document.getElementById("leaderboard-body");

  const q = query(collection(db, "users"), orderBy("points", "desc"), limit(10));
  const snapshot = await getDocs(q);

  tbody.innerHTML = "";

  if (snapshot.empty) {
    tbody.innerHTML = `<tr><td colspan="3">No players yet.</td></tr>`;
    return;
  }

  snapshot.forEach((doc, i) => {
  });

  let rank = 1;
  for (const doc of snapshot.docs) {
    const { name, points } = doc.data();
    const rankLabel = getRankLabel(rank);
    const rankClass = rank <= 3 ? `class="rank"` : "";

    tbody.innerHTML += `
      <tr>
        <td ${rankClass}>${rankLabel}</td>
        <td>${name ?? "---"}</td>
        <td>${points ?? "---"}</td>
      </tr>
    `;
    rank++;
  }
}

loadLeaderboard();