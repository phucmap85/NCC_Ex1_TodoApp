'use client'

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Box from "./box/box.js";
import styles from "./page.module.css";
import { FaPlus } from "react-icons/fa6";
import { GrUpdate } from "react-icons/gr";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TinyFab = dynamic(() => import('react-tiny-fab').then(mod => mod.Fab), {
  ssr: false, // Disable server-side rendering for this component
});

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

const toastStyles = {
  position: "bottom-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

export default function UserRoute() {
  Modal.setAppElement('body');

  const [todoItem, setTodoItem] = useState([]);
  const [doingItem, setDoingItem] = useState([]);
  const [doneItem, setDoneItem] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [taskStatus, setTaskStatus] = useState("todo");
  const [assignee, setAssignee] = useState([]);
  const [users, setUsers] = useState([]);

  const statusOptions = [
    { value: "todo", label: "Todo", color: "#ebe700ff" },
    { value: "doing", label: "In Progress", color: "#ff2407ff" },
    { value: "done", label: "Done", color: "#28a745" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/users", { method: 'GET' });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [modalOpen]);

  const fetchItems = async (text) => {
    try {
      text = text.toLowerCase();

      const response = await fetch("http://localhost:3001/tasks/" + text, { method: 'GET' });
      const data = await response.json();

      if(text === "todo") setTodoItem(data);
      else if(text === "doing") setDoingItem(data);
      else if(text === "done") setDoneItem(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAssignee = (user) => {
    setAssignee(prev => {
      if (prev.map(tempPrev => tempPrev._id).includes(user._id)) {
        return prev.filter(u => u._id !== user._id);
      }
      else return [...prev, user];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:3001/tasks", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          status: taskStatus,
          assignee: assignee
        })
      });

      if (response.ok) {
        closeModal();
        fetchItems(taskStatus);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setName("");
    setTaskStatus("todo");
    setAssignee([]);
  };

  const updateItem = () => {
    try {
      fetchItems("todo");
      fetchItems("doing");
      fetchItems("done");
      toast.success('Tasks updated successfully!', toastStyles);
    } catch (error) {
      console.error("Error updating tasks:", error);
    }
  }

  useEffect(() => {
    fetchItems("todo");
    fetchItems("doing");
    fetchItems("done");
  }, []);

  return (
    <div className={styles.page}>
      <Box text={"Todo"} items={todoItem} onChange={fetchItems} />
      <Box text={"Doing"} items={doingItem} onChange={fetchItems} />
      <Box text={"Done"} items={doneItem} onChange={fetchItems} />

      {/* Create Task Fab */}
      <TinyFab
        style={{ position: 'fixed', bottom: '-10px', left: '45%', transform: 'translateX(-50%)', zIndex: 1000 }}
        icon={<FaPlus />}
        alwaysShowTitle={true}
        onClick={() => setModalOpen(!modalOpen)}
      />

      {/* Update Task Fab */}
      <TinyFab
        style={{ position: 'fixed', bottom: '-10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}
        icon={<GrUpdate />}
        alwaysShowTitle={true}
        onClick={() => updateItem()}
      />

      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Task Modal"
      >
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Create New Task</h2>
            <button 
              onClick={closeModal} 
              className={styles.modalCloseButton}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div className={styles.modalBody}>
            <form onSubmit={handleSubmit}>
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
                  required
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
                    <label key={user._id} className={styles.userCheckboxLabel}>
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
            </form>
          </div>

          <div className={styles.modalFooter}>
            <button 
              onClick={handleSubmit} 
              className={styles.modalSaveButton}
              disabled={name.trim() === ""}
            >
              Create Task  
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

      <ToastContainer />
    </div>
  );
}