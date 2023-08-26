// pages/pwd.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/pwd.module.css';

export default function PwdPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router.push('/login');
      }, 3000); // Rediriger après 3 secondes
    }
  }, [isSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/password/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Mot de passe mis à jour avec succès');
      } else {
        setIsSuccess(false);
        setMessage(data.message || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setIsSuccess(false);
      setMessage('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Changer votre mot de passe</h1>
      <p>Veuillez entrer votre nouveau mot de passe ci-dessous.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? 'Chargement...' : 'Valider'}
        </button>
      </form>
      {message && (
        <div className={isSuccess ? styles.success : styles.error}>
          {message}
        </div>
      )}
    </div>
  );
}
