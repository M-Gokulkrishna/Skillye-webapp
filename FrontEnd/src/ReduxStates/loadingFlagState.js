import { createSlice } from '@reduxjs/toolkit';

const setLoadingFlag = createSlice({
    name: 'LoaderState',
    initialState: { flag: false },
    reducers: {
        setLoaderState: (state, action) => {
            state.flag = action.payload;
        }
    }
});

export const { setLoaderState } = setLoadingFlag.actions;
export default setLoadingFlag.reducer;