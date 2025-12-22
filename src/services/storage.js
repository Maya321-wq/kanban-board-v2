// // src/services/storage.js

// const STORAGE_KEY = 'kanban-board-state';
// const QUEUE_KEY = 'kanban-sync-queue';

// // Load persisted board state
// export function loadBoardFromStorage() {
//   try {
//     const raw = localStorage.getItem(STORAGE_KEY);
//     console.log('Raw data from localStorage:', raw);
    
//     if (!raw) {
//       console.log('No data found in localStorage');
//       return null;
//     }
    
//     const parsed = JSON.parse(raw);
//     console.log('Parsed board state:', parsed);
//     return parsed;
//   } catch (e) {
//     console.error('Failed to load board from localStorage', e);
//     return null;
//   }
// }

// // Save board state
// export function saveBoardToStorage(state) {
//   try {
//     const serialized = JSON.stringify(state);
//     localStorage.setItem(STORAGE_KEY, serialized);
//     console.log('✅ Saved to localStorage:', {
//       lists: state.lists.length,
//       cards: state.cards.length
//     });
//   } catch (e) {
//     console.error('❌ Failed to save board to localStorage', e);
//   }
// }

// // Save sync queue (array of actions)
// export function saveSyncQueue(queue) {
//   try {
//     localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
//     console.log('✅ Saved sync queue:', queue.length, 'items');
//   } catch (e) {
//     console.error('❌ Failed to save sync queue', e);
//   }
// }

// // Load sync queue
// export function loadSyncQueue() {
//   try {
//     const raw = localStorage.getItem(QUEUE_KEY);
//     if (!raw) return [];
    
//     const queue = JSON.parse(raw);
//     console.log('📥 Loaded sync queue:', queue.length, 'items');
//     return queue;
//   } catch (e) {
//     console.error('❌ Failed to load sync queue', e);
//     return [];
//   }
// }


// src/services/storage.js

const STORAGE_KEY = 'kanban-board-state';
const QUEUE_KEY = 'kanban-sync-queue';

// Load persisted board state
export function loadBoardFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    
    if (!raw) {
      console.log('📭 No saved state found');
      return null;
    }
    
    const parsed = JSON.parse(raw);
    
    // Validate structure
    if (!parsed.lists || !Array.isArray(parsed.lists)) {
      console.warn('⚠️ Invalid state structure');
      return null;
    }
    
    console.log('✅ Loaded state:', { lists: parsed.lists.length, cards: parsed.cards?.length || 0 });
    return parsed;
  } catch (e) {
    console.error('❌ Failed to load state:', e);
    return null;
  }
}

// Save board state
export function saveBoardToStorage(state) {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    console.log('💾 Saved:', { lists: state.lists.length, cards: state.cards.length });
  } catch (e) {
    console.error('❌ Failed to save state:', e);
  }
}

// Save sync queue (array of actions)
export function saveSyncQueue(queue) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('❌ Failed to save sync queue:', e);
  }
}

// Load sync queue
export function loadSyncQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('❌ Failed to load sync queue:', e);
    return [];
  }
}