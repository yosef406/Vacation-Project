import { createSlice } from '@reduxjs/toolkit'
import vacationType from '../../types/vacationType';


export const vacationsSlice = createSlice({
    name: 'user',
    initialState: {
        value: new Array<vacationType>()
    },
    reducers: {
        fillVacations: (state, action) => {
            state.value = action.payload;
        },
        removeVacations: (state) => {
            state.value = []
        }
    },
});

export const { fillVacations, removeVacations } = vacationsSlice.actions;

export const getAllVacations = (state: { vacation: { value: vacationType[] } }) => state.vacation.value;

export default vacationsSlice.reducer;
