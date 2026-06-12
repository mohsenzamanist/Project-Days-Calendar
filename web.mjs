import daysData from "./days.json" with { type: "json" };

const calendarDiv = document.getElementById("calendar");
const yearEl = document.getElementById("year");
const preYearBtn = document.getElementById("pre-year");
const nextYearBtn = document.getElementById("next-year");
const preMonthBtn = document.getElementById("pre-month");
const nextMonthBtn = document.getElementById("next-month");
const yearSelect = document.getElementById("year-select");
const monthSelect = document.getElementById("month-select");

const state = {};

const MONTHS = [
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

const OCCURRENCE = { first: 1, second: 2, third: 3, fourth: 4, last: 5 };
const DAYS = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

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

  update();
};

const yearControlsHandler = function (step) {
  state.year += step;
  update();
};

const monthSelectChangeHandler = function (e) {
  state.month = +e.target.value;
  update();
};

const yearSelectChangeHandler = function (e) {
  state.year = +e.target.value;
  update();
};

// eventListeners
preMonthBtn.addEventListener("click", () => monthControlsHandler(-1));
nextMonthBtn.addEventListener("click", () => monthControlsHandler(1));
preYearBtn.addEventListener("click", () => yearControlsHandler(-1));
nextYearBtn.addEventListener("click", () => yearControlsHandler(1));
monthSelect.addEventListener("change", monthSelectChangeHandler);
yearSelect.addEventListener("change", yearSelectChangeHandler);

// functions
function renderCalendar() {
  const { month, year } = state;
  const calendar = generateCalendar(month, year);
  const specialDays = mapDaysToCalendar();

  calendarDiv.innerHTML = "";

  const defaultRow = generateDefaultRow();
  calendarDiv.append(...defaultRow);

  calendar.forEach((item) => {
    const cell = document.createElement("div");

    cell.className = item.currentMonth ? "cell" : "cell other-month";

    cell.textContent = item.day;

    const specialDay = specialDays.find(
      (d) => d.date === item.day && item.currentMonth,
    );

    if (specialDay) {
      cell.classList.add("special-day");
      cell.title = specialDay.name;
    }

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

function syncUI() {
  const { month, year } = state;
  yearSelect.value = year;
  monthSelect.value = month;
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

function generateMonthDropdown() {
  const options = MONTHS.map((month, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = month;
    return option;
  });
  monthSelect.append(...options);
}

function generateYearDropdown() {
  const yearRange = 50;
  const fullYear = new Date().getFullYear();
  const beforeFullYear = Array.from(
    { length: yearRange },
    (_, i) => fullYear - i,
  ).reverse();
  const afterFullYear = Array.from(
    { length: yearRange },
    (_, i) => fullYear + 1 + i,
  );
  const years = [...beforeFullYear, ...afterFullYear];
  const options = years.map((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    return option;
  });
  yearSelect.append(...options);
}

function update() {
  renderCalendar();
  syncUI();
}

function mapDaysToCalendar() {
  const { year, month } = state;

  const dates = [];

  for (const day of daysData) {
    if (MONTHS[month] !== day.monthName) continue;

    const weekday = DAYS[day.dayName];
    const occurrence = OCCURRENCE[day.occurrence];

    let date;

    if (day.occurrence === "last") {
      date = getLastOccurrence(year, month, weekday);
    } else {
      date = getOccurrence(year, month, weekday, occurrence);
    }

    dates.push({
      date,
      name: day.name,
      descriptionURL: day.descriptionURL,
    });
  }

  return dates;
}

function getOccurrence(year, month, weekday, occurrence) {
  const firstDay = new Date(year, month, 1).getDay();

  let offset = weekday - firstDay;

  if (offset < 0) {
    offset += 7;
  }

  return 1 + offset + (occurrence - 1) * 7;
}

function getLastOccurrence(year, month, weekday) {
  let date = new Date(year, month + 1, 0).getDate();

  while (new Date(year, month, date).getDay() !== weekday) {
    date--;
  }

  return date;
}

document.addEventListener("DOMContentLoaded", function () {
  initState();
  mapDaysToCalendar();
  generateMonthDropdown();
  generateYearDropdown();
  update();
});
