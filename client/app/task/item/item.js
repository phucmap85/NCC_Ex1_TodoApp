'use client'

import React, { useEffect, useState } from "react";
import styles from "./item.module.css";
import { MdEdit, MdDelete } from "react-icons/md";
import Modal from 'react-modal';
import Select from 'react-select';

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
    overflow: 'visible'
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
        
        if(!response.ok) {
          const errorText = await response.json();
          throw new Error(errorText.message);
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [modalIsOpen]);

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

  const handleAssignee = (selectedOptions) => {
    const selectedUsers = selectedOptions ? selectedOptions.map(option => option.userData) : [];
    setAssignee(selectedUsers);
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
                placeholder="Enter task name..."
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

              <Select
                isMulti
                name="assignee"
                options={users.map(user => ({
                  value: user._id,
                  label: `${user.fullName} (@${user.username})`,
                  userData: user
                }))}
                value={assignee.map(user => ({
                  value: user._id,
                  label: `${user.fullName} (@${user.username})`,
                  userData: user
                }))}
                onChange={handleAssignee}
                isSearchable={true}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select users to assign..."
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    minHeight: '40px',
                    border: '2px solid #e9ecef',
                    borderRadius: '6px',
                    boxShadow: state.isFocused ? '0 0 0 3px rgba(52, 152, 219, 0.1)' : 'none',
                    borderColor: state.isFocused ? '#3498db' : '#e9ecef',
                    '&:hover': {
                      borderColor: '#3498db'
                    },
                    cursor: 'text'
                  }),
                  multiValue: (provided) => ({
                    ...provided,
                    backgroundColor: '#3498db',
                    borderRadius: '4px',
                    margin: '2px'
                  }),
                  multiValueLabel: (provided) => ({
                    ...provided,
                    color: 'white',
                    fontWeight: '500',
                    fontSize: '0.85rem',
                    padding: '4px 8px'
                  }),
                  multiValueRemove: (provided) => ({
                    ...provided,
                    color: 'white',
                    borderRadius: '0 4px 4px 0',
                    '&:hover': {
                      backgroundColor: '#2980b9',
                      color: 'white'
                    }
                  }),
                  menu: (provided) => ({
                    ...provided,
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    border: '1px solid #e9ecef',
                    marginTop: '4px',
                    zIndex: 9999
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? '#3498db' : state.isFocused ? '#f8f9fa' : 'white',
                    color: state.isSelected ? 'white' : '#2c3e50',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    '&:active': {
                      backgroundColor: '#3498db',
                      color: 'white'
                    }
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: '#6c757d',
                    fontSize: '0.9rem'
                  }),
                  input: (provided) => ({
                    ...provided,
                    color: '#2c3e50',
                    fontSize: '0.9rem'
                  }),
                  indicatorsContainer: (provided) => ({
                    ...provided,
                    padding: '0 8px'
                  }),
                  clearIndicator: (provided) => ({
                    ...provided,
                    color: '#6c757d',
                    '&:hover': {
                      color: '#495057'
                    }
                  }),
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    color: '#6c757d',
                    '&:hover': {
                      color: '#495057'
                    }
                  })
                }}
              />
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
                  <span key={user._id} className={styles.userTag}>{user.fullName} (@{user.username})</span>
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