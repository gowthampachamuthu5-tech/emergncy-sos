```javascript
"use strict";

/* =====================================================
   EMERGENCY SOS SYSTEM
   New Complete JavaScript
===================================================== */


/* =====================================================
   SELECT ELEMENTS
===================================================== */

const $ = (id) => document.getElementById(id);

const sosButton = $("sosButton");
const cancelButton = $("cancelButton");

const locationButton = $("locationButton");
const callButton = $("callButton");
const messageButton = $("messageButton");

const sosModal = $("sosModal");
const countdownElement = $("countdown");
const progressBar = $("progressBar");

const locationStatus = $("locationStatus");
const mapButton = $("mapButton");

const sosStatus = $("sosStatus");
const systemStatus = $("systemStatus");

const historyElement = $("history");
const toast = $("toast");


/* =====================================================
   VARIABLES
===================================================== */

let currentLocation = null;

let countdownTimer = null;

let countdown = 5;

let sosActive = false;

let toastTimer = null;


/* =====================================================
   SAFE TEXT UPDATE
===================================================== */

function updateText(element, text) {

    if (element) {
        element.textContent = text;
    }

}


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    if (!toast) {
        return;
    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* =====================================================
   LOCATION
===================================================== */

function getLocation() {

    return new Promise((resolve, reject) => {

        if (!navigator.geolocation) {

            reject(
                new Error(
                    "Geolocation is not supported by this browser."
                )
            );

            return;
        }


        navigator.geolocation.getCurrentPosition(

            (position) => {

                currentLocation = {

                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude,

                    accuracy:
                        position.coords.accuracy

                };


                updateLocation();


                resolve(currentLocation);

            },


            (error) => {

                let message =
                    "Unable to get your location.";


                if (
                    error.code ===
                    error.PERMISSION_DENIED
                ) {

                    message =
                        "Location permission was denied.";

                }

                else if (
                    error.code ===
                    error.POSITION_UNAVAILABLE
                ) {

                    message =
                        "Location information is unavailable.";

                }

                else if (
                    error.code ===
                    error.TIMEOUT
                ) {

                    message =
                        "Location request timed out.";

                }


                reject(
                    new Error(message)
                );

            },


            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }

        );

    });

}


/* =====================================================
   UPDATE LOCATION
===================================================== */

function updateLocation() {

    if (!currentLocation) {
        return;
    }


    const lat =
        currentLocation.latitude.toFixed(6);

    const lng =
        currentLocation.longitude.toFixed(6);


    updateText(
        locationStatus,
        ${lat}, ${lng}`
    


    if (mapButton) {

        const mapURL =
            `https://www.google.com/maps?q=${lat},${lng}`;


        mapButton.href = mapURL;

        mapButton.classList.remove(
            "hidden"
        );

    }

 



/* =====================================================
   LOCATE ME
===================================================== */

if (locationButton) {

    locationButton.addEventListener(
        "click",
        async () => {

            updateText(
                locationStatus,
                "Detecting..."
            );


            updateText(
                systemStatus,
                "Getting GPS..."
            );


            locationButton.disabled = true;


            try {

                await getLocation();


                updateText(
                    systemStatus,
                    "Location ready"
                );


                showToast(
                    "GPS location detected."
                );

            }

            catch (error) {

                updateText(
                    locationStatus,
                    "Unavailable"
                );


                updateText(
                    systemStatus,
                    "GPS unavailable"
                );


                showToast(
                    error.message
                );

            }

            finally {

                locationButton.disabled = false;

            }

        }
    );

}


/* =====================================================
   CALL EMERGENCY SERVICE
===================================================== */

if (callButton) {

    callButton.addEventListener(
        "click",
        () => {

            const answer =
                window.confirm(
                    "Call emergency services at 112?"
                );


            if (!answer) {
                return;
            }


            window.location.href =
                "tel:112";

        }
    );

}


/* =====================================================
   CREATE SOS MESSAGE
===================================================== */

