const Stations = [
    "Zermatt Bus Terminal",
    "Interlaken Ost Bus Station",
    "Grindelwald Bus Terminal",
    "Lauterbrunnen Bahnhof",
    "Lucerne Bahnhofquai",
    "Chamonix-Mont-Blanc Sud",
    "Geneva Bus Station",
    "Bern PostAuto Terminal",
    "Gstaad Bus Station",
    "St. Moritz Bahnhof PostAuto",
    "Verbier Village",
    "Davos Platz Postautohaltestelle",
    "Andermatt Gotthardpass",
    "Tasch Bahnhof",
    "Flims Dorf Post",
    "Chamonix Sud Bus Station",
    "Annecy Gare Routiere",
    "Grenoble Gare Routiere",
    "Nice Airport",
    "Bourg-Saint-Maurice Gare Routiere",
    "Morzine Gare Routiere",
    "Les Gets Gare Routiere",
    "Val d'Isere Centre",
    "Courchevel 1850",
    "Megève Place du Village",
    "Aosta Autostazione",
    "Bolzano Autostazione",
    "Trento Autostazione",
    "Cortina d'Ampezzo Autostazione",
    "Bormio Bus Station",
    "Livigno Centro",
    "Merano Autostazione",
    "Sestriere Bus Stop",
    "Ortisei (St. Ulrich) Autostazione",
    "Canazei Piazza Marconi",
    "Innsbruck Hauptbahnof Bus Terminal",
    "Salzburg Sud Busbahnhof",
    "Mayrhofen Bahnhof",
    "Lech am Arlberg Postamt",
    "Kitzbuhel Hahnenkammbahn",
    "Ischgl Seilbahn",
    "Zell am See Postplatz",
    "Bad Gastein Bahnhof",
    "St. Anton am Arlberg Bahnhof",
    "Solden Postamt",
    "Garmisch-Partenkirchen Bahnhof",
    "Berchtesgaden Busbahnhof",
    "Oberstdorf Busbahnhof",
    "Fussen Bahnhof",
    "Mittenwald Bahnhof",
    "Bled Bus Station",
    "Bohinj Jezero",
    "Kranjska Gora Avtobusna Postaja"
];

