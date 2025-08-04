'use client'

import React from "react";
import styles from "./box.module.css";
import Item from "../item/item.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

export default function Box({ text, items, onChange }) {
  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch("http://localhost:3001/tasks/" + id, {
        method: 'DELETE'
      });

      if(!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.message);
      }

      const data = await response.json();
      console.log("Item deleted:", data);

      onChange(text);
    } catch (error) {
      toast.error(error.message, toastStyles);
    }
  };

  const handleEditItem = async (id, name, assignees, status) => {
    if (name.trim() === "") return;

    const editItem = {
      name: name.trim(), 
      assignee: assignees, 
      status: status.toLowerCase()
    }

    console.log("Editing item:", JSON.stringify(editItem));

    try {
      const response = await fetch("http://localhost:3001/tasks/" + id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editItem)
      });

      if(!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.message);
      }

      const data = await response.json();
      console.log("Item updated:", data);
      
      onChange(text);
      onChange(status);
    } catch (error) {
      toast.error(error.message, toastStyles);
    }
  };

  return (
    <div className={styles.board}>
      <h1 className={styles.title}>{text}</h1>

      <div className={styles.todoList}>
        {items.length === 0 ? (
          <p className={styles.emptyMessage}>Nothing</p>
        ) : (
          items.map(item => (
            <Item
              key={item._id}
              item={item}
              onDelete={handleDeleteItem}
              onEdit={handleEditItem}
            />
          ))
        )}
      </div>
    </div>
  );
}