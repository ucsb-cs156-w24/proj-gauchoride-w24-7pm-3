import React from 'react';

import DriverAvailabilityEditPage from 'main/pages/DriverAvailability/DriverAvailabilityEditPage';
import { driverAvailabilityFixtures } from 'fixtures/driverAvailabilityFixtures';

export default {
    title: 'pages/DriverAvailability/DriverAvailabilityEditPage',
    component: DriverAvailabilityEditPage
};

const Template = () => <DriverAvailabilityEditPage />;

export const Default = Template.bind({});

Default.args = {
    initialContents: driverAvailabilityFixtures.oneAvailability
};




