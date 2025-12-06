import { useState, useEffect } from 'react';

const useProfileStatus = () => {
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const checkProfileStatus = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsLoading(false);
      setProfileData(null);
      setIsProfileComplete(false);
      return;
    }

    try {
      console.log('Fetching profile data...');
      const response = await fetch(`http://localhost:5000/api/profile/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Profile API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data);
        setProfileData(data);
        setIsProfileComplete(Boolean(data.isProfileComplete));
      } else if (response.status === 401) {
        // Token invalid or expired
        console.log('Token invalid or expired');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsProfileComplete(false);
        setProfileData(null);
      } else {
        console.error('Failed to fetch profile status, status code:', response.status);
        setIsProfileComplete(false);
      }
    } catch (error) {
      console.error('Error checking profile status:', error);
      setIsProfileComplete(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkProfileStatus();
    
    // Listen for storage events to update if token changes
    const handleStorageChange = () => {
      checkProfileStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Custom event for login/logout within the same tab
    window.addEventListener('auth-change', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, []);

  return {
    isProfileComplete,
    isLoading,
    profileData,
    refetch: checkProfileStatus
  };
};

export default useProfileStatus;
