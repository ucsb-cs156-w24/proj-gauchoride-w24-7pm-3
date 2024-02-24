import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import RiderApplicationEditPage from "main/pages/RiderApplicationEditPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});


describe("RiderApplicationEditPage tests", () => {

    describe("when the backend doesn't return data", () => {
        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        });

        const queryClient = new QueryClient();

        test("renders normal create application form", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RiderApplicationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Rider Application");
            expect(screen.queryByTestId("RiderApplicationForm-id")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/riderApplication", { params: { id: 17 } }).reply(200, {
                id: 17,
                status: "deny",
                perm_number: "1313131",
                created_date: "2023-06-22T05:22:22",
                updated_date: "2023-07-22T05:22:22",
                cancelled_date: "2023-07-25T05:22:22",
                description: "I have broken leg",
                notes: "You have not been approved"
            });
            axiosMock.onPut('/api/riderApplication').reply(200, {
                id: 17,
                perm_number: "1234567",
                status: "deny",
                created_date: "2023-06-22T05:22:22",
                updated_date: "2023-07-22T05:22:22",
                cancelled_date: "2023-07-25T05:22:22",
                description: "I have no broken leg",
                notes: "You have been approved"
            });
        });

        const queryClient = new QueryClient();
        
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RiderApplicationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("RiderApplicationForm-id");

            const idField = screen.getByTestId("RiderApplicationForm-id");
            const statusField = screen.getByTestId("RiderApplicationForm-status");
            const emailField = screen.getByTestId("RiderApplicationForm-email");
            const createDateField = screen.getByTestId("RiderApplicationForm-created_date");
            const updatedDateField = screen.getByTestId("RiderApplicationForm-updated_date");
            const cancelledDateField = screen.getByTestId("RiderApplicationForm-cancelled_date");
            const permNumberField = screen.getByTestId("RiderApplicationForm-perm_number");
            const descriptionField = screen.getByTestId("RiderApplicationForm-description");
            const notesField = screen.getByTestId("RiderApplicationForm-notes");

            const submitButton = screen.getByTestId("RiderApplicationForm-submit")

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(statusField).toBeInTheDocument();
            expect(statusField).toHaveValue("deny");
            expect(emailField).toBeInTheDocument();
            expect(createDateField).toBeInTheDocument();
            expect(createDateField).toHaveValue("2023-06-22T05:22:22");
            expect(updatedDateField).toBeInTheDocument();
            expect(updatedDateField).toHaveValue("2023-07-22T05:22:22");
            expect(cancelledDateField).toBeInTheDocument();
            expect(cancelledDateField).toHaveValue("2023-07-25T05:22:22");
            expect(permNumberField).toBeInTheDocument();
            expect(permNumberField).toHaveValue("1313131");
            expect(descriptionField).toBeInTheDocument();
            expect(descriptionField).toHaveValue("I have broken leg");
            expect(notesField).toBeInTheDocument();
            expect(notesField).toHaveValue("You have not been approved");


            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(permNumberField, { target: { value: '1234567' } });
            fireEvent.change(descriptionField, { target: { value: 'I have no broken leg' } });
            fireEvent.change(notesField, { target: { value: 'You have been approved' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Rider Application Updated - id: 17 perm_number: 1234567");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/apply/rider" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                status: "deny",
                perm_number: "1234567",
                created_date: "2023-06-22T05:22:22",
                updated_date: "2023-07-22T05:22:22",
                cancelled_date: "2023-07-25T05:22:22",
                description: "I have no broken leg",
                notes: "You have been approved"
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RiderApplicationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            const idField = screen.getByTestId("RiderApplicationForm-id");
            const statusField = screen.getByTestId("RiderApplicationForm-status");
            const emailField = screen.getByTestId("RiderApplicationForm-email");
            const createDateField = screen.getByTestId("RiderApplicationForm-created_date");
            const updatedDateField = screen.getByTestId("RiderApplicationForm-updated_date");
            const cancelledDateField = screen.getByTestId("RiderApplicationForm-cancelled_date");
            const permNumberField = screen.getByTestId("RiderApplicationForm-perm_number");
            const descriptionField = screen.getByTestId("RiderApplicationForm-description");
            const notesField = screen.getByTestId("RiderApplicationForm-notes");

            const submitButton = screen.getByTestId("RiderApplicationForm-submit")

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(statusField).toBeInTheDocument();
            expect(statusField).toHaveValue("deny");
            expect(emailField).toBeInTheDocument();
            expect(createDateField).toBeInTheDocument();
            expect(createDateField).toHaveValue("2023-06-22T05:22:22");
            expect(updatedDateField).toBeInTheDocument();
            expect(updatedDateField).toHaveValue("2023-07-22T05:22:22");
            expect(cancelledDateField).toBeInTheDocument();
            expect(cancelledDateField).toHaveValue("2023-07-25T05:22:22");
            expect(permNumberField).toBeInTheDocument();
            expect(permNumberField).toHaveValue("1313131");
            expect(descriptionField).toBeInTheDocument();
            expect(descriptionField).toHaveValue("I have broken leg");
            expect(notesField).toBeInTheDocument();
            expect(notesField).toHaveValue("You have not been approved");

            fireEvent.change(permNumberField, { target: { value: '1234567' } });
            fireEvent.change(descriptionField, { target: { value: 'I have no broken leg' } });
            fireEvent.change(notesField, { target: { value: 'You have been approved' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Rider Application Updated - id: 17 perm_number: 1234567");
            expect(mockNavigate).toBeCalledWith({ "to": "/apply/rider" });
            
        });

       
    });
});

