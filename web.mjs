import daysData from "./days.json" with { type: "json" };
const calendarDiv = document.getElementById("calendar");
const yearEl = document.getElementById("year");
const monthEl = document.getElementById("month-name");
const preYearBtn = document.getElementById("pre-year");
const nextYearBtn = document.getElementById("next-year");
const preMonthBtn = document.getElementById("pre-month");
const nextMonthBtn = document.getElementById("next-month");

const state = {};

// controls handlers
const monthControlsHandler = function (step) {
  state.month += step;

  if (state.month < 0) {
    state.month = 11;
    state.year--;
  } else if (state.month > 11) {
    state.month = 0;
    state.year++;
  }

  renderCalendar(state.month, state.year);
};

const yearControlsHandler = function (step) {
  state.year += step;
  renderCalendar(state.month, state.year);
};

// eventListeners
preMonthBtn.addEventListener("click", () => monthControlsHandler(-1));
nextMonthBtn.addEventListener("click", () => monthControlsHandler(1));
preYearBtn.addEventListener("click", () => yearControlsHandler(-1));
nextYearBtn.addEventListener("click", () => yearControlsHandler(1));

// functions
function renderCalendar(month, year) {
  const calendar = generateCalendar(month, year);
  updateYearMonthEl(month, year);
  calendarDiv.innerHTML = "";

  const defaultRow = generateDefaultRow();
  calendarDiv.append(...defaultRow);

  calendar.forEach((item) => {
    const cell = document.createElement("div");
    cell.className = item.currentMonth ? "cell" : "cell other-month";
    cell.textContent = item.day;
    calendarDiv.appendChild(cell);
  });
}

function generateDefaultRow() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days.map((day) => {
    const cell = document.createElement("div");
    cell.className = "cell title";
    cell.textContent = day;
    return cell;
  });
}

function updateYearMonthEl(month, year) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  monthEl.textContent = months[month];
  yearEl.textContent = year;
}

function generateCalendar(month, year) {
  const { startDay, daysInMonth } = getCurrentMonthInfo(month, year);
  const daysInPrevMonth = getPrevMonthInfo(month, year);

  const calendar = [];

  for (let i = startDay - 1; i >= 0; i--)
    calendar.push({ day: daysInPrevMonth - i, currentMonth: false });
  for (let day = 1; day <= daysInMonth; day++)
    calendar.push({ day, currentMonth: true });
  for (let i = 1; calendar.length < 42; i++)
    calendar.push({ day: i, currentMonth: false });

  return calendar;
}

function getCurrentMonthInfo(month, year) {
  const startDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return { startDay, daysInMonth };
}

function getPrevMonthInfo(month, year) {
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  return daysInPrevMonth;
}

function initState() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  state.month = month;
  state.year = year;
}

document.addEventListener("DOMContentLoaded", function () {
  initState();

  renderCalendar(state.month, state.year);
});
