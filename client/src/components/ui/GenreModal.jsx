import React from 'react';
import { X } from 'lucide-react';

const GenreModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  formData, 
  onInputChange, 
  onColorSelect, 
  colorKeyToClasses,
  submitText = "Create Genre",
  cancelText = "Cancel"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 cursor-pointer" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-end p-6">
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 -mt-10">
          <h2 className="text-2xl font-semibold text-center text-stone-900">{title}</h2>
        </div>

        <div className="p-6 -mt-6 -mb-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Genre name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter genre name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Enter genre description"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Color</label>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(colorKeyToClasses).map(key => (
                <button
                  key={key}
                  onClick={() => onColorSelect(key)}
                  className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                    formData.color === key 
                      ? 'border-stone-600 ring-2 ring-stone-300' 
                      : 'border-transparent hover:border-stone-400'
                  } ${colorKeyToClasses[key].bg}`}
                  aria-label={`Select ${key} color`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6">
          <button 
            onClick={onClose} 
            className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-full hover:bg-stone-50 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button 
            onClick={onSubmit}
            className="flex-1 px-4 py-2 bg-stone-800 text-white rounded-full hover:bg-stone-900 transition-colors cursor-pointer"
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
};

GenreModal.displayName = "GenreModal";

export default GenreModal;
