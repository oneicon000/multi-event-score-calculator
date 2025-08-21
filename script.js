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

    const eventCell = document.createElement("td");
    eventCell.innerText = ev.name;
    row.appendChild(eventCell);

    const perfCell = document.createElement("td");
    const input = document.createElement("input");
    input.type = "number";
    input.step = "any";
    input.oninput = () => updateScores(config);
    input.dataset.index = idx;
    perfCell.appendChild(input);
    row.appendChild(perfCell);

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
}

function updateScores(config) {
  let total = 0;
  const rows = document.querySelectorAll("#eventBody tr");

  rows.forEach((row, idx) => {
    const ev = config.events[idx];
    const input = row.querySelector("input");
    const scoreCell = row.querySelector(".score");

    const val = parseFloat(input.value);
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
  return Math.floor(P);
}
