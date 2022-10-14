import { createSlice } from '@reduxjs/toolkit'
import userType from '../../types/userType';

function getCurrentUser() {
    if (sessionStorage.getItem('currentUser')) {
        return JSON.parse(sessionStorage.getItem('currentUser') as string) as userType;
    }
    return {
        first_name: "",
        last_name: "",
        userName: "",
        password: "",
        _id: "",
        role: "",
        following: [],
        signedIn: false
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        value: getCurrentUser()
    },
    reducers: {
        addUser: (state, action) => {

            let newUser = {
                ...action.payload,
                signedIn: true
            }
            sessionStorage.setItem('currentUser', JSON.stringify(newUser));
            state.value = newUser;
        },
        removeUser: (state) => {
            state.value = {
                first_name: "",
                last_name: "",
                userName: "",
                password: "",
                _id: "",
                role: "",
                following: [],
                signedIn: false
            }
            sessionStorage.removeItem('currentUser');
        }
    },
});

export const { addUser, removeUser } = userSlice.actions;

export const getUser = (state: { user: { value: userType } }) => state.user.value;
export const getUserRole = (state: { user: { value: userType } }) => state.user.value.role;
export const getUserSignInState = (state: { user: { value: userType } }) => state.user.value.signedIn;

export default userSlice.reducer;
