import React, { useCallback, memo, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Card from './Card';
import { useBoardState } from '../hooks/useBoardState';
// react-window exports the fixed-size list as `List`
import { List } from 'react-window';

const ListColumn = memo(function ListColumn({ list }) {
  const { state, addCard, renameList, archiveList } = useBoardState();

  // Memoize cards for this list to avoid re-filtering on unrelated updates
  const cards = useMemo(() => state.cards.filter(c => c.listId === list.id), [state.cards, list.id]);

  // ✅ CRITICAL: Use consistent ID format with "-list-" delimiter
  const cardIds = useMemo(() => cards.map(c => `card-${c.id}-list-${list.id}`), [cards, list.id]);

  const { setNodeRef, isOver } = useDroppable({ id: list.id });

  const handleAddCard = useCallback(() => {
    const title = prompt('Enter card title:');
    if (title && title.trim()) addCard({ listId: list.id, title: title.trim() });
  }, [addCard, list.id]);

  const handleRename = useCallback(() => {
    const title = prompt('New list name:', list.title);
    if (title && title.trim()) renameList(list.id, title.trim());
  }, [renameList, list.id, list.title]);

  const handleArchive = useCallback(() => {
    if (window.confirm(`Archive list "${list.title}"?`)) archiveList(list.id);
  }, [archiveList, list.id]);

  // Virtualization: use react-window when list is large
  const shouldVirtualize = cards.length > 30;
  const itemSize = 104; // px per card (approx)
  const listHeight = Math.min(cards.length * itemSize, 640);

  const Row = ({ index, style }) => {
    const card = cards[index];
    return (
      <div style={style}>
        <Card 
          key={card.id}
          card={card}
          listId={list.id}
          draggableId={`card-${card.id}-list-${list.id}`}
        />
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      className={`w-72 flex-shrink-0 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl flex flex-col max-h-[calc(100vh-12rem)] border 
      transition-all duration-200 ${isOver ? 'border-blue-400 shadow-blue-200 shadow-md' : 'border-gray-200'}`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
        <h3 className="font-bold text-base text-gray-800">
          {list.title} <span className="text-sm font-normal text-gray-500">({cards.length})</span>
        </h3>
        <div className="flex gap-2">
          <button onClick={handleRename} className="text-gray-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50">
            ✏️
          </button>
          <button onClick={handleArchive} className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50">
            🗑️
          </button>
        </div>
      </div>

      <div
        className={`flex-1 transition-all duration-200 
        ${isOver ? 'bg-blue-50/40' : 'bg-gradient-to-b from-gray-50/50 to-transparent'}`}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {shouldVirtualize ? (
            <List
              height={listHeight}
              itemCount={cards.length}
              itemSize={itemSize}
              // Use a numeric width so react-window works in JSDOM tests; this matches the
              // visual column width (~w-72) used in the layout.
              width={272}
              itemKey={index => cards[index].id}
            >
              {Row}
            </List>
          ) : (
            <div className="overflow-y-auto p-3 space-y-3">
              {cards.map(card => (
                // ✅ Pass the full draggable ID to Card
                <Card 
                  key={card.id} 
                  card={card} 
                  listId={list.id} 
                  draggableId={`card-${card.id}-list-${list.id}`} 
                />
              ))}
            </div>
          )}
        </SortableContext>

        {cards.length === 0 && !isOver && <div className="text-center py-8 text-gray-400 text-sm">No cards yet</div>}
        {isOver && <div className="text-center py-6 text-blue-500 text-sm font-medium">Drop here</div>}
      </div>

      <button
        onClick={handleAddCard}
        className="m-3 p-3 text-left text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border-2 border-dashed border-gray-200 hover:border-blue-300"
      >
        <span className="text-lg mr-1">+</span> Add card
      </button>
    </div>
  );
});

export default ListColumn;

