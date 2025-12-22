import { useEffect, useRef } from 'react';
import { loadSyncQueue, saveSyncQueue } from '../services/storage';
import { apiClient } from '../services/api';

/**
 * Custom hook for handling offline synchronization with a mock server.
 * 
 * Features:
 * - Automatic sync on reconnection (window "online" event)
 * - Periodic sync every 30 seconds
 * - Queue management for offline actions
 * - Retry logic for failed syncs
 * 
 * Required by assignment §4 (Syncing + Conflict Resolution) and §5 (Custom Hooks).
 * 
 * @param {Object} state - Current board state
 */
export function useOfflineSync(state) {
  const syncInProgress = useRef(false);

  useEffect(() => {
    const sync = async () => {
      if (syncInProgress.current) return;
      syncInProgress.current = true;

      try {
        const queue = loadSyncQueue();
        if (queue.length === 0) {
          syncInProgress.current = false;
          return;
        }

        const unsynced = [];
        for (const action of queue) {
          try {
            await apiClient.syncAction(action);
            console.log('✅ Synced action:', action.type);
          } catch (err) {
            console.warn('⚠️ Sync failed, requeueing:', action.type, err);
            unsynced.push(action);
          }
        }
        saveSyncQueue(unsynced);
      } catch (err) {
        console.error('❌ Sync process error:', err);
      } finally {
        syncInProgress.current = false;
      }
    };

    // Sync on reconnect
    const handleOnline = () => {
      console.log('🌐 Network online — initiating sync');
      sync();
    };
    window.addEventListener('online', handleOnline);

    // Periodic sync every 30 seconds
    const interval = setInterval(() => {
      if (navigator.onLine) {
        sync();
      }
    }, 30_000);

    // Initial sync if online
    if (navigator.onLine) {
      sync();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      clearInterval(interval);
    };
  }, [state]);
}