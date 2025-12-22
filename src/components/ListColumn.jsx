import React, { useCallback, memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Card from './Card';
import { useBoardState } from '../hooks/useBoardState';

const ListColumn = memo(function ListColumn({ list }) {
  const { state, addCard, renameList, archiveList } = useBoardState();
  const cards = state.cards.filter(c => c.listId === list.id);

  // ✅ CRITICAL: Use consistent ID format with "-list-" delimiter
  const cardIds = cards.map(c => `card-${c.id}-list-${list.id}`);

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
        className={`flex-1 overflow-y-auto p-3 space-y-3 transition-all duration-200 
        ${isOver ? 'bg-blue-50/40' : 'bg-gradient-to-b from-gray-50/50 to-transparent'}`}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map(card => (
            // ✅ Pass the full draggable ID to Card
            <Card 
              key={card.id} 
              card={card} 
              listId={list.id} 
              draggableId={`card-${card.id}-list-${list.id}`} 
            />
          ))}
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

