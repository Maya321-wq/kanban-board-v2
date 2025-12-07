import React from 'react';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-modal="true">
      <div className="bg-white p-4 rounded">
        <h3 className="font-bold">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-4 flex gap-2">
          <button onClick={onConfirm} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Yes</button>
          <button onClick={onCancel} className="px-3 py-1 bg-gray-300 rounded text-sm">Cancel</button>
        </div>
      </div>
    </div>
  );
}