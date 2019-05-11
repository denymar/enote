const backendPATH = "http://localhost:8090";
const month_names =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const month_names_ro =  ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
const day_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const day_names_ro = ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sâ"];
const d = new Date();
let selectedM = d.getMonth();
let selectedY = d.getFullYear();
let logged_in = false;
let language = "english";

let t_add_new;
let t_time;
let t_event;
let t_place;
let t_desc_h;
let t_place_h;
let t_user;
let t_posts;
let t_users_axis;
let t_dates_axis;

function setEnglish() {
  language = "english";
  const enTexts = document.querySelectorAll(".en");
  const roTexts = document.querySelectorAll(".ro");

  roTexts.forEach(item => item.style.display = "none");
  enTexts.forEach(item => item.style.display = "");

  t_add_new = "Add New";
  t_time = "Time";
  t_event = "Event";
  t_place = "Place";
  t_desc_h = "Event description";
  t_place_h = "Event place";
  t_user = "User";
  t_posts = "Posts";
  t_users_axis = "Nr. users";
  t_dates_axis = "Dates";
  loginUsernameInput.placeholder = "username";
  loginPasswordInput.placeholder = "password";
  signupUsernameInput.placeholder = "username";
  signupPasswordInput.placeholder = "password";
  signupPasswordConfirmationInput.placeholder = "repeat password";
}

function setRomanian() {
  language = "romanian";
  const enTexts = document.querySelectorAll(".en");
  const roTexts = document.querySelectorAll(".ro");

  enTexts.forEach(item => item.style.display = "none");
  roTexts.forEach(item => item.style.display = "");

  t_add_new = "Adaugă Nou";
  t_time = "Timp";
  t_event = "Eveniment";
  t_place = "Loc";
  t_desc_h = "Descrierea evenimentului";
  t_place_h = "Locul evenimentului";
  t_user = "Utilizator";
  t_posts = "Postări";
  t_users_axis = "Nr. utilizatori";
  t_dates_axis = "Date";
  loginUsernameInput.placeholder = "nume utilizator";
  loginPasswordInput.placeholder = "parola";
  signupUsernameInput.placeholder = "nume utilizator";
  signupPasswordInput.placeholder = "parola";
  signupPasswordConfirmationInput.placeholder = "repetă parola";
}


const startPageHolder = document.querySelector(".start-page-holder");
const spiner = document.querySelector(".loader");

const loginBtn = document.querySelector(".login-btn");
const loginModal = document.querySelector(".login-modal");
const loginModalContent = document.querySelector(".login-modal .login-modal-content");
const closeLoginModalBtn = document.querySelector(".login-modal-content-header .close-btn");

loginBtn.onclick = () => {
  loginModal.classList.add("visible");
}

loginModal.onclick = (e) => {
  if (e.target === loginModal || e.target === closeLoginModalBtn) {
    loginModal.classList.remove("visible");
  }
}

const signupBtn = document.querySelector(".signup-btn");
const signupModal = document.querySelector(".signup-modal");
const signupModalContent = document.querySelector(".signup-modal .signup-modal-content");
const closeSignupModalBtn = document.querySelector(".signup-modal-content-header .close-btn");

signupBtn.onclick = () => {
  signupModal.classList.add("visible");
}

signupModal.onclick = (e) => {
  if (e.target === signupModal || e.target === closeSignupModalBtn) {
    signupModal.classList.remove("visible");
  }
}

const loginSubmit = document.querySelector(`button[name='submit-login']`);
const loginUsernameInput = document.querySelector(`.login-modal input[name='username']`);
const loginPasswordInput = document.querySelector(`.login-modal input[name='password']`);
const loginInfoBox = document.querySelector(".login-modal .info-box");
const account = document.querySelector(".account");
const authentication = document.querySelector(".authentication");
const currentUser = document.querySelector(".account .current-username span:first-child");

const menu = document.querySelector(".menu");
const menuTriger = document.querySelector(".menu-triger");
menuTriger.onclick = () => {
  menu.classList.add("slide-out");
}

const slideBackBtn = document.querySelector(".slide-back-btn");
slideBackBtn.onclick = () => {
  menu.classList.remove("slide-out");
}

$.ajaxSetup({
  data: {
    access_token: localStorage.getItem('access_token')
  }
});

