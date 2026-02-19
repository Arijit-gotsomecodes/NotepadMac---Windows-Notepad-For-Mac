import React from 'react';
import './UnsavedChangesModal.css';

interface UnsavedChangesModalProps {
    isOpen: boolean;
    fileName: string;
    onSave: () => void;
    onDontSave: () => void;
    onCancel: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
    isOpen,
    fileName,
    onSave,
    onDontSave,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Unsaved Changes</h3>
                </div>
                <div className="modal-body">
                    <p>Do you want to save the changes to "{fileName}"?</p>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onDontSave}>Don't Save</button>
                    <button className="btn-secondary" onClick={onCancel}>Cancel</button>
                    <button className="btn-primary" onClick={onSave}>Save</button>
                </div>
            </div>
        </div>
    );
};
