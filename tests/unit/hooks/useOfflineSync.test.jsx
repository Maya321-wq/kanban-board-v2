import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

// Mock storage and api modules
vi.mock('../../../src/services/storage', () => ({
  loadSyncQueue: vi.fn(),
  saveSyncQueue: vi.fn(),
}));
vi.mock('../../../src/services/api', () => ({
  apiClient: { syncAction: vi.fn() },
}));

import { loadSyncQueue, saveSyncQueue } from '../../../src/services/storage';
import { apiClient } from '../../../src/services/api';
import { useOfflineSync } from '../../../src/hooks/useOfflineSync';

function TestHost({ state }) {
  useOfflineSync(state);
  return null;
}

describe('useOfflineSync', () => {
  beforeEach(() => {
    loadSyncQueue.mockReset();
    saveSyncQueue.mockReset();
    apiClient.syncAction.mockReset();
  });

  it('processes queued actions and clears queue on success', async () => {
    loadSyncQueue.mockReturnValue([{ type: 'ADD_CARD', payload: { title: 'x' } }]);
    apiClient.syncAction.mockResolvedValue({ ok: true });

    render(<TestHost state={{}} />);

    await waitFor(() => {
      expect(apiClient.syncAction).toHaveBeenCalled();
      expect(saveSyncQueue).toHaveBeenCalledWith([]);
    });
  });

  it('re-queues failed syncs', async () => {
    loadSyncQueue.mockReturnValue([{ type: 'ADD_CARD', payload: { title: 'y' } }]);
    apiClient.syncAction.mockRejectedValue(new Error('fail'));

    render(<TestHost state={{}} />);

    await waitFor(() => {
      expect(apiClient.syncAction).toHaveBeenCalled();
      expect(saveSyncQueue).toHaveBeenCalledWith([{ type: 'ADD_CARD', payload: { title: 'y' } }]);
    });
  });
});
