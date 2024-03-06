import React from 'react';
import RiderApplicationReviewForm from "main/components/RiderApplication/RiderApplicationReviewForm";
import { riderApplicationFixtures } from 'fixtures/riderApplicationFixtures';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

export default {
    title: 'components/RiderApplication/RiderApplicationReviewForm',
    component: RiderApplicationReviewForm
};

const Template = (args) => {
    return (
        <RiderApplicationReviewForm {...args} />
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
const newRiderApp = riderApplicationFixtures.oneRiderApplication; 
newRiderApp.status = "pending";

EditAdminUser.args = {
    initialContents: newRiderApp,
    submitText: "Update",
    email: "capperson@ucsb.edu",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
};
