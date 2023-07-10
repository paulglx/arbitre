import { createSlice } from '@reduxjs/toolkit'

interface notification {
  id: number,
  message: string,
  type: 'success' | 'error' | 'warning' | 'info',
  timeCreated: Date,
}

const initialState = {
  notifications: [] as notification[],
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    pushNotification: (state, action) => {
      const { message, type } = action.payload;
      const id = state.notifications.length + 1;
      const timeCreated = new Date();
      const notification: notification = { id, message, type, timeCreated };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      const { id } = action.payload;
      state.notifications = state.notifications.filter((notif) => { return notif.id !== id });
    }
  }
});

export const { pushNotification, removeNotification } = notificationSlice.actions

export default notificationSlice.reducer

export const selectCurrentNotifications = (state: any) => state.notification.notifications