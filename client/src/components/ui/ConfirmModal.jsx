import React from 'react';
import { X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 cursor-pointer"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-end p-6">
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 -mt-10">
          <h3 className="text-2xl font-semibold text-center text-stone-900">{title}</h3>
        </div>
        
        {/* Body */}
        <div className="p-6 -mt-6 -mb-5">
          <p className="text-stone-600 text-base text-center">{message}</p>
        </div>
        
        {/* Footer */}
        <div className="flex gap-3 p-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-full hover:bg-stone-50 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors cursor-pointer"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
