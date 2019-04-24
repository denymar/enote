const backendPATH = "http://localhost:8090";
const month_names =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const day_names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const d = new Date();
let selectedM = d.getMonth();
let selectedY = d.getFullYear();

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

const loginSubmit = document.querySelector(`input[name='submit-login']`);
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
      account.style.display = "none";
      authentication.style.display = "flex";
      currentUser.innerHTML = "";
      deleteCalendar(selectedY, selectedM);
      startPageHolder.style.display = "block";
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
      renderCalendar(selectedY, selectedM);
    }
  });
}

checkSession();

const signupSubmit = document.querySelector(`input[name='submit-signup']`);
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
    calendarHolder.innerHTML = `
    <div class="event-list">
      <div class="year-nav">
        <div class="prev-year" onclick="decYear()"></div>
        <div class="current-year">${selectedY}</div>
        <div class="next-year" onclick="incYear()"></div>
      </div>
      <div class="month-nav">
        <div class="prev-month" onclick="decMonth()"></div>
        <div class="current-month">${month_names[selectedM]}</div>
        <div class="next-month" onclick="incMonth()"></div>
      </div>
      <div class="dates">
      </div>
    </div>
    `;

    spiner.classList.remove("visible");
    console.log(data);
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

        newDate.innerHTML = `
          <div class="day-and-date">
            <div class="day">${day_names[day_idx]}</div>
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
              <strong>Time: </strong>
              <span>${modHour}:${modMinute}</span>
              </div>
              <div class="description">
                <strong>Event: </strong>
                ${item['event']}
              </div>
              <div class="place">
                <strong>Place: </strong>
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
        addBtn.innerHTML = "<span>Add New</span>";
        addBtn.onclick = () => {
          const newEventDiv = document.createElement("div");
          newEventDiv.classList.add("new-event");
          newEventDiv.innerHTML = `
            <strong>Time: </strong>
            <input type="time" class="new-event-time" name="new-event-time" value="" placeholder="Time">
            <input type="text" class="new-event-description" name="new-event-description" value="" placeholder="Type event description">
            <input type="text" class="new-event-place" name="new-event-place" value="" placeholder="Type event place">
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
            console.log("time: ", newEventTime.value);
            console.log("v time: ",newEventTime.value.substring(0, 2),":",  newEventTime.value.substring(3));
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
              console.log(data);
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
                  console.log(savedEvents);
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
