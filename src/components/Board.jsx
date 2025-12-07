import React, { useCallback } from 'react';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import ListColumn from './ListColumn';
import { useBoardState } from '../hooks/useBoardState';


export default function Board() {
  const { state, moveCard, addList } = useBoardState();
  const activeLists = state.lists.filter(list => !list.archived);

  // Configure sensors for accessibility (keyboard + pointer)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevents accidental drags
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (!over) return;

    // Parse IDs: active.id format is "card-{cardId}-{listId}"
    const activeId = String(active.id);
    const overId = String(over.id);

    // Extract card and list IDs
    const cardIdMatch = activeId.match(/^card-(.+)-(.+)$/);
    if (!cardIdMatch) return;

    const [, cardId, sourceListId] = cardIdMatch;
    const targetListId = overId.startsWith('list-') ? overId : sourceListId;

    // Only move if actually changing lists
    if (sourceListId !== targetListId) {
      moveCard({ cardId, sourceListId, targetListId });
    }
  }, [moveCard]);

  const handleAddList = useCallback(() => {
    const title = prompt('Enter new list name:');
    if (title && title.trim()) {
      addList(title.trim());
    }
  }, [addList]);

  return (
    <div className="p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto min-h-[calc(100vh-10rem)] pb-4">
          {activeLists.map(list => (
            <ListColumn key={list.id} list={list} />
          ))}
          
          <button
            type="button"
            onClick={handleAddList}
            className="w-72 flex-shrink-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-dashed border-white/30 hover:border-white/50 rounded-xl p-6 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            aria-label="Add new list"
          >
            <span className="text-2xl mr-2">+</span> Add List
          </button>
        </div>
      </DndContext>
    </div>
  );
}