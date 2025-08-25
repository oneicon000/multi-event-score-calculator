// script.js

let currentEventType = null;

function loadEvent(key) {
  currentEventType = key;  // store which event is active
  const config = eventConfigs[key];
  document.getElementById("menu").style.display = "none";
  document.getElementById("eventPage").style.display = "block";
  document.getElementById("eventTitle").innerText = config.title;

  const tbody = document.getElementById("eventBody");
  tbody.innerHTML = "";

  config.events.forEach((ev, idx) => {
    const row = document.createElement("tr");

    // Event name
    const eventCell = document.createElement("td");
    eventCell.innerText = ev.name;
    row.appendChild(eventCell);

    // Input field
    const perfCell = document.createElement("td");
    const input = document.createElement("input");
    input.type = "tel";
    input.oninput = () => {
      formatInput(input, ev.format);
      updateScores(currentEventType); // pass event type string
    };
    input.dataset.index = idx;
    input.dataset.format = ev.format;
    perfCell.appendChild(input);
    row.appendChild(perfCell);

    // Score cell
    const scoreCell = document.createElement("td");
    scoreCell.innerText = "0";
    scoreCell.className = "score";
    row.appendChild(scoreCell);

    tbody.appendChild(row);
  });

  // Reset scores when event loads
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

  // Apply format
  if (format === "ss.xx" || format === "s.xx" || format === "m.xx") {
    if (digits.length >= 3) {
      input.value = digits.slice(0, -2) + "." + digits.slice(-2);
    } else {
      input.value = digits;
    }
  }

  if (format === "M:SS.xx") {
    if (digits.length >= 5) {
      const min = digits.slice(0, digits.length - 4);
      const sec = digits.slice(-4, -2);
      const hund = digits.slice(-2);
      input.value = min + ":" + sec + "." + hund;
    } else if (digits.length >= 3) {
      const sec = digits.slice(0, -2);
      const hund = digits.slice(-2);
      input.value = sec + "." + hund;
    } else {
      input.value = digits;
    }
  }
}

function parsePerformance(str, format) {
  if (!str) return NaN;

  if (format === "ss.xx" || format === "s.xx" || format === "m.xx") {
    return parseFloat(str);
  }

  if (format === "M:SS.xx") {
    const match = str.match(/(\d+):(\d{2})\.(\d{2})/);
    if (!match) return NaN;
    const min = parseInt(match[1]);
    const sec = parseInt(match[2]);
    const hund = parseInt(match[3]);
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
