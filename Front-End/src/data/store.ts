import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import vacationReducer from './slices/vacationSlice';
export default configureStore({
    reducer: {
        user: userReducer,
        vacation: vacationReducer
    }
});