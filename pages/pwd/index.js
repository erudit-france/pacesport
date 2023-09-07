// pages/pwd.js

import { useState, useEffect } from 'react';
import { BackgroundImage } from "@mantine/core";
import { useRouter } from 'next/router';
import Navbar from '@/components/navbar/Navbar';
import styles from '@/styles/pwd.module.css';
import Layout from '../layout'

export default function Page() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/password/update?XDEBUG_SESSION_START=tom', {
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

      if (data.code === 1) {
        setIsSuccess(true);
        setMessage(data.data || 'Mot de passe mis à jour avec succès');
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
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Changer votre mot de passe</h1>
        <p>Veuillez entrer votre nouveau mot de passe ci-dessous.</p>
        <div className={styles.passwordInputContainer} style={{ display: 'flex' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <button
            type="button"
            className={styles.showPasswordButton}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? 'Masquer' : 'Afficher'}
          </button>
        </div>
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
Page.getLayout = function getLayout(page) {
  return (
    <>
      <main className="tw-relative" style={{ minHeight: 'calc(100vh)' }}>
        <div className="">
          <section className="tw-z-20">{page}</section>
        </div>
        <div className="tw-w-full tw-h-full tw-absolute tw-top-0 -tw-z-10">
          <BackgroundImage className="tw-h-full tw-opacity-10"
            src={'/doodle-pattern.png'} />
          <BackgroundImage className="tw-h-full tw-w-full tw-absolute tw-top-0 tw-opacity-80 -tw-z-20
                      tw-bg-gradient-to-b tw-from-white tw-from-10% tw-via-[#d61515] tw-via-40% tw-to-[#d61515] tw-to-90%" />
        </div>
      </main>
    </>
  )
}
