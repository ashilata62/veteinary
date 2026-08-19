import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

let Notifications;
let isExpoGo = false;

try {
  const Constants = require('expo-constants').default;
  isExpoGo = Constants.executionEnvironment === 'storeClient';
} catch (e) {
  isExpoGo = false;
}

if (isExpoGo) {
  Notifications = {
    scheduleNotificationAsync: async () => 'mock-id',
    AndroidNotificationPriority: { HIGH: 'high' },
  };
} else {
  try {
    Notifications = require('expo-notifications');
  } catch (e) {
    console.warn('[OfflineSyncService] Failed to load native expo-notifications:', e);
  }
}


const MUTATION_QUEUE_KEY = '@petcare_sync_queue';
const CACHE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes cache

class OfflineSyncService {
  constructor() {
    this.isOnline = true;
    this.apiClient = null;
    this.isSyncing = false;
    this.listeners = [];

    // Initialize network status listener
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = !!state.isConnected;
      
      console.log(`[OfflineSyncService] Connection state: ${this.isOnline ? 'ONLINE' : 'OFFLINE'}`);
      
      if (this.isOnline && wasOffline) {
        this.notifyListeners('connection', true);
        this.triggerSync();
      } else if (!this.isOnline) {
        this.notifyListeners('connection', false);
      }
    });
  }

  setApiClient(client) {
    this.apiClient = client;
  }

  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners(event, data) {
    this.listeners.forEach(cb => {
      try {
        cb(event, data);
      } catch (e) {
        console.error('Error notifying sync listener:', e);
      }
    });
  }

  /**
   * Cache responses for GET requests
   */
  async cacheData(key, data) {
    try {
      const cacheObj = {
        timestamp: Date.now(),
        data: data,
      };
      await AsyncStorage.setItem(`@cache_${key}`, JSON.stringify(cacheObj));
    } catch (e) {
      console.warn('[OfflineSyncService] Failed to cache data:', e);
    }
  }

  /**
   * Retrieve cached data for GET requests
   */
  async getCachedData(key) {
    try {
      const cached = await AsyncStorage.getItem(`@cache_${key}`);
      if (!cached) return null;
      
      const { timestamp, data } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_EXPIRY_MS;
      
      return {
        data,
        isExpired,
      };
    } catch (e) {
      console.warn('[OfflineSyncService] Failed to read cache:', e);
      return null;
    }
  }

  /**
   * Queue mutation actions (POST, PUT, DELETE) when offline
   */
  async queueMutation(url, method, data, headers = {}) {
    try {
      const queueJson = await AsyncStorage.getItem(MUTATION_QUEUE_KEY);
      const queue = queueJson ? JSON.parse(queueJson) : [];
      
      const newAction = {
        id: `mut_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        url,
        method,
        data,
        headers,
        timestamp: Date.now(),
      };
      
      queue.push(newAction);
      await AsyncStorage.setItem(MUTATION_QUEUE_KEY, JSON.stringify(queue));
      
      console.log(`[OfflineSyncService] Action queued: ${method} ${url}`);
      this.notifyListeners('queued', newAction);
      
      // Trigger a push notification reminder of pending sync
      await this.showLocalNotification(
        'Offline Mode Active',
        'Your changes have been saved locally. They will sync automatically when you are back online.'
      );
      
      return newAction;
    } catch (e) {
      console.error('[OfflineSyncService] Failed to queue mutation:', e);
      throw e;
    }
  }

  /**
   * Trigger the sync loop to upload pending queue
   */
  async triggerSync() {
    if (this.isSyncing || !this.isOnline || !this.apiClient) {
      return;
    }

    this.isSyncing = true;
    console.log('[OfflineSyncService] Starting sync cycle...');
    this.notifyListeners('sync_status', 'syncing');

    try {
      const queueJson = await AsyncStorage.getItem(MUTATION_QUEUE_KEY);
      if (!queueJson) {
        this.isSyncing = false;
        this.notifyListeners('sync_status', 'idle');
        return;
      }

      let queue = JSON.parse(queueJson);
      if (queue.length === 0) {
        this.isSyncing = false;
        this.notifyListeners('sync_status', 'idle');
        return;
      }

      console.log(`[OfflineSyncService] Syncing ${queue.length} pending actions...`);
      await this.showLocalNotification(
        'Syncing Data',
        `Uploading ${queue.length} pending changes to the server...`
      );

      const failedQueue = [];

      for (const action of queue) {
        try {
          console.log(`[OfflineSyncService] Replaying action: ${action.method} ${action.url}`);
          await this.apiClient({
            url: action.url,
            method: action.method,
            data: action.data,
            headers: {
              ...action.headers,
              'X-Offline-Synced': 'true',
            },
          });
          this.notifyListeners('synced_item', action.id);
        } catch (err) {
          console.error(`[OfflineSyncService] Replay failed for action: ${action.url}`, err);
          // If it's a 4xx business error (e.g. duplicate time, bad input), we remove it but log/warn.
          // If it's a network error (5xx or connection drop), we keep it to retry.
          if (!err.response || err.response.status >= 500) {
            failedQueue.push(action);
          } else {
            console.warn('[OfflineSyncService] Discarding operation due to client business error (4xx):', err.response?.data);
            this.notifyListeners('sync_conflict', { action, error: err.response?.data });
          }
        }
      }

      // Save remainder queue
      await AsyncStorage.setItem(MUTATION_QUEUE_KEY, JSON.stringify(failedQueue));

      const successCount = queue.length - failedQueue.length;
      if (successCount > 0) {
        await this.showLocalNotification(
          'Sync Completed Successfully',
          `Successfully updated ${successCount} items on the server.`
        );
      }
      
      this.notifyListeners('sync_completed', {
        success: successCount,
        failed: failedQueue.length,
      });

    } catch (e) {
      console.error('[OfflineSyncService] Sync error:', e);
    } finally {
      this.isSyncing = false;
      this.notifyListeners('sync_status', 'idle');
    }
  }

  async getPendingCount() {
    try {
      const queueJson = await AsyncStorage.getItem(MUTATION_QUEUE_KEY);
      if (!queueJson) return 0;
      const queue = JSON.parse(queueJson);
      return queue.length;
    } catch (e) {
      return 0;
    }
  }

  async showLocalNotification(title, body) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // immediate
      });
    } catch (e) {
      console.log('[OfflineSyncService] Notifications not ready/supported yet:', e.message);
    }
  }
}

export default new OfflineSyncService();
