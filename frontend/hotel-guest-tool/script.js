
const API_URL = "https://vm2208.kaj.pouta.csc.fi:8803";


let API_KEY = localStorage.getItem('hotel_api_key');
if (!API_KEY) {
    API_KEY = prompt("Ge din api_key tack!");
    localStorage.setItem('hotel_api_key', API_KEY);
}

async function getBookings() {

    const resp = await fetch(`${API_URL}/bookings?api_key=${API_KEY}`);
    const bookings = await resp.json();

    document.querySelector('#guest-name').innerText = bookings[0].firstname;

    let bookingsHtml = "";
    for (b of bookings) {


        bookingsHtml += `
            <li>${b.id} - ${b.datefrom} Room: ${b.room_number} (${b.type}) 
            <b>${b.addinfo || ''}</b>
            
            <select id="stars-${b.id}" onchange="updateStars(${b.id})">
                <option value="1" ${(b.stars == 1) ? 'selected' : ''}>⭐</option>
                <option value="2" ${(b.stars == 2) ? 'selected' : ''}>⭐⭐</option>
                <option value="3" ${(b.stars == 3) ? 'selected' : ''}>⭐⭐⭐</option>
                <option value="4" ${(b.stars == 4) ? 'selected' : ''}>⭐⭐⭐⭐</option>
                <option value="5" ${(b.stars == 5) ? 'selected' : ''}>⭐⭐⭐⭐⭐</option>
            </select>
            
            </li>
        `;
    }
    document.querySelector('#bookings').innerHTML = bookingsHtml;
}
getBookings();

async function updateStars(booking_id) {

    const stars = document.querySelector(`#stars-${booking_id}`).value;

    console.log(stars)
    
    const resp = await fetch(`${API_URL}/bookings/${booking_id}?api_key=${API_KEY}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({stars: stars})
    })
    const respData = await resp.json();
    console.log(respData);
    getBookings();
}


async function createBooking() {
    // Detta ska POST:as till /bookings
    const booking = {
        room: document.querySelector('#room').value,
        datefrom: document.querySelector('#datefrom').value,
        addinfo: document.querySelector('#addinfo').value
    }
    console.log(booking);
    const resp = await fetch(`${API_URL}/bookings?api_key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
    })
    const respData = await resp.json();
    getBookings();
    console.log(respData);
}


async function getRooms() {
    const resp = await fetch(`${API_URL}/rooms`);
    const rooms = await resp.json();

    let roomsHtml = "";
    for (room of rooms) {
        roomsHtml += `
            <option value="${room.id}">
                ${room.room_number}
            </option>
        `;
    }
    document.querySelector('#room').innerHTML = roomsHtml;
}
getRooms();

document.querySelector('#btnBook').addEventListener('click', createBooking);
