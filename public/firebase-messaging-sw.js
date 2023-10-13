// Load the Firebase scripts using importScripts
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js");

// Initialize Firebase messaging
firebase.initializeApp({
  apiKey: "AIzaSyDaAUVXiU_EGWmk6UXBniSp1q7mgrtGXmk",
  authDomain: "messenger-ca7d6.firebaseapp.com",
  projectId: "messenger-ca7d6",
  storageBucket: "messenger-ca7d6.appspot.com",
  messagingSenderId: "159957457030",
  appId: "1:159957457030:web:0b4aecdcf5e309d1645907",
  measurementId: "G-22PFJFBF1R",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://scontent.fkhi17-1.fna.fbcdn.net/v/t39.8562-6/120009688_325579128711709_1736249742330805861_n.png?_nc_cat=1&ccb=1-7&_nc_sid=f537c7&_nc_ohc=dgqYfbUWt5cAX8ZjnTl&_nc_ht=scontent.fkhi17-1.fna&oh=00_AfD0-P5iHyFGRpjfEWYLZPSUQ0uHTT1NqxuPiAkuINCZYA&oe=652DB4BD",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
