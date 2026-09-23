```javascript
/* =========================================================
   EMERGENCY SOS SYSTEM
   FIREBASE CONFIGURATION + FIRESTORE
========================================================= */

import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    limit
} from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* =========================================================
   1. FIREBASE CONFIGURATION
========================================================= */

/*
   IMPORTANT:
   Replace these values with your Firebase Web App
   configuration from Firebase Console.
*/

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain:
        "YOUR_PROJECT_ID.firebaseapp.com",

    projectId:
        "YOUR_PROJECT_ID",

    storageBucket:
        "YOUR_PROJECT_ID.firebasestorage.app",

    messagingSenderId:
        "YOUR_MESSAGING_SENDER_ID",

    appId:
        "YOUR_APP_ID"

};


/* =========================================================
   2. INITIALIZE FIREBASE
========================================================= */

let app;

let db;


try {

    app = initializeApp(
        firebaseConfig
    );

    db = getFirestore(app);

    console.log(
        "Firebase initialized successfully."
    );

}

catch (error) {

    console.error(
        "Firebase initialization error:",
        error
    );

}


/* =========================================================
   3. SAVE SOS ALERT
========================================================= */

export async function saveSOSAlert(
    latitude = null,
    longitude = null,
    accuracy = null
) {

    if (!db) {

        throw new Error(
            "Firebase is not initialized."
        );

    }


    const alertData = {

        type:
            "EMERGENCY_SOS",

        status:
            "ACTIVE",

        latitude:
            latitude,

        longitude:
            longitude,

        accuracy:
            accuracy,

        locationAvailable:
            latitude !== null &&
            longitude !== null,

        createdAt:
            serverTimestamp(),

        device:
            navigator.userAgent,

        platform:
            navigator.platform

    };


    try {

        const documentReference =
            await addDoc(
                collection(
                    db,
                    "sosAlerts"
                ),
                alertData
            );


        console.log(
            "SOS alert saved:",
            documentReference.id
        );


        return documentReference.id;

    }

    catch (error) {

        console.error(
            "Error saving SOS alert:",
            error
        );


        throw error;

    }

}


/* =========================================================
   4. SAVE LOCATION UPDATE
========================================================= */

export async function saveLocation(
    latitude,
    longitude,
    accuracy = null
) {

    if (!db) {

        throw new Error(
            "Firebase is not initialized."
        );

    }


    try {

        const locationData = {

            latitude:
                latitude,

            longitude:
                longitude,

            accuracy:
                accuracy,

            createdAt:
                serverTimestamp()

        };


        const reference =
            await addDoc(
                collection(
                    db,
                    "locations"
                ),
                locationData
            );


        console.log(
            "Location saved:",
            reference.id
        );


        return reference.id;

    }

    catch (error) {

        console.error(
            "Location save error:",
            error
        );


        throw error;

    }

}


/* =========================================================
   5. LISTEN FOR SOS ALERTS
========================================================= */

export function listenForSOSAlerts(
    callback
) {

    if (!db) {

        console.error(
            "Firebase database is unavailable."
        );

        return () => {};

    }


    try {

        const alertsQuery =
            query(

                collection(
                    db,
                    "sosAlerts"
                ),

                orderBy(
                    "createdAt",
                    "desc"
                ),

                limit(20)

            );


        const unsubscribe =
            onSnapshot(

                alertsQuery,

                (snapshot) => {

                    const alerts =
                        snapshot.docs.map(
                            (document) => ({

                                id:
                                    document.id,

                                ...document.data()

                            })
                        );


                    if (
                        typeof callback ===
                        "function"
                    ) {

                        callback(
                            alerts
                        );

                    }

                },

                (error) => {

                    console.error(
                        "SOS listener error:",
                        error
                    );

                }

            );


        return unsubscribe;

    }

    catch (error) {

        console.error(
            "Unable to listen for SOS alerts:",
            error
        );


        return () => {};

    }

}


/* =========================================================
   6. FIREBASE CONNECTION TEST
========================================================= */

export function firebaseReady() {

    return db !== undefined &&
           db !== null;

}


/* =========================================================
   7. EXPORT FIREBASE OBJECTS
========================================================= */

export {

    app,
    db

};
```
