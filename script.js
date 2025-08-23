// script.js

function loadEvent(key) {
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
    input.type = "tel"; // text so we can format freely
    input.oninput = () => {
      formatInput(input, ev.format);
      updateScores(config);
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
}

function goBack() {
  document.getElementById("menu").style.display = "block";
  document.getElementById("eventPage").style.display = "none";

  // Reset score + clear table
  document.getElementById("totalScore").innerText = "0";
  document.getElementById("eventBody").innerHTML = "";
}

function updateScores(config) {
  let total = 0;
  const rows = document.querySelectorAll("#eventBody tr");

  rows.forEach((row, idx) => {
    const ev = config.events[idx];
    const input = row.querySelector("input");
    const scoreCell = row.querySelector(".score");

    const raw = input.value;
    let val = parsePerformance(raw, ev.format);

    if (!isNaN(val)) {
      const score = calculateScore(ev, val);
      scoreCell.innerText = score;
      total += score;
    } else {
      scoreCell.innerText = "0";
    }
  });

  document.getElementById("totalScore").innerText = total;
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

// Auto-format while typing
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
    // Full M:SS.xx
    const min = digits.slice(0, digits.length - 4);
    const sec = digits.slice(-4, -2);
    const hund = digits.slice(-2);
    input.value = min + ":" + sec + "." + hund;
  } else if (digits.length >= 3) {
    // Only seconds + hundredths so far
    const sec = digits.slice(0, -2);
    const hund = digits.slice(-2);
    input.value = sec + "." + hund;  // 👈 show as SS.xx until minutes appear
  } else {
    input.value = digits;
  }
}
  
}

// Convert formatted string → numeric seconds/meters
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

// Set "Last Updated" footer automatically
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








