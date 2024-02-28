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
    driverAvailabilities: []
};

export const DriverAvailabilityThreeSubjects = Template.bind({});

DriverAvailabilityThreeSubjects.args = {
    driverAvailabilities: driverAvailabilityFixtures.threeAvailabilities,
};

