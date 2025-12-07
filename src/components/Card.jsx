import React, { useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBoardState } from '../hooks/useBoardState';


const Card = React.memo(function Card({ card, listId }) {
  const { updateCard, deleteCard } = useBoardState();

  // Setup draggable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `card-${card.id}-${listId}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEdit = useCallback(() => {
    const title = prompt('Edit title:', card.title);
    if (title !== null && title.trim()) {
      updateCard(card.id, { title: title.trim() });
    }
  }, [updateCard, card.id, card.title]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    if (window.confirm(`Delete card "${card.title}"?`)) {
      deleteCard(card.id);
    }
  }, [deleteCard, card.id, card.title]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 cursor-grab active:cursor-grabbing border border-gray-100 hover:border-blue-200"
      role="button"
      tabIndex={0}
      aria-label={`Card: ${card.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleEdit();
        }
      }}
    >
      <div className="font-semibold text-sm mb-2 text-gray-800">{card.title}</div>
      
      {card.description && (
        <div className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {card.description}
        </div>
      )}
      
      {card.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {card.tags.map((tag, i) => (
            <span key={i} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={handleEdit}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
          aria-label={`Edit card "${card.title}"`}
        >
          ✏️ Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="text-xs text-red-600 hover:text-red-800 font-medium hover:underline transition-colors"
          aria-label={`Delete card "${card.title}"`}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
});

export default Card;

