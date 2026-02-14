'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AddItemForm.module.css';

export default function AddItemForm() {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title }),
            });

            if (res.ok) {
                setTitle('');
                router.refresh(); // Refresh the server component to show new data
            }
        } catch (error) {
            console.error('Failed to add item', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter item title..."
                className={styles.input}
                disabled={loading}
            />
            <button type="submit" className={styles.button} disabled={loading}>
                {loading ? 'Adding...' : 'Add Item'}
            </button>
        </form>
    );
}