document.addEventListener('DOMContentLoaded', function() {
    const departureInput = document.querySelector('input[name="departure"]');
    const arrivalInput = document.querySelector('input[name="arrival"]');
    const passengerCountSpan = document.querySelector('.passenger-count');
    const counterMinus = document.querySelector('.counter-minus');
    const counterPlus = document.querySelector('.counter-plus');
    const tripRadios = document.querySelectorAll('input[name="trip"]');
    const returnBtn = document.querySelector('.return-btn');
    const departBtn = document.querySelector('.depart-btn');
    const departDateInput = document.querySelector('.depart-date-input');
    const returnDateInput = document.querySelector('.return-date-input');
    const searchForm = document.querySelector('.ticket-form');
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('nav');
    const navHeaderMobile = document.querySelector('.nav-header-mobile');
    const navCloseMobile = document.querySelector('.nav-header-mobile .nav-close');

    let selectedDepartDate = null;
    let selectedReturnDate = null;
    let currentPassengers = 1;
    let isOneWay = false;
    let activePicker = null;

    function updatePassengerCount() {
        if (!passengerCountSpan) return;
        passengerCountSpan.textContent = currentPassengers;

        if (counterMinus) {
            counterMinus.disabled = currentPassengers <= 1;
            counterMinus.style.opacity = currentPassengers <= 1 ? '0.4' : '1';
        }

        if (counterPlus) {
            counterPlus.disabled = currentPassengers >= 12;
            counterPlus.style.opacity = currentPassengers >= 12 ? '0.4' : '1';
        }
    }

    if (counterMinus) {
        counterMinus.addEventListener('click', function() {
            if (currentPassengers > 1) {
                currentPassengers--;
                updatePassengerCount();
            }
        });
    }

    if (counterPlus) {
        counterPlus.addEventListener('click', function() {
            if (currentPassengers < 12) {
                currentPassengers++;
                updatePassengerCount();
            }
        });
    }

    updatePassengerCount();

    function updateTripType() {
        isOneWay = document.querySelector('input[name="trip"][value="oneway"]').checked;

        if (returnBtn) {
            if (isOneWay) {
                returnBtn.disabled = true;
                returnBtn.style.opacity = '0.5';
                returnBtn.style.cursor = 'not-allowed';
                returnBtn.querySelector('.date-label').textContent = 'N/A';
                returnBtn.classList.remove('has-date');
                selectedReturnDate = null;
                if (returnDateInput) returnDateInput.value = '';
            } else {
                returnBtn.disabled = false;
                returnBtn.style.opacity = '1';
                returnBtn.style.cursor = 'pointer';
                returnBtn.querySelector('.date-label').textContent = selectedReturnDate ? formatDate(selectedReturnDate) : 'Return';
                if (selectedReturnDate) returnBtn.classList.add('has-date');
            }
        }
    }

    for (let radio of tripRadios) {
        radio.addEventListener('change', updateTripType);
    }

    updateTripType();

    let calendarEl = null;
    let currentMonth = new Date();

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString + 'T00:00:00');
        const day = date.getDate();
        const month = date.toLocaleString('en', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    }

    function getMonthData(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        return { year, month, startDayOfWeek, daysInMonth };
    }

    function renderMonth(date, side) {
        const { year, month, startDayOfWeek, daysInMonth } = getMonthData(date);
        const monthName = date.toLocaleString('en', { month: 'long', year: 'numeric' });

        let html = `<div class="calendar-month ${side}">`;
        html += `<div class="calendar-month-header">`;
        html += `<button class="calendar-nav prev" data-dir="-1" data-side="${side}">‹</button>`;
        html += `<span class="calendar-month-title">${monthName}</span>`;
        html += `<button class="calendar-nav next" data-dir="1" data-side="${side}">›</button>`;
        html += `</div>`;

        html += `<div class="calendar-weekdays">`;
        const weekdays = ['M','T','W','T','F','S','S'];
        weekdays.forEach(d => html += `<span>${d}</span>`);
        html += `</div>`;

        html += `<div class="calendar-days">`;

        const adjustedStart = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
        for (let i = 0; i < adjustedStart; i++) {
            html += `<span class="calendar-day empty"></span>`;
        }

        const today = new Date();
        today.setHours(0,0,0,0);

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(year, month, day);
            const dateStr = dayDate.toISOString().split('T')[0];

            let classes = ['calendar-day'];

            if (dayDate < today) {
                classes.push('disabled');
            }

            if (selectedDepartDate === dateStr) {
                classes.push('selected-depart');
            }

            if (selectedReturnDate === dateStr) {
                classes.push('selected-return');
            }

            if (selectedDepartDate && selectedReturnDate && 
                dateStr > selectedDepartDate && dateStr < selectedReturnDate) {
                classes.push('in-range');
            }

            html += `<span class="${classes.join(' ')}" data-date="${dateStr}">${day}</span>`;
        }

        html += `</div></div>`;
        return html;
    }

    function showCalendar(pickerType) {
        activePicker = pickerType;

        if (calendarEl) calendarEl.remove();

        calendarEl = document.createElement('div');
        calendarEl.className = 'custom-calendar';

        const leftMonth = new Date(currentMonth);
        const rightMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

        calendarEl.innerHTML = `
            <div class="calendar-body">
                ${renderMonth(leftMonth, 'left')}
                ${renderMonth(rightMonth, 'right')}
            </div>
            <div class="calendar-footer">
                <button class="calendar-reset">Reset</button>
                <button class="calendar-apply">Apply</button>
            </div>
        `;

        const formContainer = document.querySelector('.ticket-form');
        if (formContainer) {
            formContainer.style.position = 'relative';
            formContainer.appendChild(calendarEl);
        } else {
            document.body.appendChild(calendarEl);
        }

        // Calendar positioning is handled by CSS (absolute within form)

        calendarEl.addEventListener('click', function(e) {
            e.stopPropagation();

            if (e.target.classList.contains('calendar-nav')) {
                const dir = parseInt(e.target.dataset.dir);
                currentMonth.setMonth(currentMonth.getMonth() + dir);
                showCalendar(activePicker);
                return;
            }

            if (e.target.classList.contains('calendar-day') && !e.target.classList.contains('empty') && !e.target.classList.contains('disabled')) {
                const dateStr = e.target.dataset.date;

                if (activePicker === 'depart') {
                    selectedDepartDate = dateStr;
                    if (selectedReturnDate && selectedReturnDate < selectedDepartDate) {
                        selectedReturnDate = null;
                        returnDateInput.value = '';
                        returnBtn.querySelector('.date-label').textContent = 'Return';
                        returnBtn.classList.remove('has-date');
                    }
                    departBtn.querySelector('.date-label').textContent = formatDate(dateStr);
                    departBtn.classList.add('has-date');
                    if (departDateInput) departDateInput.value = dateStr;
                } else {
                    if (selectedDepartDate && dateStr < selectedDepartDate) {
                        return;
                    }
                    selectedReturnDate = dateStr;
                    returnBtn.querySelector('.date-label').textContent = formatDate(dateStr);
                    returnBtn.classList.add('has-date');
                    if (returnDateInput) returnDateInput.value = dateStr;
                }

                showCalendar(activePicker);
            }

            if (e.target.classList.contains('calendar-reset')) {
                if (activePicker === 'depart') {
                    selectedDepartDate = null;
                    departBtn.querySelector('.date-label').textContent = 'Depart';
                    departBtn.classList.remove('has-date');
                    if (departDateInput) departDateInput.value = '';
                } else {
                    selectedReturnDate = null;
                    returnBtn.querySelector('.date-label').textContent = 'Return';
                    returnBtn.classList.remove('has-date');
                    if (returnDateInput) returnDateInput.value = '';
                }
                showCalendar(activePicker);
            }

            if (e.target.classList.contains('calendar-apply')) {
                closeCalendar();
            }
        });
    }

    function closeCalendar() {
        if (calendarEl) {
            calendarEl.remove();
            calendarEl = null;
        }
        activePicker = null;
    }

    if (departBtn) {
        departBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (calendarEl && activePicker === 'depart') {
                closeCalendar();
            } else {
                showCalendar('depart');
            }
        });
    }

    if (returnBtn) {
        returnBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (isOneWay) return;
            if (calendarEl && activePicker === 'return') {
                closeCalendar();
            } else {
                showCalendar('return');
            }
        });
    }

    document.addEventListener('click', function(e) {
        if (calendarEl && !calendarEl.contains(e.target)) {
            closeCalendar();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && calendarEl) {
            closeCalendar();
        }
    });

    function setupAutocomplete(inputElement) {
        if (!inputElement) return;

        const oldDropdown = inputElement.parentNode.querySelector('.autocomplete-dropdown');
        if (oldDropdown) oldDropdown.remove();

        let dropdown = document.createElement('ul');
        dropdown.className = 'autocomplete-dropdown';
        dropdown.style.display = 'none';
        inputElement.parentNode.appendChild(dropdown);

        let selectedIndex = -1;
        let filteredStations = [];

        inputElement.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            selectedIndex = -1;

            if (query.length < 1) {
                dropdown.style.display = 'none';
                return;
            }

            filteredStations = Stations.filter(station =>
                station.toLowerCase().includes(query)
            ).slice(0, 8);

            if (filteredStations.length > 0) {
                dropdown.innerHTML = '';
                filteredStations.forEach((station, index) => {
                    const li = document.createElement('li');
                    li.textContent = station;
                    li.dataset.index = index;
                    li.addEventListener('click', function() {
                        inputElement.value = station;
                        dropdown.style.display = 'none';
                        selectedIndex = -1;
                    });
                    dropdown.appendChild(li);
                });
                dropdown.style.display = 'block';
            } else {
                dropdown.innerHTML = '<li class="not-found">No stations found</li>';
                dropdown.style.display = 'block';
            }
        });

        inputElement.addEventListener('keydown', function(e) {
            const items = dropdown.querySelectorAll('li:not(.not-found)');

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                items.forEach((item, i) => {
                    item.style.background = i === selectedIndex ? '#F0F7FF' : '';
                });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                items.forEach((item, i) => {
                    item.style.background = i === selectedIndex ? '#F0F7FF' : '';
                });
            } else if (e.key === 'Enter' && selectedIndex >= 0 && items[selectedIndex]) {
                e.preventDefault();
                inputElement.value = filteredStations[selectedIndex];
                dropdown.style.display = 'none';
                selectedIndex = -1;
            } else if (e.key === 'Escape') {
                dropdown.style.display = 'none';
                selectedIndex = -1;
            }
        });

        document.addEventListener('click', function(e) {
            if (!inputElement.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
                selectedIndex = -1;
            }
        });
    }

    setupAutocomplete(departureInput);
    setupAutocomplete(arrivalInput);

    function showModal(message) {
        const existingModal = document.querySelector('.custom-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        modal.innerHTML = `
            <div class="custom-modal-content">
                <p>${message}</p>
                <button class="custom-modal-close">OK</button>
            </div>
        `;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.custom-modal-close');

        function closeModal() {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 200);
        }

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    function validateForm() {
        const departure = departureInput ? departureInput.value.trim() : '';
        const arrival = arrivalInput ? arrivalInput.value.trim() : '';

        if (!departure) {
            showModal('Please enter departure station');
            return false;
        }

        if (!arrival) {
            showModal('Please enter arrival station');
            return false;
        }

        if (departure === arrival) {
            showModal('Departure and arrival stations cannot be the same');
            return false;
        }

        if (!selectedDepartDate) {
            showModal('Please select departure date');
            return false;
        }

        if (!isOneWay && !selectedReturnDate) {
            showModal('Please select return date');
            return false;
        }

        if (!isOneWay && selectedReturnDate && selectedDepartDate && selectedReturnDate < selectedDepartDate) {
            showModal('Return date must be later than departure date');
            return false;
        }

        return true;
    }

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validateForm()) {
                const searchData = {
                    departure: departureInput ? departureInput.value : '',
                    arrival: arrivalInput ? arrivalInput.value : '',
                    departDate: selectedDepartDate,
                    returnDate: isOneWay ? null : selectedReturnDate,
                    passengers: currentPassengers,
                    tripType: isOneWay ? 'oneway' : 'round'
                };
                localStorage.setItem('wondersSearchData', JSON.stringify(searchData));
                window.location.href = 'bus-list.html';
            }
        });
    }

    function openMenu() {
        closeCalendar();
        nav.classList.add('show');
        burger.classList.add('active');
        if (navHeaderMobile) {
            navHeaderMobile.classList.add('active');
        }
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        nav.classList.remove('show');
        burger.classList.remove('active');
        if (navHeaderMobile) {
            navHeaderMobile.classList.remove('active');
        }
        document.body.classList.remove('menu-open');
    }

    if (burger && nav) {
        burger.addEventListener('click', function(e) {
            e.stopPropagation();
            if (nav.classList.contains('show')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (navCloseMobile) {
            navCloseMobile.addEventListener('click', function(e) {
                e.stopPropagation();
                closeMenu();
            });
        }

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });

        document.addEventListener('click', function(e) {
            if (nav.classList.contains('show') && !nav.contains(e.target) && !burger.contains(e.target) && (!navHeaderMobile || !navHeaderMobile.contains(e.target))) {
                closeMenu();
            }
        });
    }

    if (window.location.pathname.includes('bus-list.html')) {
        const storedData = localStorage.getItem('wondersSearchData');
        if (storedData) {
            const data = JSON.parse(storedData);

            const fromStationElem = document.getElementById('from-station');
            const toStationElem = document.getElementById('to-station');
            const dateElem = document.getElementById('travel-date');
            const passengersElem = document.getElementById('passengers-count');

            if (fromStationElem) fromStationElem.textContent = data.departure || '—';
            if (toStationElem) toStationElem.textContent = data.arrival || '—';
            if (dateElem) dateElem.textContent = data.departDate ? formatDate(data.departDate) : '—';
            if (passengersElem) passengersElem.textContent = data.passengers || '1';
        }
    }
});