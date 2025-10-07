// script.js

let currentEventType = null;

// to help hide the day scores for the pent
function setDayScoreVisibility(show) {
  const d1 = document.getElementById("day1Score");
  const d2 = document.getElementById("day2Score");
  if (!d1 || !d2) return;

  if (show) {
    d1.style.display = "block";
    d2.style.display = "block";
  } else {
    d1.style.display = "none";
    d2.style.display = "none";
  }
}



function loadEvent(key) {
  currentEventType = key;  // store which event is active
  const config = eventConfigs[key];

  // Show/hide pages
  document.getElementById("menu").style.display = "none";
  document.getElementById("eventPage").style.display = "block";
  document.getElementById("eventTitle").innerText = config.title;

  // Hide day scores for pentathlon; show for others
  setDayScoreVisibility(key !== "pentathlonWomenIndoor");

  // Clear table
  const tbody = document.getElementById("eventBody");
  tbody.innerHTML = "";

  // Build event rows
  config.events.forEach((ev, idx) => {
    const row = document.createElement("tr");

    // Event name
    const eventCell = document.createElement("td");
    eventCell.innerText = ev.name;
    row.appendChild(eventCell);

    // Input cell
    const perfCell = document.createElement("td");
    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "decimal";

    // Score cell
    const scoreCell = document.createElement("td");
    scoreCell.innerText = "0";
    scoreCell.className = "score";

    // Input handler
    input.oninput = () => {
      formatInput(input, ev.format);
      const value = parsePerformance(input.value, ev.format);
      const score = calculateScore(ev, value);
      scoreCell.textContent = score;
      updateScores(currentEventType);
    };

    // Store metadata
    input.dataset.index = idx;
    input.dataset.format = ev.format;

    // Append cells
    perfCell.appendChild(input);
    row.appendChild(perfCell);
    row.appendChild(scoreCell);
    tbody.appendChild(row);
  });

  // Reset totals when event loads
  updateScores(currentEventType);
}

function goBack() {
  document.getElementById("menu").style.display = "block";
  document.getElementById("eventPage").style.display = "none";

  // Reset score + clear table
  document.getElementById("totalScore").innerText = "0";
  document.getElementById("day1Score").textContent = "Day 1 Score: 0";
  document.getElementById("day2Score").textContent = "Day 2 Score: 0";
  document.getElementById("eventBody").innerHTML = "";
}

function updateScores(eventType) {
  let total = 0;
  let day1 = 0;
  let day2 = 0;

  const rows = document.querySelectorAll("#eventBody tr");

  rows.forEach((row, index) => {
    const scoreCell = row.querySelector("td:last-child");
    const score = parseInt(scoreCell.textContent) || 0;
    total += score;

    // Split logic depending on eventType
    if (eventType === "decathlonMen") {
      if (index < 5) { day1 += score; }  // first 5 events = Day 1
      else { day2 += score; }            // last 5 events = Day 2
    }
    else if (eventType === "heptathlonMenIndoor" || eventType === "heptathlonWomen") {
      if (index < 4) { day1 += score; }  // first 4 events = Day 1
      else { day2 += score; }            // last 3 events = Day 2
    }
    else {
      // Pentathlon = 1 day only
      day1 = total;
      day2 = 0;
    }
  });

  // Update totals on the page
  document.getElementById("totalScore").textContent = total;
  document.getElementById("day1Score").textContent = `Day 1 Score: ${day1}`;
  document.getElementById("day2Score").textContent = `Day 2 Score: ${day2}`;
}

function calculateScore(ev, value) {
  let P = 0;
  if (ev.type === "track") {
    P = ev.a * Math.pow(ev.b - value, ev.c);
  } else if (ev.type === "jump") {
    P = ev.a * Math.pow(value * 100 - ev.b, ev.c); // convert m → cm
  } else if (ev.type === "throw") {
    P = ev.a * Math.pow(value - ev.b, ev.c);
  }
  return Math.floor(P > 0 ? P : 0);
}

/* ------------------------
   Input Formatting Helpers
------------------------ */

