import { Platform } from 'react-native';
import api from '../config/api';

let Notifications;
let isExpoGo = false;

try {
  const Constants = require('expo-constants').default;
  // In Expo SDK 53+, 'storeClient' indicates running inside Expo Go
  isExpoGo = Constants.executionEnvironment === 'storeClient';
} catch (e) {
  isExpoGo = false;
}

if (isExpoGo) {
  console.log('[NotificationService] Running in Expo Go. Mocking notifications to prevent SDK 53+ remote notifications crash.');
  Notifications = {
    setNotificationHandler: () => {},
    scheduleNotificationAsync: async () => 'mock-id',
    setNotificationChannelAsync: async () => {},
    getPermissionsAsync: async () => ({ status: 'granted' }),
    requestPermissionsAsync: async () => ({ status: 'granted' }),
    getExpoPushTokenAsync: async () => ({ data: 'mock-expo-push-token' }),
    addNotificationReceivedListener: () => ({ remove: () => {} }),
    addNotificationResponseReceivedListener: () => ({ remove: () => {} }),
    AndroidNotificationPriority: {
      DEFAULT: 'default',
      LOW: 'low',
      MIN: 'min',
      HIGH: 'high',
      MAX: 'max',
    },
    AndroidImportance: {
      DEFAULT: 'default',
      LOW: 'low',
      MIN: 'min',
      HIGH: 'high',
      MAX: 'max',
    },
  };
} else {
  try {
    Notifications = require('expo-notifications');
  } catch (e) {
    console.warn('[NotificationService] Failed to load native expo-notifications:', e);
  }
}

// Configure default notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.token = null;
  }

  /**
   * Request push notification permission and retrieve the push token
   */
  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#14b8a6',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return null;
    }

    try {
      // Get the token from Expo
      const tokenData = await Notifications.getExpoPushTokenAsync({
        // Optional: Add project id if configured in Expo Dashboard
        // projectId: 'your-project-id-here'
      });
      token = tokenData.data;
      this.token = token;
      console.log('[NotificationService] Expo Push Token:', token);

      // Send the token to the backend
      await this.saveTokenToBackend(token);
    } catch (error) {
      console.warn('[NotificationService] Error getting push token:', error);
    }

    return token;
  }

  /**
   * Send the retrieved device push token to Node.js backend
   */
  async saveTokenToBackend(pushToken) {
    try {
      // Attempt to hit user settings / notifications endpoint
      await api.post('/users/push-token', {
        pushToken,
        platform: Platform.OS,
      });
      console.log('[NotificationService] Successfully registered push token with Node.js backend.');
    } catch (e) {
      // Log error but gracefully fallback since mock endpoints may not exist
      console.log('[NotificationService] Backend registration fallback (offline/mock API):', e.message);
    }
  }

  /**
   * Add listener for notifications received while app is running in foreground
   */
  addNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Add listener for when a user clicks/taps on a notification (foreground or background)
   */
  addNotificationResponseReceivedListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * Trigger a local notification immediately (useful for reminders/offline alerts)
   */
  async scheduleLocalNotification(title, body, data = {}) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // deliver immediately
    });
  }
}

export default new NotificationService();
