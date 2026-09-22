import styles from "./Header.module.css";

export function GroupMenuTrigger({ open, onClick, label = "그룹사 메뉴 열기" }: { open: boolean; onClick: () => void; label?: string }) {
  return <button type="button" className={styles.menuButton} aria-label={label} aria-expanded={open} onClick={onClick}><span className={`${styles.menuBar} ${open ? styles.menuBarOpen : ""}`} /></button>;
}