function formatInput(input, format) {
  let digits = input.value.replace(/\D/g, ""); // keep only numbers

  // Enforce max digits
  let maxDigits = 99; // fallback
  if (format === "s.xx") maxDigits = 3;
  if (format === "m.xx") maxDigits = 3;
  if (format === "ss.xx") maxDigits = 4;
  if (format === "M:SS.xx") maxDigits = 5;

  digits = digits.slice(0, maxDigits); // trim if too long

  // ---- Apply format ----

  // Track times (seconds with decimal)
  if (format === "ss.xx" || format === "s.xx") {
  const eventName = input.closest("tr")?.querySelector("td:first-child")?.textContent?.toLowerCase() || "";

  // Special case: 60m and 60m hurdles → two digits = X.x
  if (eventName.includes("60m")) {
    if (digits.length === 2) {
      input.value = digits[0] + "." + digits[1]; // 78 → 7.8
      return; // stop here so other logic doesn't override it
    }
  }

  // For hurdles and 200m: 3 digits → XX.x
  if (digits.length === 3 && (eventName.includes("100m hurdle") || eventName.includes("110m hurdle") 
                              || eventName.includes("200") || eventName.includes("400"))) {
    input.value = digits.slice(0, -1) + "." + digits.slice(-1);
  }
  // For everything else (100m, 60m, etc.): 3 digits → X.xx
  else if (digits.length >= 3) {
    input.value = digits.slice(0, -2) + "." + digits.slice(-2);
  }
  else {
    input.value = digits;
  }
}


  // Jumps/throws measured in meters → special case
  if (format === "m.xx") {
    if (digits.length === 2) {
      // Two digits → x.x
      input.value = digits[0] + "." + digits[1];
    } else if (digits.length >= 3) {
      // Three digits → x.xx
      input.value = digits.slice(0, -2) + "." + digits.slice(-2);
    } else {
      input.value = digits;
    }
  }

  // Middle/long races with minutes:seconds
  if (format === "M:SS.xx") {
  if (digits.length === 1) {
    // 1 → "1"
    input.value = digits;
  } else if (digits.length === 2) {
    // 12 → "1:2" (looks like this, math later interprets as 1:20)
    const min = digits[0];
    const sec = digits[1];
    input.value = `${min}:${sec}`;
  } else if (digits.length === 3) {
    // 123 → "1:23"
    const min = digits[0];
    const sec = digits.slice(1, 3);
    input.value = `${min}:${sec}`;
  } else if (digits.length === 4) {
    // 1234 → "1:23.4"
    const min = digits[0];
    const sec = digits.slice(1, 3);
    const hund = digits[3];
    input.value = `${min}:${sec}.${hund}`;
  } else if (digits.length >= 5) {
    // 12345 → "1:23.45"
    const min = digits[0];
    const sec = digits.slice(1, 3);
    const hund = digits.slice(3, 5);
    input.value = `${min}:${sec}.${hund}`;
  }
}



  // ---- Auto-move focus when max digits hit ----
  if (digits.length >= maxDigits) {
    console.log("Reached max digits for format:", format, "digits:", digits, "max:", maxDigits); // 👈 Debug
    const currentIndex = parseInt(input.dataset.index, 10);
    const nextInput = document.querySelector(`input[data-index="${currentIndex + 1}"]`);
    if (nextInput) {
      console.log("Moving focus to next input with index:", currentIndex + 1);
      nextInput.focus();
    } else {
      console.log("No next input found, staying on last field.");
    }
  }
}


function parsePerformance(str, format) {
  if (!str) return NaN;

  if (format === "ss.xx" || format === "s.xx" || format === "m.xx") {
    return parseFloat(str);
  }

  if (format === "M:SS.xx") {
  // 👇 Add this small block:
  if (/^\d+$/.test(str)) {
    // If the user typed only digits (like "1"), treat it as whole minutes
    const min = parseInt(str);
    return min * 60;
  }

  // Match minutes, seconds (1 or 2 digits), and optional hundredths
  const match = str.match(/(\d+):(\d{1,2})(?:\.(\d{1,2}))?/);
  if (!match) return NaN;

  const min = parseInt(match[1]);
  let sec = parseInt(match[2]);
  let hund = match[3] ? parseInt(match[3]) : 0;

  // If seconds was typed as only one digit (e.g. "1:2"), treat as "1:20"
  if (match[2].length === 1) {
    sec = sec * 10;
  }

  // Normalize hundredths: "4" → "40"
  if (match[3] && match[3].length === 1) {
    hund = hund * 10;
  }

  return min * 60 + sec + hund / 100;
}


  return NaN;
}


// "Last Updated" footer
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("lastUpdated");
  if (el) {
    const modified = new Date(document.lastModified);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    el.textContent = "Last updated: " + modified.toLocaleString(undefined, options);
  }
});















