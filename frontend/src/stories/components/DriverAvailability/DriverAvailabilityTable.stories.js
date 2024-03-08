import React from 'react';

import DriverAvailabilityTable from 'main/components/DriverAvailability/DriverAvailabilityTable';
import {driverAvailabilityFixtures} from 'fixtures/driverAvailabilityFixtures';

export default {
    title: 'components/DriverAvailability/DriverAvailabilityTable',
    component: DriverAvailabilityTable
};

const Template = (args) => {
    return (
        <DriverAvailabilityTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    driverAvailability: []
};

export const DriverAvailabilityThreeSubjects = Template.bind({});

DriverAvailabilityThreeSubjects.args = {
    driverAvailability: driverAvailabilityFixtures.threeAvailabilities,
};

