import { createSlice } from '@reduxjs/toolkit'

const membershipSlice = createSlice({
    name: 'membership',
    initialState: {
        plan: 'free', // 'free' or 'plus'
    },
    reducers: {
        setPlan: (state, action) => {
            state.plan = action.payload
        },
    },
})

export const { setPlan } = membershipSlice.actions
export default membershipSlice.reducer
