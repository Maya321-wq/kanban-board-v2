// src/components/Card.jsx
import React, { useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBoardState } from '../hooks/useBoardState';

const Card = React.memo(function Card({ card, listId }) {
  const { updateCard, deleteCard } = useBoardState();

  // ✅ CRITICAL FIX: Include "-list-" in the ID so Board.jsx can parse it
  const draggableId = `card-${card.id}-list-${listId}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: draggableId,
    data: {
      type: 'card',
      card: card,
      listId: listId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const handleEdit = useCallback(() => {
    const title = prompt('Edit title:', card.title);
    if (title !== null && title.trim()) {
      updateCard(card.id, { title: title.trim() });
    }
  }, [updateCard, card.id, card.title]);

  const handleDelete = useCallback(() => {
    if (window.confirm(`Delete card "${card.title}"?`)) {
      deleteCard(card.id);
    }
  }, [deleteCard, card.id, card.title]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-testid="card-item"
      className={`card-item bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100 hover:border-blue-200 ${
        isDragging ? 'cursor-grabbing shadow-2xl scale-105' : 'cursor-grab'
      }`}
    >
      {/* Drag handle area - use listeners here */}
      <div {...attributes} {...listeners} className="mb-2">
        <div className="font-semibold text-sm text-gray-800">{card.title}</div>
        
        {card.description && (
          <div className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
            {card.description}
          </div>
        )}
        
        {card.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {card.tags.map((tag, i) => (
              <span key={i} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Buttons - NO drag listeners here */}
      <div className="flex gap-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={handleEdit}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors cursor-pointer"
          aria-label={`Edit card "${card.title}"`}
        >
          ✏️ Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="text-xs text-red-600 hover:text-red-800 font-medium hover:underline transition-colors cursor-pointer"
          aria-label={`Delete card "${card.title}"`}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
});

export default Card;