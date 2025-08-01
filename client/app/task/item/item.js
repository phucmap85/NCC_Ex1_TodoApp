'use client'

import React, { useEffect, useState } from "react";
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
  const [taskStatus, setTaskStatus] = useState(item.status || "todo");
  const [assignee, setAssignee] = useState(item.assignee || []);

  const [modalIsOpen, setIsOpen] = useState(false);

  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/users", { method: 'GET' });
        const data = await response.json();
        setUsers(data);

        console.log("Fetched Users:", data);
      } catch (error) {
        console.error("Error fetching Users:", error);
      }
    };

    fetchUsers();
  }, []);

  const statusOptions = [
    { value: "todo", label: "Todo", color: "#ebe700ff" },
    { value: "doing", label: "In Progress", color: "#ff2407ff" },
    { value: "done", label: "Done", color: "#28a745" },
  ];

  const handleEdit = () => {
    setName(item.name || "");
    setAssignee(item.assignee || []);
    setTaskStatus(item.status || "todo");
    setIsOpen(true);
  };

  const handleDelete = () => {
    if(confirm("Do you want to delete this item?")) onDelete(item._id);
  }

  const handleAssignee = (user) => {
    setAssignee(prev => {
      if (prev.map(tempPrev => tempPrev._id).includes(user._id)) {
        return prev.filter(u => u._id !== user._id);
      }
      else return [...prev, user];
    });
  };

  const handleSave = () => {
    onEdit(item._id, name, assignee, taskStatus);
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
              <label htmlFor="assignee" className={styles.label}>
                Assign To ({assignee.length} selected)
              </label>
              <div className={styles.userSelectionGrid}>
                {users.map(user => (
                  <label key={user.fullName} className={styles.userCheckboxLabel}>
                    <input
                      type="checkbox"
                      checked={assignee.map(tempAssignee => tempAssignee._id).includes(user._id)}
                      onChange={() => handleAssignee(user)}
                      className={styles.userCheckbox}
                    />
                    <span className={styles.userCheckboxText}>{user.fullName}</span>
                  </label>
                ))}
              </div>
              {assignee.length > 0 && (
                <div className={styles.selectedUsers}>
                  <strong>Selected: </strong> 
                  {assignee.map((user, index) => (
                    <span key={user._id} className={styles.selectedUser}>
                      {index > 0 && ", "}
                      {user.fullName}
                    </span>
                  ))}
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
          <strong>{item.name}</strong>

          {item.assignee && item.assignee.length > 0 && (
            <div className={styles.assignee}>
              <span className={styles.assignee}>Assigned to:</span>
              <div className={styles.userTags}>
                {item.assignee.map((user) => (
                  <span key={user._id} className={styles.userTag}>{user.fullName}</span>
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