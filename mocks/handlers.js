// mocks/handlers.js
import { http, HttpResponse } from 'msw';

// Simple in-memory "server" state
let serverState = {
  lists: [],
  cards: [],
  lastModifiedAt: Date.now(),
};

export const handlers = [
  http.post('/api/sync', async ({ request }) => {
    const action = await request.json();

    // "Last modified wins" conflict resolution
    const now = Date.now();

    switch (action.type) {
      case 'ADD_LIST':
        serverState.lists.push({ ...action.payload, lastModifiedAt: now });
        break;
      case 'ADD_CARD':
        serverState.cards.push({ ...action.payload, lastModifiedAt: now });
        break;
      case 'UPDATE_CARD':
        const cardIndex = serverState.cards.findIndex(c => c.id === action.payload.id);
        if (cardIndex >= 0) {
          serverState.cards[cardIndex] = { ...serverState.cards[cardIndex], ...action.payload.updates, lastModifiedAt: now };
        }
        break;
      case 'DELETE_CARD':
        serverState.cards = serverState.cards.filter(c => c.id !== action.payload.id);
        break;
      // Add other actions as needed
    }

    serverState.lastModifiedAt = now;
    return HttpResponse.json({ success: true, serverTime: now });
  }),

  http.get('/api/board', () => {
    return HttpResponse.json(serverState);
  }),
];