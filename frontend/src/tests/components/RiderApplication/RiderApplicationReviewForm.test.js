import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import RiderApplicationReviewForm from "main/components/RiderApplication/RiderApplicationReviewForm";
import { riderApplicationFixtures } from "fixtures/riderApplicationFixtures";

import { apiCurrentUserFixtures} from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));



describe("RiderApplicationReviewForm when editing tests", () => {
    const queryClient = new QueryClient();
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onGet("/api/riderApplication", { params: { id: 17 } }).timeout();
    });

    const expectedHeaders = ["Email", "Perm Number", "Description"];
    const testId = "RiderApplicationReviewForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RiderApplicationReviewForm submitAction={() => { }} />
                </Router>
            </QueryClientProvider>
        );

        expect(screen.queryByText(/Approve/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Deny/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Return without Saving/)).not.toBeInTheDocument();
        
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(screen.queryByText(/Status/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Applied/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Updated/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Date Cancelled/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Notes/)).not.toBeInTheDocument();

    });


    test("renders correctly when passing in initialContents with pending status", async () => {
        const newRiderApp = {...riderApplicationFixtures.oneRiderApplication};
        newRiderApp.status = "pending";
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RiderApplicationReviewForm initialContents={newRiderApp} submitAction={() => { }} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Approve/)).toBeInTheDocument();


        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByText(/Status(.*)/)).toBeInTheDocument();
        expect(screen.getByText(/Date Applied/)).toBeInTheDocument();
        expect(screen.getByText(/Date Updated/)).toBeInTheDocument();
        expect(screen.getByText(/Date Cancelled/)).toBeInTheDocument();
        expect(screen.getByText(/Notes/)).toBeInTheDocument();

        expect(await screen.findByText(/Approve/)).toBeInTheDocument();
        expect(await screen.findByText(/Deny/)).toBeInTheDocument();
        expect(await screen.findByText(/Return without Saving/)).toBeInTheDocument();

    });

    test("renders correctly when passing in initialContents with approved status", async () => {
        const newRiderApp = {...riderApplicationFixtures.oneRiderApplication};
        newRiderApp.status = "accepted";
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RiderApplicationReviewForm initialContents={newRiderApp} submitAction={() => { }} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Set Status to Expired/)).toBeInTheDocument();


        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByText("Status")).toBeInTheDocument();
        expect(screen.getByText(/Date Applied/)).toBeInTheDocument();
        expect(screen.getByText(/Date Updated/)).toBeInTheDocument();
        expect(screen.getByText(/Date Cancelled/)).toBeInTheDocument();
        expect(screen.getByText(/Notes/)).toBeInTheDocument();

        expect(await screen.findByText(/Set Status to Expired/)).toBeInTheDocument();
        expect(await screen.findByText(/Return without Saving/)).toBeInTheDocument();

    });


    test("that navigate(-1) is called when Return Without Saving is clicked", async () => {
        const newRiderApp = {...riderApplicationFixtures.oneRiderApplication};
        newRiderApp.status = "pending";
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RiderApplicationReviewForm initialContents={newRiderApp} submitAction={() => { }} />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-return-without-save`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-return-without-save`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed for pending applications", async () => {
        const newRiderApp = {...riderApplicationFixtures.oneRiderApplication};
        newRiderApp.status = "pending";
        
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RiderApplicationReviewForm initialContents={newRiderApp} submitAction={() => {}} />
                </Router>
            </QueryClientProvider>
        );

        // required buttons

        const approveButton = screen.getByTestId(`${testId}-approve`);
        fireEvent.click(approveButton);

        const denyButton = screen.getByTestId(`${testId}-deny`);
        fireEvent.click(denyButton);


    });

    test("that the correct validations are performed for accepted applications", async () => {
        const newRiderApp = {...riderApplicationFixtures.oneRiderApplication};
        newRiderApp.status = "accepted";
        
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RiderApplicationReviewForm initialContents={newRiderApp} submitAction={() => {}} />
                </Router>
            </QueryClientProvider>
        );

        // required buttons
        const acceptedButton = screen.getByTestId(`${testId}-set-expired`);
        fireEvent.click(acceptedButton);

        // test back navigate for accepted app
        expect(await screen.findByTestId(`${testId}-return-without-save`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-return-without-save`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});
