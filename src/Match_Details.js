// 1. Set your STARTING scores
let scoreArg = 3;
let scoreBra = 1;

function updateScore(newArg, newBra) {
  const toast = document.getElementById('goal-toast');
  const argEl = document.getElementById('score-arg');
  const braEl = document.getElementById('score-bra');

  // Check which team scored to set confetti colors
  if (newArg > scoreArg) {
    fireConfetti(['#75AADB', '#FFFFFF']); // Argentina colors
  } else if (newBra > scoreBra) {
    fireConfetti(['#FEDD00', '#009739']); // Brazil colors
  }

  if (newArg > scoreArg || newBra > scoreBra) {
    // Show the "GOAL!" toast
    if (toast) {
      toast.classList.add('show-goal');
      setTimeout(() => toast.classList.remove('show-goal'), 2500);
    }

    // Pop the numbers
    [argEl, braEl].forEach(el => {
      if (el) {
        el.style.transform = 'scale(1.3)';
        setTimeout(() => el.style.transform = 'scale(1)', 200);
      }
    });
  }

  // Update the UI and the tracking variables
  argEl.innerText = newArg;
  braEl.innerText = newBra;
  scoreArg = newArg;
  scoreBra = newBra;

  updateStat('shots', newArg, newBra);
}

function fireConfetti(teamColors) {
  const count = 200;
  // Use window.confetti to ensure the module finds the global library
  const confettiFunc = window.confetti || confetti; 

  const defaults = { 
    origin: { y: 0.7 },
    colors: teamColors || ['#ffffff', '#ffcc00']
  };

  function fire(particleRatio, opts) {
    confettiFunc({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
}

// 3. THE SIMULATOR
const matchInterval = setInterval(() => {
  let nextArg = scoreArg;
  let nextBra = scoreBra;

  // Randomly pick ONE team to score
  if (Math.random() > 0.5) {
    nextArg++;
  } else {
    nextBra++;
  }
  
  // Run the update function
  updateScore(nextArg, nextBra);

  // Add this inside your matchInterval
const stats = ['shots', 'possession', 'fouls'];
const randomStat = stats[Math.floor(Math.random() * stats.length)];

// Simple logic to bump a random stat
let currentArgStat = parseInt(document.getElementById(`val-${randomStat}-arg`).innerText) || 0;
let currentBraStat = parseInt(document.getElementById(`val-${randomStat}-bra`).innerText) || 0;

if (Math.random() > 0.5) {
  updateStat(randomStat, currentArgStat + 1, currentBraStat);
} else {
  updateStat(randomStat, currentArgStat, currentBraStat + 1);
}

  // STOP the match if either team hits 11
  if (nextArg >= 11 || nextBra >= 11) {
    clearInterval(matchInterval); // This kills the loop
    console.log("Full Time! Match Ended.");
    
    // Optional: Final massive victory burst
    fireConfetti(nextArg > nextBra ? ['#75AADB', '#FFFFFF'] : ['#FEDD00', '#009739']);
    
    // Optional: Change 'LIVE' to 'FINAL'
    const liveIndicator = document.querySelector('.live-indicator');
    if (liveIndicator) {
      liveIndicator.innerText = "FINAL";
      liveIndicator.style.color = "black";
    }
  }
}, 1000); // Still every 5 seconds

function updateStat(statName, argVal, braVal) {
    // 1. Update the numbers
    document.getElementById(`val-${statName}-arg`).innerText = argVal;
    document.getElementById(`val-${statName}-bra`).innerText = braVal;

    // 2. Calculate the percentage for the bar
    // Example: If Arg has 3 and Bra has 1, total is 4. Arg percentage is 75%.
    const total = (argVal + braVal) || 1;
    const percentage = (argVal / total) * 100;

    // 3. Move the bar
    document.getElementById(`fill-${statName}`).style.width = percentage + "%";
}

// Example usage in your simulator:
// updateStat('shots', 5, 2);

// --- Update Match Button Logic ---

function playNextMove() {
  let nextArg = scoreArg;
  let nextBra = scoreBra;

  if (Math.random() > 0.5) {
    nextArg++;
  } else {
    nextBra++;
  }
  
  updateScore(nextArg, nextBra);

  // Match the IDs exactly as they appear in your HTML
  const otherStats = ['fouls', 'ycard', 'rcard']; 
  const randomStat = otherStats[Math.floor(Math.random() * otherStats.length)];

  let argEl = document.getElementById(`val-${randomStat}-arg`);
  let braEl = document.getElementById(`val-${randomStat}-bra`);

  if (argEl && braEl) {
    let currentArgStat = parseInt(argEl.innerText) || 0;
    let currentBraStat = parseInt(braEl.innerText) || 0;

    if (Math.random() > 0.5) {
      updateStat(randomStat, currentArgStat + 1, currentBraStat);
    } else {
      updateStat(randomStat, currentArgStat, currentBraStat + 1);
    }
  }

  if (nextArg >= 11 || nextBra >= 11) {
    const btn = document.getElementById('update-btn');
    btn.disabled = true;
    btn.innerText = "MATCH OVER";
  }
}

// ATTACH THE REDIRECT LOGIC
document.getElementById('update-btn').addEventListener('click', () => {
    // 1. Run the simulator logic (optional, remove if you only want to redirect)
    playNextMove();

    // 2. Get the Match ID from the URL (e.g., Match_Details.html?docID=XYZ)
    const params = new URLSearchParams(window.location.search);
    const matchId = params.get("docID");

    if (matchId) {
        // Store it so updateMatchInfo.html can read it
        localStorage.setItem('matchDocID', matchId);
        
        // 3. Redirect to the update page
        window.location.href = 'updateMatchInfo.html';
    } else {
        console.error("No docID found in URL. Make sure the URL looks like: Match_Details.html?docID=yourIDhere");
        // Fallback: just go to the page anyway
        window.location.href = 'updateMatchInfo.html';
    }
});
