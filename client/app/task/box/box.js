'use client'

import React from "react";
import styles from "./box.module.css";
import Item from "../item/item.js";

export default function Box({ text, items, onChange }) {
  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch("http://localhost:3001/tasks/" + id, {
        method: 'DELETE'
      });
      const data = await response.json();
      console.log("Item deleted:", data);

      onChange(text);
    } catch (error) {
      console.error("Error delete Task item:", error);
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
      const data = await response.json();
      console.log("Item updated:", data);
      
      onChange(text);
      onChange(status);
    } catch (error) {
      console.error("Error adding Task item:", error);
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