import React from 'react';
import DriverAvailabilityForm from "main/components/DriverAvailability/DriverAvailabilityForm";
import { driverAvailabilityFixtures } from 'fixtures/driverAvailabilityFixtures';


export default {
    title: 'components/DriverAvailability/DriverAvailabilityForm',
    component: DriverAvailabilityForm
};

const Template = (args) => {
    return (
        <DriverAvailabilityForm {...args} />
    )
};


export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    intitialContents: driverAvailabilityFixtures.oneAvailability,
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};