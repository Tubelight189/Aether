// useReportNotifications.js
import * as Notifications from 'expo-notifications';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useRef } from 'react';
import { db } from '../config/firebase.config'; // ⚠️ Check this path matches your project!

// Helper to show the notification
async function triggerAlert(data) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🚨 New Danger Reported!",
      body: data.human_readable_summary || `New ${data.damage_type || 'hazard'} reported nearby.`,
      sound: true,
    },
    trigger: null, // Show immediately
  });
}

export const useReportNotifications = () => {
  const isFirstRun = useRef(true);

  useEffect(() => {
    // 1. Set up the listener on the 'reports' collection
    const reportCollection = collection(db, "reports");

    const unsubscribe = onSnapshot(reportCollection, (snapshot) => {
      
      // 2. IGNORE the initial load (so you don't get 50 alerts when you open the app)
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      }

      // 3. Check for NEW additions
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New report detected:", change.doc.data());
          triggerAlert(change.doc.data());
        }
      });
    });

    // 4. Cleanup when the app closes
    return () => unsubscribe();
  }, []);
};