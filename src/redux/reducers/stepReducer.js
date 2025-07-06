const initialState = {
    isTracking: false,
    locations: [],
    distance: 0,
    steps: 0,
    calories: 0,
    startTime: null,
};

function calculateDistance(prev, curr) {
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371e3;
    const dLat = toRad(curr.latitude - prev.latitude);
    const dLon = toRad(curr.longitude - prev.longitude);
    const lat1 = toRad(prev.latitude);
    const lat2 = toRad(curr.latitude);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export const stepReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'tracking/start':
            return {
                ...state,
                isTracking: true,
                locations: [],
                distance: 0,
                steps: 0,
                calories: 0,
                startTime: new Date(),
            };

        case 'tracking/stop':
            return {
                ...state,
                isTracking: false,
            };

        case 'tracking/updateLocation': {
            const newLocation = action.payload;
            const prev = state.locations[state.locations.length - 1];
            const dist = prev ? calculateDistance(prev, newLocation) : 0;
            const totalDist = state.distance + dist;

            return {
                ...state,
                locations: [...state.locations, newLocation],
                distance: totalDist,
                steps: Math.floor(totalDist / 0.8),
                calories: Math.floor(totalDist / 20),
            };
        }

        default:
            return state;
    }
};
  