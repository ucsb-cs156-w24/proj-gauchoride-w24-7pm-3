import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RiderApplicationShowPage from "main/pages/RiderApplication/RiderApplicationShowPage";

import { apiCurrentUserFixtures} from "fixtures/currentUserFixtures";
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

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.memberOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/riderApplication", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RiderApplicationShowPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Rider Application");
            expect(queryByTestId("RiderApplicationForm-id")).not.toBeInTheDocument();
            restoreConsole();
        });
    });
    

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/riderApplication", { params: { id: 17 } }).reply(200, {
                id: 17,
                perm_number: "1234567",
                status: "pending",
                email: "random@example.org",
                created_date: "2023-04-17",
                updated_date: "2023-04-17",
                cancelled_date: "2023-04-17",
                description: "",
                notes: "you will not be approved"
            });
            axiosMock.onPut('/api/riderApplication').reply(200, {
                id: 17,
                perm_number: "7654321",
                status: "pending",
                email: "random@example.org",
                created_date: "2023-04-17",
                updated_date: "2023-08-25",
                cancelled_date: "2023-04-17",
                description: "My leg is broken",
                notes: "you will not be approved"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RiderApplicationShowPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RiderApplicationShowPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("RiderApplicationForm-id");

            const statusField =getByTestId("RiderApplicationForm-status");
            const permNumberField = getByTestId("RiderApplicationForm-perm_number");
            const emailField =getByTestId("RiderApplicationForm-email");
            const createdDateField =getByTestId("RiderApplicationForm-created_date");
            const updatedDateField =getByTestId("RiderApplicationForm-updated_date");
            const cancelledDateField = screen.queryByTestId("RiderApplicationForm-cancelled_date");
            const descriptionField = getByTestId("RiderApplicationForm-description");
            const notesField = screen.queryByTestId("RiderApplicationForm-notes");

            expect(statusField).toHaveValue("pending");
            expect(permNumberField).toHaveValue("1234567");
            expect(emailField).toHaveValue("random@example.org");
            expect(createdDateField).toHaveValue("2023-04-17");
            expect(updatedDateField).toHaveValue("2023-04-17");
            expect(cancelledDateField).toHaveValue("2023-04-17")
            expect(descriptionField).toHaveValue("");
            expect(notesField).toHaveValue("you will not be approved");

            expect(statusField).toBeDisabled();
            expect(permNumberField).toBeDisabled();
            expect(emailField).toBeDisabled();
            expect(createdDateField).toBeDisabled();
            expect(updatedDateField).toBeDisabled();
            expect(cancelledDateField).toBeDisabled();
            expect(descriptionField).toBeDisabled();
            expect(notesField).toBeDisabled();
            
        });
    });
});
