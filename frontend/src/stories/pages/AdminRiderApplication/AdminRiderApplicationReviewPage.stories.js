import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import AdminRiderApplicationReviewPage from "main/pages/AdminRiderApplication/AdminRiderApplicationReviewPage";
import { riderApplicationFixtures } from 'fixtures/riderApplicationFixtures';

export default {
    title: 'pages/AdminRiderApplication/AdminRiderApplicationReviewPage',
    component: AdminRiderApplicationReviewPage
};

const Template = () => <AdminRiderApplicationReviewPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/riderApplication', (_req, res, ctx) => {
            const riderApp = {...riderApplicationFixtures.oneRiderApplication};
            riderApp.status = "pending";
            return res(ctx.json(riderApp));
        }),
        rest.put('/api/rider/admin', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}