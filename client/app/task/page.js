import React from "react";
import Box from "./box/box.js";
import styles from "./page.module.css";

export default function UserRoute() {
  const listBox = [
    { id: 1, text: "Todo" },
    { id: 2, text: "Doing" },
    { id: 3, text: "Done" }
  ];

  return (
    <div className={styles.page}>
      {listBox.map((item) =>
        <Box key={item.id} text={item.text} />
      )}
    </div>
  );
}