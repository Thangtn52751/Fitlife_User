export const startTracking = () => ({
    type: 'tracking/start',
});

export const stopTracking = () => ({
    type: 'tracking/stop',
});

export const updateLocation = (payload) => ({
    type: 'tracking/updateLocation',
    payload,
});
  