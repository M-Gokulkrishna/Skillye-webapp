import { createSlice } from '@reduxjs/toolkit';

const setInputValue = createSlice({
    name: 'InputValue',
    initialState: { SearchValue: '' },
    reducers: {
        setSearchValue: (state, action) => {
            state.SearchValue = action.payload;
        }
    }
});

export const { setSearchValue } = setInputValue.actions;
export default setInputValue.reducer;