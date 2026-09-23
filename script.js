/* ==========================================
   EMERGENCY SOS SYSTEM
   ========================================== */

let currentLatitude = null;
let currentLongitude = null;

let contacts =
    JSON.parse(localStorage.getItem("sosContacts")) || [];


/* ==========================================
   DOM ELEMENTS
   ========================================== */

const sosButton =
    document.getElementById("sosButton");

const locationButton =
    document.getElementById("locationButton");

const smsButton =
    document.getElementById("smsButton");

const mapButton =
    document.getElementById("mapButton");

const alarmButton =
    document.getElementById("alarmButton");

const addContact =
    document.getElementById("addContact");

const contactList =
    document.getElementById("contactList");

const alertBox =
    document.getElementById("alertBox");

const closeAlert =
    document.getElementById("closeAlert");

const alertMessage =
    document.getElementById("alertMessage");

const systemStatus =
    document.getElementById("systemStatus");

const locationText =
    document.getElementById("locationText");

const latitude =
    document.getElementById("latitude");

const longitude =
    document.getElementById("longitude");


/* ==========================================
   GET LOCATION
   ========================================== */

function getLocation() {

    if (!navigator.geolocation) {

        locationText.textContent =
            "Geolocation is not supported.";

        return;

    }


    locationText.textContent =
        "Detecting location...";


    navigator.geolocation.getCurrentPosition(

        function(position) {

            currentLatitude =
                position.coords.latitude;

            currentLongitude =
                position.coords.longitude;


            latitude.textContent =
                currentLatitude.toFixed(6);

            longitude.textContent =
                currentLongitude.toFixed(6);


            locationText.textContent =
                "Location detected successfully";


            systemStatus.textContent =
                "LOCATION READY";

            systemStatus.className = "ready";

        },


        function(error) {

            console.log(error);

            locationText.textContent =
                "Location permission denied.";

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );
}


/* ==========================================
   GOOGLE MAPS LOCATION
   ========================================== */

function getMapLink() {

    if (
        currentLatitude === null ||
        currentLongitude === null
    ) {

        return null;

    }


    return `https://www.google.com/maps?q=${currentLatitude},${currentLongitude}`;

}


/* ==========================================
   SOS ACTIVATION
   ========================================== */

function activateSOS() {

    alertBox.classList.add("show");


    systemStatus.textContent =
        "SOS ACTIVE";


    systemStatus.style.color =
        "#ff3347";


    if (
        currentLatitude === null ||
        currentLongitude === null
    ) {

        getLocation();

    }


    alertMessage.textContent =
        "Emergency mode activated. Your location is being prepared for sharing.";


    playAlarm();


    /*
       IMPORTANT:

       A normal browser cannot silently send SMS
       or automatically call emergency services.

       The code below opens the user's phone
       messaging/calling application.
    */

    setTimeout(function() {

        sendEmergencySMS();

    }, 1000);

}


/* ==========================================
   SEND SMS
   ========================================== */

function sendEmergencySMS() {

    let mapLink =
        getMapLink();


    let message =
        "🚨 EMERGENCY SOS ALERT 🚨\n\n" +
        "I need emergency assistance.\n";


    if (mapLink) {

        message +=
            "\n📍 My Location:\n" +
            mapLink;

    } else {

        message +=
            "\n📍 Location unavailable.";

    }


    /*
       If contacts exist, use first contact.
       Otherwise open SMS application.
    */

    if (contacts.length > 0) {

        let phone =
            contacts[0].phone;

        window.location.href =
            "sms:" +
            phone +
            "?body=" +
            encodeURIComponent(message);

    } else {

        window.location.href =
            "sms:?body=" +
            encodeURIComponent(message);

    }

}


/* ==========================================
   MAP BUTTON
   ========================================== */

mapButton.addEventListener(
    "click",
    function() {

        if (
            currentLatitude === null ||
            currentLongitude === null
        ) {

            alert(
                "Please detect your location first."
            );

            getLocation();

            return;

        }


        const mapLink =
            getMapLink();


        window.open(
            mapLink,
            "_blank"
        );

    }
);


/* ==========================================
   SMS BUTTON
   ========================================== */

smsButton.addEventListener(
    "click",
    function() {

        sendEmergencySMS();

    }
);


/* ==========================================
   LOCATION BUTTON
   ========================================== */

locationButton.addEventListener(
    "click",
    function() {

        getLocation();

    }
);


/* ==========================================
   SOS BUTTON
   ========================================== */

sosButton.addEventListener(
    "click",
    function() {

        activateSOS();

    }
);


/* ==========================================
   CLOSE ALERT
   ========================================== */

closeAlert.addEventListener(
    "click",
    function() {

        alertBox.classList.remove("show");

        systemStatus.textContent =
            "READY";

        systemStatus.style.color =
            "";

    }
);


/* ==========================================
   EMERGENCY CONTACTS
   ========================================== */

function saveContacts() {

    localStorage.setItem(
        "sosContacts",
        JSON.stringify(contacts)
    );

}


/* ==========================================
   DISPLAY CONTACTS
   ========================================== */

function displayContacts() {

    contactList.innerHTML = "";


    if (contacts.length === 0) {

        contactList.innerHTML =
            `<div class="empty-contact">
                No emergency contacts added.
            </div>`;

        return;

    }


    contacts.forEach(
        function(contact, index) {

            const item =
                document.createElement("div");

            item.className =
                "contact-item";


            item.innerHTML = `

                <div class="contact-info">

                    <strong>
                        ${escapeHTML(contact.name)}
                    </strong>

                    <span>
                        ${escapeHTML(contact.phone)}
                    </span>

                </div>

                <button
                    class="delete-contact"
                    onclick="deleteContact(${index})"
                >
                    Delete
                </button>

            `;


            contactList.appendChild(item);

        }
    );

}


/* ==========================================
   ADD CONTACT
   ========================================== */

addContact.addEventListener(
    "click",
    function() {

        const name =
            document
            .getElementById("contactName")
            .value
            .trim();


        const phone =
            document
            .getElementById("contactPhone")
            .value
            .trim();


        if (!name || !phone) {

            alert(
                "Please enter contact name and phone number."
            );

            return;

        }


        contacts.push({

            name: name,
            phone: phone

        });


        saveContacts();

        displayContacts();


        document.getElementById(
            "contactName"
        ).value = "";


        document.getElementById(
            "contactPhone"
        ).value = "";

    }
);


/* ==========================================
   DELETE CONTACT
   ========================================== */

function deleteContact(index) {

    contacts.splice(index, 1);

    saveContacts();

    displayContacts();

}


/* ==========================================
   BASIC HTML SECURITY
   ========================================== */

function escapeHTML(value) {

    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ==========================================
   ALARM
   ========================================== */

let audioContext = null;

function playAlarm() {

    try {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


        const oscillator =
            audioContext.createOscillator();


        const gain =
            audioContext.createGain();


        oscillator.type =
            "sine";


        oscillator.frequency.value =
            800;


        gain.gain.value =
            0.2;


        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );


        oscillator.start();


        setTimeout(
            function() {

                oscillator.stop();

                audioContext.close();

            },
            1500
        );

    }

    catch (error) {

        console.log(
            "Alarm unavailable:",
            error
        );

    }

}


/* ==========================================
   ALARM BUTTON
   ========================================== */

alarmButton.addEventListener(
    "click",
    function() {

        playAlarm();

    }
);


/* ==========================================
   INITIALIZE
   ========================================== */

displayContacts();

getLocation();
