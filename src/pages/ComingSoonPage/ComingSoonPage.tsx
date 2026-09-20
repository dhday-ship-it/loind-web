import styles from "./ComingSoonPage.module.css";

export default function ComingSoonPage({ title }: { title: string }) {
  return (
    <main className={styles.wrap}>
      <p className={styles.eyebrow}>COMING SOON</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.desc}>페이지를 준비하고 있어요.</p>
    </main>
  );
}