const chartBarsNr = document.querySelector(".users-per-day .nr-chart-bars input");
const chartsHolder = document.querySelector(".users-per-day .chart");

let chartBars = Number(chartBarsNr.value);
let chartYear = d.getFullYear();
let chartMonth = d.getMonth();
let chartDay = d.getDate();

chartBarsNr.onchange = () => {
  chartBars = Number(chartBarsNr.value);
  loadLogs(chartYear, chartMonth, chartDay, chartBars);
}

function loadPrevDates() {
  const {changedY, changedM, changedD} = {...decDate(chartYear, chartMonth, chartDay)};
  chartYear = changedY;
  chartMonth = changedM;
  chartDay = changedD;
  loadLogs(chartYear, chartMonth, chartDay, chartBars);
}

function loadNextDates() {
  const {changedY, changedM, changedD} = {...incDate(chartYear, chartMonth, chartDay)};
  chartYear = changedY;
  chartMonth = changedM;
  chartDay = changedD;
  loadLogs(chartYear, chartMonth, chartDay, chartBars);
}

function loadLogs(year, month, day, nrDays) {
  chartsHolder.innerHTML = `
    <div class="prev-dates" onclick="loadPrevDates()"></div>
    <div class="next-dates" onclick="loadNextDates()"></div>
    <div class="nr-users-axis">
      ${t_users_axis}
    </div>
    <div class="dates-axis">
      ${t_dates_axis}
    </div>
  `;

  let selectedYear = year;
  let selectedMonth = month;
  let selectedDay = day;

  const dates = [];

  dates.push({
    year: selectedYear,
    month: selectedMonth,
    day: selectedDay
  });

  for (let i = 0; i < nrDays - 1; i++) {
    const {changedY, changedM, changedD} = {...decDate(selectedYear, selectedMonth, selectedDay)};
    selectedYear = changedY;
    selectedMonth = changedM;
    selectedDay = changedD;
    dates.push({
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay
    });
  }

  $.post(backendPATH, {
    "load-logs": true,
    dates: dates.reverse()
  }, function(data, status) {
    const parsed = JSON.parse(data);
    if (parsed['status'] === 'success') {
      let maxRating = 0;
      parsed['ratings'].forEach(rating => {
        if (rating.nrUsers > maxRating) {
          maxRating = rating.nrUsers;
        }
      });

      parsed['ratings'].forEach(rating => {
        const height = Math.round(((rating.nrUsers / maxRating) * 100) * 0.8);
        const width = 100 / chartBars;
        const chartBar = document.createElement("div");
        chartBar.classList.add("chart-bar");
        chartBar.style.height = `${height}%`;
        chartBar.style.width = `calc(${width}% - 10px)`;
        chartBar.innerHTML = `
          <div class="amount">
            ${rating.nrUsers}
          </div>
          <div class="date">
            ${rating.day}/${rating.month}/${rating.year}
          </div>
        `;
        chartsHolder.appendChild(chartBar);
      });
    }
  });
}

function decDate(year, month, day) {
  if (day === 1) {
    if (month === 0) {
      month = 11;
      year--;
    } else {
      month--;
    }
    day = new Date(year, month + 1, 0).getDate();
  } else {
    day--;
  }

  return {
    changedY: year,
    changedM: month,
    changedD: day
  }
}

function incDate(year, month, day) {
  const maxDay = new Date(year, month + 1, 0).getDate();
  if (day === maxDay) {
    if (month === 11) {
      month = 0;
      year++;
    } else {
      month++;
    }
    day = 1;
  } else {
    day++;
  }

  return {
    changedY: year,
    changedM: month,
    changedD: day
  }
}

const topUsersList = document.querySelector(".top-users .users-list");

function loadTopUsers() {
  topUsersList.innerHTML = `
  <div class="users-list-title">
    <div class="username">
      ${t_user}
    </div>
    <div class="rating">
      ${t_posts}
    </div>
  </div>
  `;

  $.post(backendPATH, {
    "load-top-users": true
  }, function(data, status) {
    const parsed = JSON.parse(data);
    if (parsed['status'] === 'success') {
        parsed['topUsers'].forEach((u, i) => {
          if (i < 5) {
            const userDiv = document.createElement("div");
            userDiv.classList.add("user");
            userDiv.innerHTML = `
            <div class="username">
            ${i+1}. ${u.username}
            </div>
            <div class="rating">
            ${u.posts}
            </div>
            `;
            topUsersList.appendChild(userDiv);
          }
        });
    }
  })
}

