import { createSlice } from '@reduxjs/toolkit';

const ToastSlice = createSlice({
    name: 'ToastState',
    initialState: {
        ToastValue: {
            State: '',
            Field: '',
            Message: ''
        }
    },
    reducers: {
        setToast: (state, action) => {
            state.ToastValue = action.payload;
        }
    }
});

export const { setToast } = ToastSlice.actions;
export default ToastSlice.reducer;