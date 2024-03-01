import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import RiderApplicationShowPage from "main/pages/RiderApplication/RiderApplicationShowPage"
import { riderApplicationFixtures } from 'fixtures/riderApplicationFixtures';

export default {
    title: 'pages/RiderApplication/RiderApplicationShowPage',
    component: RiderApplicationShowPage
};

const Template = () => <RiderApplicationShowPage storybook={true} />;

export const Empty = Template.bind({});
Empty.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/riderApplication', (_req, res, ctx) => {
            return res(ctx.json([]));
        }),
    ]
}

export const NormalApplication = Template.bind({});

NormalApplication.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/riderApplication', (_req, res, ctx) => {
            return res(ctx.json(riderApplicationFixtures.oneRiderApplication));
        }),
    ],
}