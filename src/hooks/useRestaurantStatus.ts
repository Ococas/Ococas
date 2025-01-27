import { useState, useEffect } from 'react';

export function useRestaurantStatus() {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      // Set timezone to Lisbon
      const lisbonTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Lisbon' }));
      const hours = lisbonTime.getHours();
      
      // Open from 11:00 to 23:00 every day
      setIsOpen(hours >= 11 && hours < 23);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  return isOpen;
}