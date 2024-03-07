const driverAvailabilityFixtures = {
    oneAvailability: [
        {
            id: 1,
            driverId: 1,
            day: "Monday",
            startTime: "3:30PM",
            endTime: "4:45PM",
            notes: "Available for short trips"
        }
    ],
    threeAvailabilities: [
        {
            id: 2,
            driverId: 2,
            day: "Tuesday",
            startTime: "5:00PM",
            endTime: "5:50PM",
            notes: "Evening shifts preferred"
        },
        {
            id: 3,
            driverId: 3,
            day: "Wednesday",
            startTime: "11:00AM",
            endTime: "11:15AM",
            notes: "Brief midday availability"
        },
        {
            id: 4,
            driverId: 4,
            day: "Thursday",
            startTime: "4:15PM",
            endTime: "5:30PM",
            notes: "Available for longer afternoon to evening shifts"
        }
    ]
};

export { driverAvailabilityFixtures };