import { apiCore } from './core';
import { UserRole } from '@/types/user-role';

export interface UpdateProfileRequest {
  username?: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    username: string;
    name: string;
    role: UserRole;
  };
}

export const profileApi = {
  /**
   * Update user profile
   */
  async updateProfile(
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> {
    try {
      const response = await apiCore.put<UpdateProfileResponse>(
        '/profile',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }
};
