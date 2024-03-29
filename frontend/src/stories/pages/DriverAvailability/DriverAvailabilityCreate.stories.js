import React from 'react';

import DriverAvailabilityCreatePage from 'main/pages/DriverAvailability/DriverAvailabilityCreatePage';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";


export default {
    title: 'pages/DriverAvailability/DriverAvailabilityCreatePage',
    component: DriverAvailabilityCreatePage
};

const Template = () => <DriverAvailabilityCreatePage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.post('/api/driverAvailability/post', (req, res, ctx) => {
            window.alert("POST: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
}