loginSubmit.onclick = () => {
  spiner.classList.add("visible");
  if (loginUsernameInput.value.length > 0 && loginPasswordInput.value.length > 0) {
    loginInfoBox.innerHTML = "";
    const u = loginUsernameInput.value;
    const p = loginPasswordInput.value;

    $.post(backendPATH, {
      "submit-login": true,
      username: u,
      password: p
    }, function(data, status) {
      spiner.classList.remove("visible");
      const parsed = JSON.parse(data);
      if (parsed['status'] === 'success') {
        const currMonth = d.getMonth();
        const currYear = d.getFullYear();
        const currDay = d.getDate();
        $.post(backendPATH, {
          "add-log": true,
          username: parsed['message'],
          year: currYear,
          month: currMonth,
          day: currDay
        });
        loginUsernameInput.value = "";
        loginPasswordInput.value = "";
        account.style.display = "flex";
        authentication.style.display = "none";
        currentUser.innerHTML = parsed['message'];
        loginModal.classList.remove("visible");
        menu.classList.remove("slide-out");
        selectedM = d.getMonth();
        selectedY = d.getFullYear();
        startPageHolder.style.display = "none";
        logged_in = true;

        if (parsed['access_token'] !== undefined) {
            localStorage.setItem('access_token', parsed['access_token']);
        }

        renderCalendar(selectedY, selectedM);
      } else {
        account.style.display = "none";
        authentication.style.display = "flex";
        currentUser.innerHTML = "";
        loginInfoBox.innerHTML = "Incorrect username or password";
      }
    });
  } else {
    loginInfoBox.innerHTML = "Introduce your username and password";
  }
}

logoutBtn = document.querySelector(".logout-btn");

logoutBtn.onclick = () => {
  $.post(backendPATH, {
    "logout-pressed": true
  }, function(data, status) {
    const parsed = JSON.parse(data);
    if (parsed['status'] === 'success') {
      menu.classList.remove("slide-out");
      account.style.display = "none";
      authentication.style.display = "flex";
      currentUser.innerHTML = "";
      logged_in = false;
      deleteCalendar(selectedY, selectedM);
      startPageHolder.style.display = "block";
      loadLogs(chartYear, chartMonth, chartDay, chartBars);
      loadTopUsers();
    } else {
      // show an error message;
    }
  });
}

function checkSession() {
  $.post(backendPATH, {
    "check-session": true
  }, function(data, status) {
    const parsed = JSON.parse(data);
    if (parsed['status'] === 'success') {
      account.style.display = "flex";
      authentication.style.display = "none";
      currentUser.innerHTML = parsed['message'];
      loginModal.classList.remove("visible");
      startPageHolder.style.display = "none";
      logged_in = true;
      renderCalendar(selectedY, selectedM);
    }
  });
}

checkSession();

const signupSubmit = document.querySelector(`button[name='submit-signup']`);
const signupUsernameInput = document.querySelector(`.signup-modal input[name='new-username']`);
const signupPasswordInput = document.querySelector(`.signup-modal input[name='new-password']`);
const signupPasswordConfirmationInput = document.querySelector(`.signup-modal input[name='new-password-confirmation']`);
const signupEmailInput = document.querySelector(`.signup-modal input[name='new-email']`);
const signupInfoBox = document.querySelector(".signup-modal .info-box");

signupSubmit.onclick = () => {
  spiner.classList.add("visible");
  const u = signupUsernameInput.value;
  const email = signupEmailInput.value;
  const p = signupPasswordInput.value;
  const pc = signupPasswordConfirmationInput.value;
  if (u.length > 0 && email.length > 0 && p.length > 0 && pc.length > 0) {
    signupInfoBox.innerHTML = "";

    if (p !== pc) {
      signupInfoBox.innerHTML = "Repeated password is different."
    } else {
      signupInfoBox.innerHTML = "";
      $.post(backendPATH, {
        "submit-signup": true,
        username: u,
        email: email,
        password: p
      }, function(data, status) {
        spiner.classList.remove("visible");
        const parsed = JSON.parse(data);
        if (parsed['status'] === 'success') {
          signupModal.classList.remove("visible");
          signupUsernameInput.value = "";
          signupEmailInput.value = "";
          signupPasswordInput.value = "";
          signupPasswordConfirmationInput.value = "";
        } else {
          signupInfoBox.innerHTML = parsed['message'];
        }
      });
    }
  } else {
    signupInfoBox.innerHTML = "Fill all the fields.";
  }
}