function createSOSMessage() {

    let message =
        "EMERGENCY SOS ALERT\n\n" +
        "I need emergency assistance.";


    if (currentLocation) {

        const lat =
            currentLocation.latitude.toFixed(6);

        const lng =
            currentLocation.longitude.toFixed(6);


        const map =
            `https://www.google.com/maps?q=${lat},${lng}`;


        message +=
            `\n\nMy current location:\n${map}`;

    }


    return message;

}


/* =====================================================
   SOS MESSAGE BUTTON
===================================================== */

if (messageButton) {

    messageButton.addEventListener(
        "click",
        async () => {

            updateText(
                systemStatus,
                "Preparing SOS message..."
            );


            try {

                if (!currentLocation) {

                    await getLocation();

                }


                const message =
                    createSOSMessage();


                const smsURL =
                    `sms:?body=${encodeURIComponent(message)}`;


                updateText(
                    systemStatus,
                    "Message ready"
                );


                showToast(
                    "SOS message prepared."
                );


                window.location.href =
                    smsURL;

            }

            catch (error) {

                updateText(
                    systemStatus,
                    "Message unavailable"
                );


                showToast(
                    error.message
                );

            }

        }
    );

}


/* =====================================================
   OPEN SOS MODAL
===================================================== */

function openSOSModal() {

    if (!sosModal) {
        return;
    }


    sosModal.classList.add("show");

}


/* =====================================================
   CLOSE SOS MODAL
===================================================== */

function closeSOSModal() {

    if (!sosModal) {
        return;
    }


    sosModal.classList.remove("show");

}


/* =====================================================
   UPDATE PROGRESS
===================================================== */

function updateProgress(value) {

    if (!progressBar) {
        return;
    }


    const safeValue =
        Math.max(
            0,
            Math.min(100, value)
        );


    progressBar.style.width =
        `${safeValue}%`;

}


/* =====================================================
   START SOS
===================================================== */

if (sosButton) {

    sosButton.addEventListener(
        "click",
        startSOS
    );

}


async function startSOS() {

    if (sosActive) {
        return;
    }


    sosActive = true;

    countdown = 5;


    document.body.classList.add(
        "sos-active"
    );


    openSOSModal();


    updateProgress(100);


    updateText(
        sosStatus,
        "Activating"
    );


    updateText(
        systemStatus,
        "Getting location"
    );


    updateText(
        countdownElement,
        "Detecting your location..."
    );


    try {

        await getLocation();

    }

    catch (error) {

        resetSOS();


        showToast(
            error.message
        );


        return;

    }


    updateText(
        systemStatus,
        "SOS ready"
    );


    updateText(
        countdownElement,
        "SOS activates in 5 seconds"
    );


    countdownTimer =
        setInterval(
            runCountdown,
            1000
        );

}


/* =====================================================
   COUNTDOWN
===================================================== */

function runCountdown() {

    countdown--;


    const percentage =
        (countdown / 5) * 100;


    updateProgress(
        percentage
    );


    if (countdown > 0) {

        updateText(
            countdownElement,
            `SOS activates in ${countdown} seconds`
        );

        return;
    }


    stopCountdown();

    activateSOS();

}


/* =====================================================
   STOP COUNTDOWN
===================================================== */

function stopCountdown() {

    if (countdownTimer !== null) {

        clearInterval(
            countdownTimer
        );

        countdownTimer = null;

    }

}


/* =====================================================
   CANCEL SOS
===================================================== */

if (cancelButton) {

    cancelButton.addEventListener(
        "click",
        cancelSOS
    );

}


function cancelSOS() {

    if (!sosActive) {
        return;
    }


    stopCountdown();


    sosActive = false;


    document.body.classList.remove(
        "sos-active"
    );


    closeSOSModal();


    updateProgress(100);


    updateText(
        sosStatus,
        "Standby"
    );


    updateText(
        systemStatus,
        "Ready"
    );


    showToast(
        "SOS cancelled."
    );

}


/* =====================================================
   ACTIVATE SOS
===================================================== */

