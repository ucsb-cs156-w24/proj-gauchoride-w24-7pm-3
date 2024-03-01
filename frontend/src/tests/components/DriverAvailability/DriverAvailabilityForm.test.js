import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import DriverAvailabilityForm from "main/components/DriverAvailability/DriverAvailabilityForm";
import { driverAvailabilityFixtures } from "fixtures/driverAvailabilityFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("DriverAvailabilityForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Driver Id", "Day of the Week", "Start Time", "End Time", "Notes"];
    const testId = "DriverAvailabilityForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Enter Info/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
          });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm initialContents={driverAvailabilityFixtures.oneAvailability} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Enter Info/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Application Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Enter Info/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Enter Info/);
        fireEvent.click(submitButton);

        await screen.findByText(/Day of the Week is required./);
        expect(screen.getByText(/Start Time is required./)).toBeInTheDocument();
        expect(screen.getByText(/End Time is required./)).toBeInTheDocument();
        expect(screen.getByText(/Notes are required./)).toBeInTheDocument();

        const startTimeField = screen.getByTestId("DriverAvailabilityForm-startTime");
        const endTimeField = screen.getByTestId("DriverAvailabilityForm-endTime");

        fireEvent.change(endTimeField, { target: { value: "badstring" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Enter a day in the form of HH:MM(A/P)M (Ex. 1:37AM).")).toBeInTheDocument();
        });
        expect(screen.queryByText(/End Time is required./)).not.toBeInTheDocument();

        fireEvent.change(endTimeField, { target: { value: "3:00AM" } });
        fireEvent.change(startTimeField, { target: { value: "badstring" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("Enter a day in the form of HH:MM(A/P)M (Ex. 1:37AM).")).toBeInTheDocument();
        });
        expect(screen.queryByText(/Start Time is required./)).not.toBeInTheDocument();
    });

});