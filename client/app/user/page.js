'use client'

import React, { useState } from "react";
import styles from "./page.module.css";
import Modal from 'react-modal';

let data = [
  {
    id: 1,
    username: "alex_smith",
    fullName: "Alex Smith",
    email: "alex.smith@email.com",
    gender: "Male",
    yearOfBirth: 1992,
    numberOfTasks: 10
  },
  {
    id: 2,
    username: "sarah_jones",
    fullName: "Sarah Jones",
    email: "sarah.jones@email.com",
    gender: "Female",
    yearOfBirth: 1988,
    numberOfTasks: 0
  },
  {
    id: 3,
    username: "mike_chen",
    fullName: "Michael Chen",
    email: "mike.chen@email.com",
    gender: "Male",
    yearOfBirth: 1995,
    numberOfTasks: 0
  },
  {
    id: 4,
    username: "emma_davis",
    fullName: "Emma Davis",
    email: "emma.davis@email.com",
    gender: "Female",
    yearOfBirth: 1990,
    numberOfTasks: 0
  },
  {
    id: 5,
    username: "david_wilson",
    fullName: "David Wilson",
    email: "david.wilson@email.com",
    gender: "Male",
    yearOfBirth: 1987,
    numberOfTasks: 0
  },
  {
    id: 6,
    username: "lisa_brown",
    fullName: "Lisa Brown",
    email: "lisa.brown@email.com",
    gender: "Female",
    yearOfBirth: 1993,
    numberOfTasks: 0
  },
  {
    id: 7,
    username: "james_taylor",
    fullName: "James Taylor",
    email: "james.taylor@email.com",
    gender: "Male",
    yearOfBirth: 1985,
    numberOfTasks: 0
  },
  {
    id: 8,
    username: "anna_garcia",
    fullName: "Anna Garcia",
    email: "anna.garcia@email.com",
    gender: "Female",
    yearOfBirth: 1996,
    numberOfTasks: 0
  },
  {
    id: 9,
    username: "chris_martin",
    fullName: "Christopher Martin",
    email: "chris.martin@email.com",
    gender: "Male",
    yearOfBirth: 1991,
    numberOfTasks: 0
  },
  {
    id: 10,
    username: "sophia_lee",
    fullName: "Sophia Lee",
    email: "sophia.lee@email.com",
    gender: "Female",
    yearOfBirth: 1994,
    numberOfTasks: 0
  },
  {
    id: 11,
    username: "ryan_white",
    fullName: "Ryan White",
    email: "ryan.white@email.com",
    gender: "Male",
    yearOfBirth: 1989,
    numberOfTasks: 0
  },
  {
    id: 12,
    username: "maya_patel",
    fullName: "Maya Patel",
    email: "maya.patel@email.com",
    gender: "Female",
    yearOfBirth: 1997,
    numberOfTasks: 0
  }
];

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

  const [users, setUsers] = useState(data);
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
    id: null,
    fullName: '',
    username: '',
    email: '',
    gender: 'Male',
    yearOfBirth: new Date().getFullYear() - 25,
    numberOfTasks: 0
  });

  const currentYear = new Date().getFullYear();

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
      id: null,
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

  const handleAddSubmit = (e) => {
    e.preventDefault();

    const newUserData = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...newUser,
      numberOfTasks: 0
    };

    setUsers([...users, newUserData]);
    handleCloseAddModal();
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    setUsers(users.map(user => 
      user.id === editUser.id ? editUser : user
    ));
    handleCloseEditModal();
  };

  const handleDeleteUser = (userId, userName, numberOfTasks) => {
    if(numberOfTasks > 0) {
      alert(`Cannot delete ${userName} because they have tasks assigned.`);
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete ${userName}?`);
    
    if (confirmDelete) {
      setUsers(users.filter(user => user.id !== userId));
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
              <tr key={item.id} className={styles.tr}>
                <td className={styles.td}>{item.id}</td>
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
                      onClick={() => handleDeleteUser(item.id, item.fullName, item.numberOfTasks)}
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