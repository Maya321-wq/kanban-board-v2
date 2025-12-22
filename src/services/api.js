// src/services/api.js

// Simulate API call to MSW mock server
export const apiClient = {
  async syncAction(action) {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action),
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`);
    }

    return response.json();
  },
};