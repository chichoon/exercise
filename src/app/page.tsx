import { getDb } from '@/lib/db';
import AddItemForm from './components/AddItemForm';
import styles from './page.module.css';

export const dynamic = 'force-dynamic'; // Ensure fresh data on every request

export default async function Home() {
  const db = await getDb();
  await db.read();
  const items = db.data.items;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Item List</h1>
        <AddItemForm />

        <div className={styles.list}>
          {items.length === 0 ? (
            <p className={styles.empty}>No items yet. Add one above!</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.item}>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.itemDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
