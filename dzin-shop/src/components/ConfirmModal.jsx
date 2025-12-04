import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const ConfirmModal = ({ show, message, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 w-full max-w-md p-6 relative shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Confirm Action</h2>
                    <button
                        onClick={onCancel}
                        className="text-neutral-500 hover:text-red-500 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    {message}
                </p>

                <div className="flex gap-4">
                    <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={onCancel}
                    >
                        CANCEL
                    </Button>
                    <Button
                        className="flex-1 bg-red-500 hover:bg-red-600 border-red-500"
                        onClick={onConfirm}
                    >
                        DELETE
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
