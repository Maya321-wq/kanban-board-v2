import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function CardDetailModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [card, setCard] = useState(null);

 
  useEffect(() => {
    const handleOpen = () => {
      // Simulate opening
      if (window.location.hash === '#modal') {
        setCard({ id: 'demo', title: 'Demo', description: 'Description' });
        setIsOpen(true);
      }
    };
    window.addEventListener('hashchange', handleOpen);
    return () => window.removeEventListener('hashchange', handleOpen);
  }, []);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white p-4 rounded w-96 max-h-[80vh] overflow-auto">
        <div className="flex justify-between">
          <h2 className="font-bold">{card?.title}</h2>
          <button onClick={() => setIsOpen(false)} aria-label="Close modal">✕</button>
        </div>
        <p className="mt-2 text-sm">{card?.description}</p>
        <button
          onClick={() => setIsOpen(false)}
          className="mt-4 px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}