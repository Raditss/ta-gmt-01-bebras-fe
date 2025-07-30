import { useState, useCallback } from 'react';
import { profileApi, UpdateProfileRequest } from '@/lib/api/profile.api';
import { useAuthStore } from '@/store/auth.store';
import type { User } from '@/store/auth.store';

export interface ProfileFormData {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
  photoUrl: string;
}

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user, setUser } = useAuthStore();

  const updateProfile = useCallback(
    async (data: ProfileFormData) => {
      try {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        // Prepare update data (only include fields that have values)
        const updateData: UpdateProfileRequest = {};

        if (data.username && data.username !== user?.username) {
          updateData.username = data.username;
        }

        if (data.name && data.name !== user?.name) {
          updateData.name = data.name;
        }

        // Handle photoUrl - only send if it's a valid path or if it's being changed
        if (data.photoUrl !== user?.photoUrl) {
          // Only include if it's a valid path (starts with /avatar/)
          if (data.photoUrl && data.photoUrl.startsWith('/avatar/')) {
            updateData.photoUrl = data.photoUrl;
          } else if (data.photoUrl === '' && user?.photoUrl) {
            // If clearing the photoUrl, send undefined
            updateData.photoUrl = undefined;
          }
        }

        if (data.password) {
          updateData.password = data.password;
          updateData.confirmPassword = data.confirmPassword;
        }

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
          throw new Error('No changes to save');
        }

        console.log('Sending update data:', updateData); // Debug log

        const response = await profileApi.updateProfile(updateData);

        if (response.success) {
          // Update the user in the auth store with the form data that was successfully sent
          const updatedUser: User = {
            ...user!, // Keep existing user data (id, role, status, etc.)
            username: data.username,
            name: data.name,
            photoUrl: data.photoUrl || null // Use the form data directly
          };
          setUser(updatedUser);
          setSuccess(response.message);
          return { success: true, message: response.message };
        } else {
          throw new Error('Failed to update profile');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update profile';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [user, setUser]
  );

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return {
    updateProfile,
    isLoading,
    error,
    success,
    clearMessages
  };
};
