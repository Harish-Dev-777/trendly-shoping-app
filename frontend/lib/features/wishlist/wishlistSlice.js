import { createSlice } from '@reduxjs/toolkit'

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        wishlistItems: [],
    },
    reducers: {
        addToWishlist: (state, action) => {
            const { productId } = action.payload
            if (!state.wishlistItems.includes(productId)) {
                state.wishlistItems.push(productId)
            }
        },
        removeFromWishlist: (state, action) => {
            const { productId } = action.payload
            state.wishlistItems = state.wishlistItems.filter(id => id !== productId)
        },
        setWishlist: (state, action) => {
            state.wishlistItems = action.payload
        },
    }
})

export const { addToWishlist, removeFromWishlist, setWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer
