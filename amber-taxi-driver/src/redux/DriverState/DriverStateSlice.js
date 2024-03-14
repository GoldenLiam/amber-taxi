import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchDriveState } from './DriverStateAPI';

//https://redux.js.org/introduction/examples/

const initialState = {
    currentState: "offline",
    coords: "unknown",
    lastTimeStateChanged: Date.now(),
    lastTimeLocationChanged: Date.now(),
};


export const getDriverStateAsync = createAsyncThunk(
    'DriverState/fetchDriveState',
    async (amount) => {
        const response = await fetchDriveState(amount);
        return response.data;
    }
);


export const driverStateSlice = createSlice({
    name: 'driveState',
    initialState,
    
    reducers: {
        goOnline: (state) => {
            state.currentState = "online";
            state.lastTimeStateChanged = Date.now();
        },

        goOffline: (state) => {
            state.currentState = "offline";
            state.lastTimeStateChanged = Date.now();
        },

        /*https://redux.js.org/tutorials/fundamentals/part-8-modern-redux*/
        updateCoords:{
            reducer(state, action) {
                const driverCoords = action.payload;
                state.coords = driverCoords;
            },
            prepare( { accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed } ) {
                return {
                    payload: { accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed }
                }
            }
        },
        
        getDriverStateFromServer: (state, action) => {
            
            state.currentState = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
        .addCase(getDriverStateAsync.pending, (state) => {
            state.currentState = 'unkown';
        });
    }

    /*
    extraReducers: (builder) => {
        builder
        .addCase(getDriverStateAsync.pending, (state) => {
            state.currentState = 'unkown';
        });
    }
    */
});


export const { goOnline, goOffline, getDriverStateFromServer, updateCoords } = driverStateSlice.actions;

export let selectDriverState = (state) => state.driverStatus; //Tạo sao lại là driverStatus vì store.js là driverStatus

export default driverStateSlice.reducer;