function activateSOS() {

    if (!sosActive) {
        return;
    }


    updateText(
        sosStatus,
        "SOS ACTIVE"
    );


    updateText(
        systemStatus,
        "Emergency activated"
    );


    updateText(
        countdownElement,
        "EMERGENCY SOS ACTIVATED"
    );


    updateProgress(0);


    saveHistory();


    showToast(
        "Emergency SOS activated."
    );


    /*
       Prepare the emergency SMS after
       a short visual activation delay.
    */

    setTimeout(
        () => {

            if (!sosActive) {
                return;
            }


            prepareSMS();

        },
        1500
    );

}


/* =====================================================
   PREPARE SMS
===================================================== */

function prepareSMS() {

    const message =
        createSOSMessage();


    const smsURL =
        `sms:?body=${encodeURIComponent(message)}`;


    /*
       Opens the phone's SMS application.
       The user/device controls final sending.
    */

    window.location.href =
        smsURL;

}


/* =====================================================
   SAVE SOS HISTORY
===================================================== */

function saveHistory() {

    let history = [];


    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "sosHistory"
                ) || "[]"
            );


        if (!Array.isArray(history)) {

            history = [];

        }

    }

    catch (error) {

        history = [];

    }


    const record = {

        id:
            Date.now(),

        date:
            new Date().toLocaleString(),

        latitude:
            currentLocation
                ? currentLocation.latitude
                : null,

        longitude:
            currentLocation
                ? currentLocation.longitude
                : null

    };


    history.unshift(record);


    /*
       Keep only the latest 10 events.
    */

    history =
        history.slice(0, 10);


    try {

        localStorage.setItem(
            "sosHistory",
            JSON.stringify(history)
        );

    }

    catch (error) {

        console.warn(
            "Could not save SOS history.",
            error
        );

    }


    displayHistory();

}


/* =====================================================
   DISPLAY HISTORY
===================================================== */

function displayHistory() {

    if (!historyElement) {
        return;
    }


    let history = [];


    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "sosHistory"
                ) || "[]"
            );


        if (!Array.isArray(history)) {

            history = [];

        }

    }

    catch (error) {

        history = [];

    }


    if (history.length === 0) {

        historyElement.innerHTML = `

            <div class="empty">

                ✓

                <br><br>

                No SOS activity recorded.

            </div>

        `;

        return;

    }


    historyElement.innerHTML =
        history
            .map(
                (record) => {

                    const date =
                        escapeHTML(
                            record.date ||
                            "Unknown"
                        );


                    let location =
                        "Location unavailable";


                    let mapLink =
                        "";


                    if (
                        typeof record.latitude ===
                            "number" &&
                        typeof record.longitude ===
                            "number"
                    ) {

                        const lat =
                            record.latitude.toFixed(5);

                        const lng =
                            record.longitude.toFixed(5);


                        location =
                            `${lat}, ${lng}`;


                        const mapURL =
                            `https://www.google.com/maps?q=${lat},${lng}`;


                        mapLink = `

                            <a
                                class="history-map"
                                href="${mapURL}"
                                target="_blank"
                                rel="noopener noreferrer">

                                MAP

                            </a>

                        `;

                    }


                    return `

                        <div class="history-item">

                            <div class="history-icon">
                                🚨
                            </div>

                            <div class="history-info">

                                <strong>
                                    SOS ACTIVATED
                                </strong>

                                <small>
                                    ${date}
                                    •
                                    ${escapeHTML(location)}
                                </small>

                            </div>

                            ${mapLink}

                        </div>

                    `;

                }
            )
            .join("");

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            sosActive
        ) {

            cancelSOS();

        }

    }
);


/* =====================================================
   CLICK OUTSIDE MODAL
===================================================== */

if (sosModal) {

    sosModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                sosModal
            ) {

                /*
                   Do not automatically cancel an
                   active SOS by accidental clicks.
                */

                if (sosActive) {

                    showToast(
                        "Use CANCEL SOS to stop the alert."
                    );

                }

            }

        }
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

function initialize() {

    updateText(
        systemStatus,
        "Ready"
    );


    updateText(
        sosStatus,
        "Standby"
    );


    updateText(
        locationStatus,
        "Not detected"
    );


    updateProgress(100);


    displayHistory();


    console.log(
        "Emergency SOS System: Ready"
    );

}


/* =====================================================
   START
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );

}

else {

    initialize();

}

