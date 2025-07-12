export const startTracking = (resume = false) => ({
    type: 'tracking/start',
    payload: { resume },
});

export const stopTracking = () => ({
    type: 'tracking/stop',
});

export const resetTracking = () => ({
    type: 'tracking/reset',
});

export const updateLocation = (payload) => ({
    type: 'tracking/updateLocation',
    payload,
});