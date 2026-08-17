import { useEffect } from 'react';

export default function TurnstileWidget({ onVerify = () => {} }) {
  useEffect(() => {
    // Disabled/Bypassed widget per user request
    onVerify('test-bypassed');
  }, [onVerify]);

  return null;
}
