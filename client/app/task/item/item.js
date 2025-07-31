'use client'

import React, { useState } from "react";
import styles from "./item.module.css";
import { MdEdit, MdDelete } from "react-icons/md";
import Modal from 'react-modal';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0',
    border: 'none',
    borderRadius: '12px',
    maxWidth: '450px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto'
  }
};

export default function Item({ item, onDelete, onEdit }) {
  Modal.setAppElement('body');

  const [name, setName] = useState(item.name || "");
  const [assignees, setAssignees] = useState(item.assignees || []);
  const [taskStatus, setTaskStatus] = useState(item.status || "todo");

  const [modalIsOpen, setIsOpen] = useState(false);

  const users = [
    "John Doe", 
    "Jane Smith", 
    "Mike Johnson", 
    "Sarah Wilson", 
    "David Brown",
    "Alex Chen",
    "Emma Davis"
  ];

  const statusOptions = [
    { value: "todo", label: "Todo", color: "#ebe700ff" },
    { value: "doing", label: "In Progress", color: "#ff2407ff" },
    { value: "done", label: "Done", color: "#28a745" },
  ];

  const handleEdit = () => {
    setName(item.name || "");
    setAssignees(item.assignees || []);
    setTaskStatus(item.status || "todo");
    setIsOpen(true);
  };

  const handleDelete = () => {
    if(confirm("Do you want to delete this item?")) onDelete(item.id);
  }

  const handleUserToggle = (user) => {
    setAssignees(prev => {
      if (prev.includes(user)) return prev.filter(u => u !== user);
      else return [...prev, user];
    });
  };

  const handleSave = () => {
    onEdit(item.id, name, assignees, taskStatus);
    setIsOpen(false);
  };

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div className={styles.item}>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Edit Task</h2>
            <button 
              onClick={closeModal} 
              className={styles.modalCloseButton}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="taskName" className={styles.label}>
                Task Name
              </label>
              <textarea
                id="taskName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.modalTextarea}
                placeholder="Enter task description..."
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="taskStatus" className={styles.label}>
                Task Status
              </label>
              <div className={styles.statusGrid}>
                {statusOptions.map(status => (
                  <label key={status.value} className={styles.statusOption}>
                    <input
                      type="radio"
                      name="taskStatus"
                      value={status.value}
                      checked={taskStatus === status.value}
                      onChange={(e) => setTaskStatus(e.target.value)}
                      className={styles.statusRadio}
                    />
                    <span 
                      className={styles.statusLabel}
                      style={{ borderColor: status.color }}
                    >
                      <span 
                        className={styles.statusIndicator}
                        style={{ backgroundColor: status.color }}
                      ></span>
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="assignees" className={styles.label}>
                Assign To ({assignees.length} selected)
              </label>
              <div className={styles.userSelectionGrid}>
                {users.map(user => (
                  <label key={user} className={styles.userCheckboxLabel}>
                    <input
                      type="checkbox"
                      checked={assignees.includes(user)}
                      onChange={() => handleUserToggle(user)}
                      className={styles.userCheckbox}
                    />
                    <span className={styles.userCheckboxText}>{user}</span>
                  </label>
                ))}
              </div>
              {assignees.length > 0 && (
                <div className={styles.selectedUsers}>
                  <strong>Selected:</strong> {assignees.join(", ")}
                </div>
              )}
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button 
              onClick={handleSave} 
              className={styles.modalSaveButton}
              disabled={name.trim() === ""}
            >
              Save Changes  
            </button>
            <button 
              onClick={closeModal} 
              className={styles.modalCancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <div className={styles.textContainer}>
        <span className={styles.incomplete}>
          {item.name}

          {item.assignees && item.assignees.length > 0 && (
            <div className={styles.assignees}>
              <span className={styles.assignees}>Assigned to:</span>
              <div className={styles.userTags}>
                {item.assignees.map(user => (
                  <span key={user} className={styles.userTag}>
                    {user}
                  </span>
                ))}
              </div>
            </div>
          )}
        </span>
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={() => handleEdit()}><MdEdit /></button>
        <button onClick={() => handleDelete()}><MdDelete /></button>
      </div>
    </div>
  );
}