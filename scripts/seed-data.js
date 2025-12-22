// scripts/seed-data.js
/**
 * Seed script to generate 500+ cards for performance testing.
 * 
 * Usage:
 *   node scripts/seed-data.js
 * 
 * This populates localStorage with a realistic board state
 * containing 3 lists and 500 cards, matching the structure
 * expected by boardReducer.js and storage.js.
 */

(() => {
  // Simple UUID-like ID generator (for seed only — not cryptographically secure)
  const generateId = () => Math.random().toString(36).substring(2, 15);

  const now = Date.now();

  // Create 3 lists (matches initialState in boardReducer.js)
  const lists = [
    { id: 'list-todo', title: 'To Do', order: 0, archived: false, version: 1, lastModifiedAt: now },
    { id: 'list-progress', title: 'In Progress', order: 1, archived: false, version: 1, lastModifiedAt: now },
    { id: 'list-done', title: 'Done', order: 2, archived: false, version: 1, lastModifiedAt: now },
  ];

  // Generate 500 cards distributed across lists
  const cards = [];
  const listIds = lists.map(l => l.id);
  for (let i = 1; i <= 500; i++) {
    const listId = listIds[Math.floor(Math.random() * listIds.length)];
    cards.push({
      id: `card-${generateId()}`,
      listId: listId,
      title: `Task ${i}`,
      description: `This is the description for task ${i}. It includes some sample text to simulate real-world content length.`,
      tags: i % 7 === 0 ? ['bug'] : i % 5 === 0 ? ['feature'] : i % 3 === 0 ? ['ui'] : [],
      version: 1,
      lastModifiedAt: now - Math.floor(Math.random() * 86400000), // Random time in last 24h
    });
  }

  // Construct full board state
  const state = { lists, cards };

  // Save to localStorage (matches your Phase 5 implementation)
  localStorage.setItem('kanban-board-state', JSON.stringify(state));

  console.log('✅ Successfully seeded 500 cards into localStorage');
  console.log(`   - Lists: ${lists.length}`);
  console.log(`   - Cards: ${cards.length}`);
})();