function renderCalendar(y, m) {
  spiner.classList.add("visible");

  $.post(backendPATH, {
    "request-db": true,
    "selected-year": selectedY,
    "selected-month": selectedM
  }, function(data, status) {
    const calendarHolder = document.querySelector(".calendar-holder");
    const m_name = language === "romanian" ? month_names_ro[selectedM] : month_names[selectedM];
    calendarHolder.innerHTML = `
    <div class="event-list">
      <div class="year-nav">
        <div class="prev-year" onclick="decYear()"></div>
        <div class="current-year">${selectedY}</div>
        <div class="next-year" onclick="incYear()"></div>
      </div>
      <div class="month-nav">
        <div class="prev-month" onclick="decMonth()"></div>
        <div class="current-month">${m_name}</div>
        <div class="next-month" onclick="incMonth()"></div>
      </div>
      <div class="dates">
      </div>
    </div>
    `;

    spiner.classList.remove("visible");

    const db = JSON.parse(data);
    if (db['status'] === 'success') {
      const datesDiv = document.querySelector(".event-list .dates");
      const days_num = new Date(y, m + 1, 0).getDate();
      const first_date_str = `${month_names[m]} 1 ${y}`;
      const first_date_set = new Date(first_date_str).toDateString();
      const first_day_substr = first_date_set.substring(0, 3);
      let day_idx = day_names.indexOf(first_day_substr);
      datesDiv.innerHTML = "";

      for (let i = 1; i <= days_num; i++) {
        const newDate = document.createElement("div");
        newDate.classList.add("row");
        d_name = language === "romanian" ? day_names_ro[day_idx] : day_names[day_idx];
        newDate.innerHTML = `
          <div class="day-and-date">
            <div class="day">${d_name}</div>
            <div class="date">${i}</div>
          </div>
          <div class="events">
          </div>
        `;

        const events = newDate.querySelector(".events");
        db['db'].forEach(item => {
          if (Number(item['eDate']) === i) {
            const modHour = Number(item['eHour']) > 9 ? item['eHour'] : `0${item['eHour']}`;
            const modMinute = Number(item['eMinute']) > 9 ? item['eMinute'] : `0${item['eMinute']}`;
            const eventDiv = document.createElement("div");

            eventDiv.classList.add("event");
            eventDiv.innerHTML = `
              <div class="time">
              <strong>${t_time}: </strong>
              <span>${modHour}:${modMinute}</span>
              </div>
              <div class="description">
                <strong>${t_event}: </strong>
                ${item['event']}
              </div>
              <div class="place">
                <strong>${t_place}: </strong>
                ${item['place']}
              </div>
            `;
            events.appendChild(eventDiv);
          }
        });

        const addBtn = document.createElement("button");
        addBtn.setAttribute("type", "button");
        addBtn.setAttribute("name", "add-new-event");
        addBtn.setAttribute("style", "margin: 0 auto");
        addBtn.classList.add("add-event", "black-btn");
        addBtn.innerHTML = t_add_new;
        addBtn.onclick = () => {
          const newEventDiv = document.createElement("div");
          newEventDiv.classList.add("new-event");
          newEventDiv.innerHTML = `
            <strong>${t_time}: </strong>
            <input type="time" class="new-event-time" name="new-event-time" value="">
            <input type="text" class="new-event-description" name="new-event-description" value="" placeholder="${t_desc_h}">
            <input type="text" class="new-event-place" name="new-event-place" value="" placeholder="${t_place_h}">
            <div class="new-event-buttons">
            </div>
          `;

          const btns = newEventDiv.querySelector(".new-event-buttons");

          const cancelBtn = document.createElement("button");
          cancelBtn.setAttribute("type", "button");
          cancelBtn.setAttribute("name", "cancel");
          cancelBtn.classList.add("black-btn");
          cancelBtn.innerHTML = "Cancel";
          cancelBtn.onclick = () => {
            newEventDiv.remove();
          };

          const saveBtn = document.createElement("button");
          saveBtn.setAttribute("type", "button");
          saveBtn.setAttribute("name", "save-new-event");
          saveBtn.classList.add("black-btn");
          saveBtn.innerHTML = "Save";
          saveBtn.onclick = () => {
            spiner.classList.add("visible");
            const newEventTime = document.querySelector(".new-event-time");
            const newEventDescription = document.querySelector(".new-event-description");
            const newEventPlace = document.querySelector(".new-event-place");
            $.post(backendPATH, {
              "save-new-event": true,
              "new-event-year": selectedY,
              "new-event-month": selectedM,
              "new-event-date": i,
              "new-event-hour": newEventTime.value.substring(0, 2),
              "new-event-minute": newEventTime.value.substring(3, 5),
              "new-event-description": newEventDescription.value,
              "new-event-place": newEventPlace.value
            }, function(data, status) {
              newEventDiv.remove();
              spiner.classList.remove("visible");
              const parsed = JSON.parse(data);
              if (parsed['status'] === 'success') {
                const eventDiv = document.createElement("div");
                eventDiv.classList.add("event");
                eventDiv.innerHTML = `
                  <div class="time">
                  <strong>Time: </strong>
                  <span>${parsed['event-hour']}:${parsed['event-minute']}</span>
                  </div>
                  <div class="description">
                  <strong>Event: </strong>
                  ${parsed['event-description']}
                  </div>
                  <div class="place">
                  <strong>Place: </strong>
                  ${parsed['event-place']}
                  </div>
                `;

                const savedEvents = events.querySelectorAll(".event");
                if (savedEvents.length > 0) {
                  const newEvHour = Number(parsed['event-hour']);
                  const newEvMinute = Number(parsed['event-minute']);

                  let placed = false;
                  savedEvents.forEach(e => {
                    if (!placed) {
                      const bufTime = e.querySelector(".time span").innerHTML;
                      const bufHour = Number(bufTime.substring(0, 2));
                      const bufMinute = Number(bufTime.substring(3));

                      if (bufHour > newEvHour) {
                        events.insertBefore(eventDiv, e);
                        placed = true;
                      } else if (bufHour === newEvHour){
                        if (bufMinute > newEvMinute) {
                          events.insertBefore(eventDiv, e);
                          placed = true;
                        }
                      }
                    }
                  });

                  if (!placed) {
                    events.insertBefore(eventDiv, addBtn);
                  }
                } else {
                  events.insertBefore(eventDiv, addBtn);
                }
              } else {
                alert(parsed['message']);
              }
            });
          };

          btns.appendChild(cancelBtn);
          btns.appendChild(saveBtn);

          events.insertBefore(newEventDiv, addBtn);
        }

        events.appendChild(addBtn);

        datesDiv.appendChild(newDate);
        day_idx = (day_idx + 1) % 7;
      }

    } else {
      alert(db['message']);
    }
  });

}

