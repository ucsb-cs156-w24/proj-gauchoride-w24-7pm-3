import { render } from "@testing-library/react";
import {driverAvailabilityFixtures} from "fixtures/driverAvailabilityFixtures";
import DriverAvailabilityTable from "main/components/DriverAvailability/DriverAvailabilityTable";
import { QueryClient, QueryClientProvider } from "react-query";


describe("DriverAvailabilityTable tests", () => {
    const queryClient = new QueryClient();

    test("renders without crashing for empty table", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <DriverAvailabilityTable driverAvailabilities={[]} />
            </QueryClientProvider>
        );
    });

    test("renders without crashing for three shifts", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <DriverAvailabilityTable driverAvailabilities={driverAvailabilityFixtures.threeAvailabilities} />
            </QueryClientProvider>
        );
    });

    test("Has the expected column headers and content", () => {
        const { getByText, getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <DriverAvailabilityTable driverAvailabilities={driverAvailabilityFixtures.threeAvailabilities}/>
            </QueryClientProvider>
        );
    
        const expectedHeaders = ["id", "Driver Id", "Day", "Start Time", "End Time", "Notes"];
        const expectedFields = ["id", "driverId", "day", "startTime", "endTime", "notes"];
        const testId = "DriverAvailabilityTable";

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


        // expect(getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        // expect(getByTestId(`${testId}-cell-row-1-col-Name`)).toHaveTextContent("gName2 fName2");
        // expect(getByTestId(`${testId}-cell-row-1-col-email`)).toHaveTextContent("generic2@gmail.com");
        // expect(getByTestId(`${testId}-cell-row-1-col-cellPhone`)).toHaveTextContent("222-222-2222");
      });
});
