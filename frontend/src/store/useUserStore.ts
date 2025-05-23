import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface UserState {
    users: { id: number; name: string; email: string }[] | [];
    isGettingUsers: boolean;
    getUsers: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    users: [],
    isGettingUsers: false,

    getUsers: async () => {
        set({ isGettingUsers: true });
        try {
            const response = await axiosInstance.get('/userPage/getUsers');
            set({ users: response.data.users });

        } catch (err) {
            const error = err as AxiosError;
            console.error('Error during getUsers:', error);
            toast.error('Failed to get users!');
            
        } finally {
            set({ isGettingUsers: false });
        }
    },
}));