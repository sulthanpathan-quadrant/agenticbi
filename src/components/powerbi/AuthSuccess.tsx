import { useEffect } from 'react';

export function AuthSuccess() {
  useEffect(() => {
    // Signal to the parent window that auth succeeded
    localStorage.setItem('pbi_auth_success', 'true');
    window.close();
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <p style={{ color: '#555', fontSize: '0.9rem' }}>Authentication successful. Closing...</p>
    </div>
  );
}