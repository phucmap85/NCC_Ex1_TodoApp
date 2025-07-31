import React from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function Main() {
  return (
    <div className={styles.container}>
      <h1>Todo App</h1>
      <nav className={styles.nav}>
        <Link href="/task" className={styles.link}>
          Task Management
        </Link>
        <Link href="/user" className={styles.link}>
          User Management
        </Link>
      </nav>
    </div>
  );
}