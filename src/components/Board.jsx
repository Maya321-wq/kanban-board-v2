import React, { useCallback } from 'react';
import { 
  DndContext, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  closestCorners,
} from '@dnd-kit/core';
import ListColumn from './ListColumn';
import { useBoardState } from '../hooks/useBoardState';

import { parseDraggableId } from '../utils/dnd';


export default function Board() {
  const { state, moveCard, addList } = useBoardState();
  const activeLists = state.lists.filter(list => !list.archived);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    if (!over) {
      console.log('❌ No drop target');
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    console.log('🎯 Drag ended:', { activeId, overId });

    const parsedActive = parseDraggableId(activeId);
    if (!parsedActive) {
      console.warn('❌ Invalid source card ID format:', activeId);
      return;
    }

    const { cardId, listId: sourceListId } = parsedActive;
    console.log('🔍 Extracted:', { cardId, sourceListId });

    let targetListId;
    if (overId.startsWith('card-')) {
      const parsedOver = parseDraggableId(overId);
      if (!parsedOver) {
        console.warn('❌ Invalid target card ID:', overId);
        return;
      }
      targetListId = parsedOver.listId;
    } else {
      // Dropped directly on a list (overId is list.id)
      targetListId = overId;
    }

    console.log('📦 Moving:', { cardId, sourceListId, targetListId });

    if (sourceListId !== targetListId) {
      console.log('🚀 Calling moveCard...');
      moveCard({ cardId, sourceListId, targetListId });
      console.log('✅ Move dispatched!');
    } else {
      console.log('ℹ️ Same list, no move');
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