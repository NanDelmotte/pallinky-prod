'use client';
import { useEffect } from 'react';

export default function HostIdentification({ email }: { email: string }) {
  useEffect(() => {
    if (email) {
      // This "logs in" the user locally so they can see their dashboard
      localStorage.setItem('pallinky_host_email', email);
    }
  }, [email]);

  return null; // This component doesn't render anything
}