function deleteCalendar() {
  const calendarHolder = document.querySelector(".calendar-holder");
  calendarHolder.innerHTML = '';
}

function incYear() {
  const div = document.querySelector(".year-nav .current-year");
  selectedY++;
  div.innerHTML = selectedY;
  renderCalendar(selectedY, selectedM);
}

function decYear() {
  const div = document.querySelector(".year-nav .current-year");
  selectedY--;
  div.innerHTML = selectedY;
  renderCalendar(selectedY, selectedM);
}

function incMonth() {
  const div = document.querySelector(".month-nav .current-month");
  selectedM = (selectedM + 1) % month_names.length;
  div.innerHTML = month_names[selectedM];
  renderCalendar(selectedY, selectedM);
}

function decMonth() {
  const div = document.querySelector(".month-nav .current-month");
  selectedM = selectedM === 0 ? 11 : (selectedM - 1) % month_names.length;
  div.innerHTML = month_names[selectedM];
  renderCalendar(selectedY, selectedM);
}

function initMap() {
  // The location of Uluru
  var caminP6 = {lat: 44.4449716, lng: 26.0549469};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 17, center: caminP6});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: caminP6, map: map});
}

function setLanguage(l) {
  if (l === "romanian") {
    setRomanian();
  } else {
    setEnglish();
  }

  loadTopUsers();
  loadLogs(chartYear, chartMonth, chartDay, chartBars);
  if (logged_in) {
    renderCalendar(selectedY, selectedM);
  }
}

setLanguage(language);
// loadTopUsers();
// loadLogs(chartYear, chartMonth, chartDay, chartBars);
