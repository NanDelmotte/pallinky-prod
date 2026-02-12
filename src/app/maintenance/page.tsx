"use client";

import React from 'react';

export default function MaintenancePage() {
  return (
    <main style={styles.container}>
      <div style={styles.content}>
        <div style={styles.logoContainer}>
          {/* A simple placeholder for your logo or a graphic icon */}
          <div style={styles.pulseIcon}>P</div>
        </div>
        
        <h1 style={styles.heading}>We’ll be right back.</h1>
        
        <p style={styles.text}>
          Pallinky is getting a quick tune-up. <br />
          We’re polishing the pixels and should be back in just a moment.
        </p>

        <div style={styles.statusBar}>
          <div style={styles.statusDot}></div>
          <span style={styles.statusText}>Maintenance in progress</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      `}</style>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1a1a1a',
    textAlign: 'center',
    padding: '20px',
  },
  content: {
    maxWidth: '400px',
  },
  logoContainer: {
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'center',
  },
  pulseIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    backgroundColor: '#000',
    color: '#fff',
    fontSize: '32px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'pulse 2s infinite ease-in-out',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    marginBottom: '16px',
  },
  text: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#666',
    marginBottom: '40px',
  },
  statusBar: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '100px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#22c55e', // Success green
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: '#444',
  }
};