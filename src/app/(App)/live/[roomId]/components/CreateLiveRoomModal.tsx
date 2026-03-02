'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, Form } from 'react-bootstrap';
import { FaVideo, FaSpinner, FaBroadcastTower } from 'react-icons/fa';
// import styles from '../../_styles/CreateLiveRoomModal.module.scss';
import styles from '../../../_styles/live/createliveRoomModal.module.scss';

interface Props {
    courseId: number;
    courseTitle: string;
    show: boolean;
    onHide: () => void;
}

export default function CreateLiveRoomModal({ courseId, courseTitle, show, onHide }: Props) {
    const router = useRouter();
    const [title, setTitle] = useState(`Live Class — ${courseTitle}`);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async () => {
        if (!title.trim()) { setError('Please enter a session title'); return; }
        setError('');
        setCreating(true);

        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch('/api/live-rooms', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ courseId, title }),
            });

            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error || 'Failed to create room');
            }

            const room = await res.json();
            onHide();
            // Navigate to the live room as host
            router.push(`/live/${room.id}?mode=host`);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setCreating(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered className={styles.modal}>
            <div className={styles.modalContent}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerIcon}>
                        <FaBroadcastTower />
                    </div>
                    <div>
                        <h3>Start a Live Class</h3>
                        <p>Students will join via a shareable link</p>
                    </div>
                </div>

                {/* Form */}
                <div className={styles.body}>
                    <Form.Group className="mb-3">
                        <Form.Label className={styles.label}>Session Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.input}
                            placeholder="e.g. Week 3 — React Hooks Deep Dive"
                        />
                    </Form.Group>

                    <div className={styles.infoBox}>
                        <ul>
                            <li>📹 Your camera &amp; mic will be available immediately</li>
                            <li>🖥️ Screen sharing is enabled</li>
                            <li>🔗 Copy the student link from the top bar once inside</li>
                            <li>⏹️ Click "End Class" when you're done — it disconnects everyone</li>
                        </ul>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onHide} disabled={creating}>
                        Cancel
                    </button>
                    <button className={styles.startBtn} onClick={handleCreate} disabled={creating}>
                        {creating
                            ? <><FaSpinner className={styles.spin} /> Creating room…</>
                            : <><FaVideo /> Go Live</>}
                    </button>
                </div>
            </div>
        </Modal>
    );
}