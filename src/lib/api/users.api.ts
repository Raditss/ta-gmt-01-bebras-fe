import { apiCore } from './core';

export interface GetUsersParams {
  skip?: number;
  take?: number;
  where?: Record<string, unknown>;
  orderBy?: Record<string, unknown>;
  search?: string;
}

export interface UpdateUserStatusParams {
  username: string;
  status: string;
}

export const usersApi = {
  async getUsers(params?: GetUsersParams) {
    const searchParams = new URLSearchParams();
    if (params?.skip !== undefined)
      searchParams.append('skip', params.skip.toString());
    if (params?.take !== undefined)
      searchParams.append('take', params.take.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.orderBy)
      searchParams.append('orderBy', JSON.stringify(params.orderBy));
    if (params?.where)
      searchParams.append('where', JSON.stringify(params.where));
    const queryString = searchParams.toString();
    const url = queryString ? `/users?${queryString}` : '/users';
    const response = await apiCore.get(url);
    return response.data;
  },

  async updateUserStatus(data: UpdateUserStatusParams) {
    const response = await apiCore.post('/users/status', data);
    return response.data;
  }
};
