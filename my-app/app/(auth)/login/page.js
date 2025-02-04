

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/login.module.css';


export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    router.push('/');
  };
 


  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          autoComplete="off"
          name="username"
          className={styles.input}
          placeholder="Username"
        />
        <input
          type="password"
          autoComplete="off"
          name="password"
          className={styles.input}
          placeholder="Password"
        />
        <button type="submit" className={styles.button}>Login</button>
        </form>
        </div>
  );
}
