import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import {driverAvailabilityFixtures} from "fixtures/driverAvailabilityFixtures";
import DriverAvailabilityTable from "main/components/DriverAvailability/DriverAvailabilityTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import { currentUserFixtures } from "fixtures/currentUserFixtures";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
  }));

const mockedNavigate = jest.fn();


const expectedHeaders = ["id", "Driver Id", "Day", "Start Time", "End Time", "Notes"];
const expectedFields = ["id", "driverId", "day", "startTime", "endTime", "notes"];
const testId = "DriverAvailabilityTable";

describe("DriverAvailabilityTable tests", () => {
    const queryClient = new QueryClient();

    test("renders without crashing for empty table", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityTable driverAvailability={[]} />
                </Router>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for three driverAvailabilities", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityTable driverAvailability={driverAvailabilityFixtures.threeAvailabilities} />
                </Router>
            </QueryClientProvider>
        );
    });

    test("Has the expected column headers and content", () => {
        const { getByText, getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityTable driverAvailability={driverAvailabilityFixtures.threeAvailabilities} />
                </Router>
            </QueryClientProvider>
        );


        expectedHeaders.forEach( (headerText)=> {
            const header = getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach( (field)=> {
          const header = getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument(); 
        });

        expect(getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-0-col-driverId`)).toHaveTextContent("2");
        expect(getByTestId(`${testId}-cell-row-0-col-day`)).toHaveTextContent("Tuesday");
        expect(getByTestId(`${testId}-cell-row-0-col-startTime`)).toHaveTextContent("5:00PM");
        expect(getByTestId(`${testId}-cell-row-0-col-endTime`)).toHaveTextContent("5:50PM");
        expect(getByTestId(`${testId}-cell-row-0-col-notes`)).toHaveTextContent("Evening shifts preferred");
        expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
        expect(getByTestId(`${testId}-cell-row-1-col-driverId`)).toHaveTextContent("3");
        expect(getByTestId(`${testId}-cell-row-1-col-day`)).toHaveTextContent("Wednesday");
        expect(getByTestId(`${testId}-cell-row-1-col-startTime`)).toHaveTextContent("11:00AM");
        expect(getByTestId(`${testId}-cell-row-1-col-endTime`)).toHaveTextContent("11:15AM");
        expect(getByTestId(`${testId}-cell-row-1-col-notes`)).toHaveTextContent("Brief midday availability");

      });


      test("Has the expected column headers, content, and buttons for admin user", () => {
        const currentUser = currentUserFixtures.adminUser;
        
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityTable driverAvailability={driverAvailabilityFixtures.threeAvailabilities} currentUser={currentUser} />
                </Router>
            </QueryClientProvider>
        );
    
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
    
        expectedFields.forEach((field) => {
            const cellContent = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(cellContent).toBeInTheDocument();
        });
    
        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-day`)).toHaveTextContent("Tuesday");
    
        const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass("btn-primary");
    
        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn-danger");
    });
    
    test("Has the expected column headers and content for an ordinary user", () => {
        const currentUser = currentUserFixtures.userOnly;
    
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <DriverAvailabilityTable driverAvailability={driverAvailabilityFixtures.threeAvailabilities} currentUser={currentUser} />
                </Router>
            </QueryClientProvider>
        );
    
        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
    
        expectedFields.forEach((field) => {
            const cellContent = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(cellContent).toBeInTheDocument();
        });
    
        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-day`)).toHaveTextContent("Tuesday");
    
        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });

    test("Delete button calls delete callback", async () => {
        const currentUser = currentUserFixtures.adminUser;
        
        
        // act - render the component
        render(
          <QueryClientProvider client={queryClient}>
            <Router>
              <DriverAvailabilityTable driverAvailability={driverAvailabilityFixtures.threeAvailabilities} currentUser={currentUser} />
            </Router>
          </QueryClientProvider>
        );
      
        // assert - check that the expected content is rendered
        expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-day`)).toHaveTextContent("Tuesday");
      
        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
      
        // act - click the delete button
        fireEvent.click(deleteButton);
      });
    

      test("Edit button triggers navigation", async () => {
        const currentUser = currentUserFixtures.adminUser;
      
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <DriverAvailabilityTable driverAvailability={driverAvailabilityFixtures.threeAvailabilities} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
        );
      
        // assert - check that the expected content is rendered
        expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
        const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
      
        // act - click the edit button
        fireEvent.click(editButton);
      
        // assert - check if the mocked navigate function was called
        expect(mockedNavigate).toHaveBeenCalledWith('/driverAvailability/edit/2');
      });
      
  test("Edit button navigates to the edit page", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DriverAvailabilityTable driverAvailability={driverAvailabilityFixtures.threeAvailabilities} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-day`)).toHaveTextContent("Tuesday");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that we navigated to the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/driverAvailability/edit/2'));
  });

});