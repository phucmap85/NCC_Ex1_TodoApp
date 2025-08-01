'use client'

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
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
    maxWidth: '500px',
    width: '90%',
    maxHeight: '85vh',
    overflow: 'auto'
  }
};

export default function UserRoute() {
  Modal.setAppElement('body');

  const currentYear = new Date().getFullYear();
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: '',
    username: '',
    email: '',
    gender: 'Male',
    yearOfBirth: new Date().getFullYear() - 25
  });
  const [editUser, setEditUser] = useState({
    _id: null,
    fullName: '',
    username: '',
    email: '',
    gender: 'Male',
    yearOfBirth: new Date().getFullYear() - 25,
    numberOfTasks: 0
  });

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/users", { 
        method: 'GET' 
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching Task items:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add User Modal Functions
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewUser({
      fullName: '',
      username: '',
      email: '',
      gender: 'Male',
      yearOfBirth: new Date().getFullYear() - 25
    });
  };

  // Edit User Modal Functions
  const handleOpenEditModal = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditUser({
      _id: null,
      fullName: '',
      username: '',
      email: '',
      gender: 'Male',
      yearOfBirth: new Date().getFullYear() - 25,
      numberOfTasks: 0
    });
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          numberOfTasks: 0
        })
      });
      const data = await response.json();
      console.log("Item added:", data);

      fetchUsers();
    } catch (error) {
      console.error("Error adding User:", error);
    }

    handleCloseAddModal();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/users/" + editUser._id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editUser)
      });
      const data = await response.json();
      console.log("Item edited:", data);

      fetchUsers();
    } catch (error) {
      console.error("Error editing User:", error);
    }

    handleCloseEditModal();
  };

  const handleDeleteUser = async (userId, userName, numberOfTasks) => {
    if(numberOfTasks > 0) {
      alert(`Cannot delete ${userName} because they have tasks assigned.`);
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete ${userName}?`);
    
    if (confirmDelete) {
      try {
        const response = await fetch("http://localhost:3001/users/" + userId, {
          method: 'DELETE'
        });
        const data = await response.json();
        console.log("Item deleted:", data);

        fetchUsers();
      } catch (error) {
        console.error("Error deleting User:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>User Management</h1>
        <button className={styles.addButton} onClick={handleOpenAddModal}>+ Add User</button>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={handleCloseAddModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className={styles.modalHeader}>
          <h2>Add User</h2>
          <button className={styles.closeButton} onClick={handleCloseAddModal}>×</button>
        </div>
        <form onSubmit={handleAddSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={newUser.fullName}
              onChange={handleAddInputChange}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={newUser.username}
              onChange={handleAddInputChange}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={newUser.email}
              onChange={handleAddInputChange}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={newUser.gender}
                onChange={handleAddInputChange}
                className={styles.formSelect}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="yearOfBirth">Year of Birth</label>
              <input
                type="number"
                id="yearOfBirth"
                name="yearOfBirth"
                value={newUser.yearOfBirth}
                onChange={handleAddInputChange}
                min="1950"
                max={currentYear}
                className={styles.formInput}
              />
            </div>
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={handleCloseAddModal} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Add User
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={handleCloseEditModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className={styles.modalHeader}>
          <h2>Edit User</h2>
          <button className={styles.closeButton} onClick={handleCloseEditModal}>×</button>
        </div>
        <form onSubmit={handleEditSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="editFullName">Full Name</label>
            <input
              type="text"
              id="editFullName"
              name="fullName"
              value={editUser.fullName}
              onChange={handleEditInputChange}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editUsername">Username</label>
            <input
              type="text"
              id="editUsername"
              name="username"
              value={editUser.username}
              onChange={handleEditInputChange}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editEmail">Email</label>
            <input
              type="email"
              id="editEmail"
              name="email"
              value={editUser.email}
              onChange={handleEditInputChange}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="editGender">Gender</label>
              <select
                id="editGender"
                name="gender"
                value={editUser.gender}
                onChange={handleEditInputChange}
                className={styles.formSelect}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="editYearOfBirth">Year of Birth</label>
              <input
                type="number"
                id="editYearOfBirth"
                name="yearOfBirth"
                value={editUser.yearOfBirth}
                onChange={handleEditInputChange}
                min="1950"
                max={currentYear}
                className={styles.formInput}
              />
            </div>
          </div>
          <div className={styles.modalActions}>
            <button type="button" onClick={handleCloseEditModal} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Update User
            </button>
          </div>
        </form>
      </Modal>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>ID</th>
              <th className={styles.th}>Full Name</th>
              <th className={styles.th}>Username</th>
              <th className={styles.th}>Email</th>
              <th className={styles.th}>Gender</th>
              <th className={styles.th}>Age</th>
              <th className={styles.th}>Tasks</th>
              <th className={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {users.map((item, index) => (
              <tr key={item._id} className={styles.tr}>
                <td className={styles.td}>{index + 1}</td>
                <td className={styles.td}>{item.fullName}</td>
                <td className={styles.td}>{item.username}</td>
                <td className={styles.td}>{item.email}</td>
                <td className={styles.td}>
                  <span className={`${styles.genderBadge} ${item.gender === 'Male' ? styles.male : styles.female}`}>
                    {item.gender}
                  </span>
                </td>
                <td className={styles.td}>{currentYear - item.yearOfBirth}</td>
                <td className={styles.td}>
                  <span className={`${styles.taskBadge} ${item.numberOfTasks === 0 ? styles.noTasks : styles.hasTasks}`}>
                    {item.numberOfTasks}
                  </span>
                </td>
                <td className={styles.td}>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleOpenEditModal(item)}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteUser(item._id, item.fullName, item.numberOfTasks)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}