import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import RiderApplicationForm from "main/components/RiderApplication/RiderApplicationForm";
import { riderApplicationFixtures } from "fixtures/riderApplicationFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));



describe("RiderApplicationForm when editing tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Email", "Perm Number", "Description"];
    const testId = "RiderApplicationForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RiderApplicationForm submitAction={() => {}}/>
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Apply/)).toBeInTheDocument();

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

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RiderApplicationForm initialContents={riderApplicationFixtures.oneRiderApplication} submitAction={() => {}}/>
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Apply/)).toBeInTheDocument();


        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByText(/Status/)).toBeInTheDocument();
        expect(screen.getByText(/Date Applied/)).toBeInTheDocument();
        expect(screen.getByText(/Date Updated/)).toBeInTheDocument();
        expect(screen.getByText(/Date Cancelled/)).toBeInTheDocument();
        expect(screen.getByText(/Notes/)).toBeInTheDocument();


    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <RiderApplicationForm submitAction={() => {}}/>
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
                    <RiderApplicationForm submitAction={() => {}} />
                </Router>
            </QueryClientProvider>
        );

        // required text input

        const submitButton = screen.getByTestId(`${testId}-submit`);
        fireEvent.click(submitButton);

        await screen.findByText(/Perm Number is required./);
        expect(screen.getByText(/Perm Number is required./)).toBeInTheDocument();

        await screen.findByText(/Description is required./);
        expect(screen.getByText(/Description is required./)).toBeInTheDocument();

        // exactly 7 char for perm
        const permInput = screen.getByTestId(`${testId}-perm_number`);
        fireEvent.change(permInput, { target: { value: "a".repeat(256) } });
        fireEvent.click(submitButton);
        await screen.findByText(/Perm Number must be exactly 7 characters long./);
        expect(screen.getByText(/Perm Number must be exactly 7 characters long./)).toBeInTheDocument();


    })

});
