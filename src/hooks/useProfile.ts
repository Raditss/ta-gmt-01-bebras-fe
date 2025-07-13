import { useState, useCallback } from 'react';
import { profileApi, UpdateProfileRequest } from '@/lib/api/profile.api';
import { useAuthStore } from '@/store/auth.store';

export interface ProfileFormData {
  username: string;
  name: string;
  password: string;
  confirmPassword: string;
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

        if (data.password) {
          updateData.password = data.password;
          updateData.confirmPassword = data.confirmPassword;
        }

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
          throw new Error('No changes to save');
        }

        const response = await profileApi.updateProfile(updateData);

        if (response.success) {
          // Update the user in the auth store
          setUser(response.user);
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
