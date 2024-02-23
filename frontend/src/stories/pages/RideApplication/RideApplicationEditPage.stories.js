import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import RiderApplicationEditPage from "main/pages/RiderApplicationEditPage";
import { riderApplicationFixtures } from 'fixtures/riderApplicationFixtures';

export default {
    title: 'pages/RiderApplication/RiderApplicationEditPage',
    component: RiderApplicationEditPage
};

const Template = () => <RiderApplicationEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/riderApplication', (_req, res, ctx) => {
            return res(ctx.json(riderApplicationFixtures.threeRiderApplications[0]));
        }),
        rest.put('/api/riderApplication', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}