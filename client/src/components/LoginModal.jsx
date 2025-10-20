import { X } from 'lucide-react';

function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-700 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">
            Create an account to continue
          </h2>
          
          <button className="w-full bg-stone-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-stone-800 transition-colors mb-4 cursor-pointer">
            Create account
          </button>
          
          <p className="text-sm text-stone-600">
            Already have an account?{' '}
            <button className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
