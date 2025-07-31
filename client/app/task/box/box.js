'use client'

import React, { useState } from "react";
import styles from "./box.module.css";
import Item from "../item/item.js";

export default function Box({ text }) {
  const [items, setItems] = useState([
    { id: 1, name: "Learn React", status: "", assignees: [] },
    { id: 2, name: "Build a todo app", status: "", assignees: [] },
    { id: 3, name: "Deploy to production", status: "", assignees: [] }
  ]);
  const [newItemText, setNewItemText] = useState("");

  const handleAddItem = () => {
    if (newItemText.trim() === "") return;
    
    const newItem = { 
      id: Date.now(),
      name: newItemText.trim(), 
      status: text.toLowerCase(),
      assignees: []
    };
    setItems([...items, newItem]);
    setNewItemText("");
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleEditItem = (id, name, assignees, status) => {
    if (name.trim() === "") return;
    setItems(items.map(item =>
      item.id === id ? { ...item, name: name.trim(), assignees: assignees, status: status } : item
    ));
  };

  return (
    <div className={styles.board}>
      <h1 className={styles.title}>{text}</h1>

      <div className={styles.addSection}>
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add new item..."
          className={styles.input}
        />
        <button 
          onClick={handleAddItem} 
          className={styles.addButton}
          disabled={newItemText.trim() === ""}
        >
          + Add
        </button>
      </div>

      <div className={styles.todoList}>
        {items.length === 0 ? (
          <p className={styles.emptyMessage}>Nothing</p>
        ) : (
          items.map(item => (
            <Item
              key={item.id}
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