import Image from "next/image";
import reading from "../../content/reading.json";
import styles from "./reading.module.css";

export default function ReadingSection() {
  return <section id="reading" className={styles.section} aria-labelledby="reading-title">
    <header className={styles.header}>
      <div><p className={styles.eyebrow}>Away from the keyboard</p><h2 id="reading-title">Currently reading.</h2></div>
      <p>Five books I’m spending time with.</p>
    </header>
    <ul className={styles.shelf}>
      {reading.books.map(book => <li key={book.id}>
        <a href={book.href} aria-labelledby={`book-${book.id}`}>
          <div className={styles.cover}><Image src={book.cover} alt="" width={book.width} height={book.height} sizes="(max-width: 700px) 40vw, (max-width: 950px) 28vw, 190px" /></div>
          <div className={styles.bookInfo}><span className={styles.status}>{reading.status}</span><h3 id={`book-${book.id}`}>{book.title}</h3><p>{book.author}</p></div>
        </a>
      </li>)}
    </ul>
  </section>;
}
