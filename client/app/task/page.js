'use client'

import React, { useState, useEffect } from "react";
import Box from "./box/box.js";
import styles from "./page.module.css";

export default function UserRoute() {
  const [todoItem, setTodoItem] = useState([]);
  const [doingItem, setDoingItem] = useState([]);
  const [doneItem, setDoneItem] = useState([]);

  const fetchItems = async (text) => {
    try {
      const response = await fetch("http://localhost:3001/tasks/" + text.toLowerCase(), { 
        method: 'GET' 
      });
      const data = await response.json();

      text = text.toLowerCase();
      if(text === "todo") setTodoItem(data);
      else if(text === "doing") setDoingItem(data);
      else if(text === "done") setDoneItem(data);
    } catch (error) {
      console.error("Error fetching Task items:", error);
    }
  };

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
    </div>
  );
}