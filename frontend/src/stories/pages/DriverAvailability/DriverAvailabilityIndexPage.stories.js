import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { driverAvailabilityFixtures } from "fixtures/driverAvailabilityFixtures";
import { rest } from "msw";

import DriverAvailabilityIndexPage from 'main/pages/DriverAvailability/DriverAvailabilityIndexPage';

export default {
    title: 'pages/DriverAvailability/DriverAvailabilityIndexPage',
    component: DriverAvailabilityIndexPage
};

const Template = () => <DriverAvailabilityIndexPage />;

export const Default = Template.bind({});

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/driverAvailability/admin/all', (_req, res, ctx) => {
            return res(ctx.json(driverAvailabilityFixtures.threeAvailabilities));
        }),
        rest.delete('/api/driverAvailability', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}


