import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DriverAvailabilityCreatePage from "main/pages/Drivers/DriverAvailabilityCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("DriverAvailabilityCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /driverAvailability", async () => {

        const queryClient = new QueryClient();
        const availability = {
            id: 1,
            day: "Sunday",
            shiftStart: "11:40AM",
            shiftEnd: "11:59AM",
            driverID: "1",
            notes: "hi"
        };

        axiosMock.onPost("/api/driverAvailability/new").reply(202, availability);

        const {getByTestId} = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DriverAvailabilityCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(getByTestId("DriverAvailabilityForm-driverId")).toBeInTheDocument();
        });

        // Test for Day input
        const dayInput = screen.getByTestId("DriverAvailabilityForm-day");
        expect(dayInput).toBeInTheDocument();

        // Test for Shift Start input
        const shiftStartInput = screen.getByTestId("DriverAvailabilityForm-startTime");
        expect(shiftStartInput).toBeInTheDocument();

        // Test for Shift End input
        const shiftEndInput = screen.getByTestId("DriverAvailabilityForm-endTime");
        expect(shiftEndInput).toBeInTheDocument();

        //Test for Driver Notes
        const driverNotes = screen.getByTestId("DriverAvailabilityForm-notes");
        expect(driverNotes).toBeInTheDocument();

        const submitButton = getByTestId("DriverAvailabilityForm-submit");


        // Simulating filling out the form
        fireEvent.change(dayInput, { target: { value: availability.day } });
        fireEvent.change(shiftStartInput, { target: { value: availability.startTime } });
        fireEvent.change(shiftEndInput, { target: { value: availability.endTime } });
        fireEvent.change(driverNotes, {target: { value: String(availability.notes) } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        // Wait for the axios call to be made
        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        // Asserting that the post request was made with correct parameters
        expect(axiosMock.history.get[0].params).toEqual(availability);

        // Assert that the toast and navigate functions were called with expected values
        expect(mockToast).toBeCalledWith(`New availability - id: ${availability.id}, day: ${availability.day}, shiftStart: ${availability.startTime}, shiftEnd: ${availability.endTime}, driverID: ${availability.driverID}, notes: ${availability.notes}`);
        expect(mockNavigate).toBeCalledWith({ "to": "/driverAvailability" });

    });
});