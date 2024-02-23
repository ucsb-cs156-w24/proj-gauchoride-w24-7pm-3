import React from 'react';
import RiderApplicationForm from "main/components/RiderApplication/RiderApplicationForm";
import { riderApplicationFixtures } from 'fixtures/riderApplicationFixtures';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

export default {
    title: 'components/RiderApplication/RiderApplicationForm',
    component: RiderApplicationForm
};

const Template = (args) => {
    return (
        <RiderApplicationForm {...args} />
    )
};


export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
    ]
};
Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const EditRegularUser = Template.bind({});
EditRegularUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
    ]
};
EditRegularUser.args = {
    initialContents: riderApplicationFixtures.oneRiderApplication,
    submitText: "Update",
    submitAction: () => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
};

export const EditAdminUser = Template.bind({});
EditAdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.adminOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
    ]
};
EditAdminUser.args = {
    initialContents: riderApplicationFixtures.oneRiderApplication,
    submitText: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
};
