import { fireEvent, render, waitFor } from "@testing-library/react";
import DriverAvailabilityEditPage from "main/pages/DriverAvailability/DriverAvailabilityEditPage";
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

describe("DriverAvailabilityEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/driverAvailability", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DriverAvailabilityEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Driver Availability");
            expect(queryByTestId("DriverAvailability-day")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/driverAvailability", { params: { id: 17 } }).reply(200, {
                id: 17,
                driverId: 2,
                day: "Tuesday",
                startTime: "5:00PM",
                endTime: "5:50PM",
                notes: "Evening shifts preferred"
            });
            axiosMock.onPut('/api/driverAvailability').reply(200, {
                id: "17",
                driverId: "2",
                day: "Wednesday",
                startTime: "11:00AM",
                endTime: "11:15AM",
                notes: "Brief midday availability"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DriverAvailabilityEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DriverAvailabilityEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("DriverAvailabilityForm-driverId");
            
            const driverIdField = getByTestId("DriverAvailabilityForm-driverId");
            const dayField = getByTestId("DriverAvailabilityForm-day");
            const startTimeField = getByTestId("DriverAvailabilityForm-startTime");
            const endTimeField = getByTestId("DriverAvailabilityForm-endTime");
            const notesField = getByTestId("DriverAvailabilityForm-notes");

            expect(driverIdField).toHaveValue("2");
            expect(dayField).toHaveValue("Tuesday");
            expect(startTimeField).toHaveValue("5:00PM");
            expect(endTimeField).toHaveValue("5:50PM");
            expect(notesField).toHaveValue("Evening shifts preferred");
            
        });

        test("Changes when you click Update", async () => {

                

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DriverAvailabilityEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("DriverAvailabilityForm-driverId");
            
            const driverIdField = getByTestId("DriverAvailabilityForm-driverId");
            const dayField = getByTestId("DriverAvailabilityForm-day");
            const startTimeField = getByTestId("DriverAvailabilityForm-startTime");
            const endTimeField = getByTestId("DriverAvailabilityForm-endTime");
            const notesField = getByTestId("DriverAvailabilityForm-notes");
            const submitButton = getByTestId("DriverAvailabilityForm-submit");

            expect(driverIdField).toHaveValue("2");
            expect(dayField).toHaveValue("Tuesday");
            expect(startTimeField).toHaveValue("5:00PM");
            expect(endTimeField).toHaveValue("5:50PM");
            expect(notesField).toHaveValue("Evening shifts preferred");


            expect(submitButton).toBeInTheDocument();

            fireEvent.change(dayField, { target: { value: 'Monday' } })
            fireEvent.change(startTimeField, { target: { value: '3:30PM' } })
            fireEvent.change(endTimeField, { target: { value: "4:30PM" } })
            fireEvent.change(notesField, { target: { value: "Later midday availability" } })


            fireEvent.click(submitButton);

    
            await waitFor(() => expect(mockToast).toHaveBeenCalled());
            expect(mockToast).toBeCalledWith("Driver Availability Updated - id: 17");
            expect(mockNavigate).toBeCalledWith({ "to": "/driverAvailability/" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                driverId: 2,
                day: "Monday",
                startTime: "3:30PM",
                endTime: "4:30PM", 
                notes: "Later midday availability",
            })); // posted object

        });

       
    });
});
