import OurTable from "main/components/OurTable"


export default function DriverAvailabilityTable({ driverAvailabilities }) {

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Driver Id',
            accessor: 'driverId',
        },
        {
            Header: 'Day',
            accessor: 'day',
        },
        {
            Header: 'Start Time',
            accessor: 'startTime',
        },
        {
            Header: 'End Time',
            accessor: 'endTime',
        },
        {
            Header: 'Notes',
            accessor: 'notes',
        }
    ];

    return <OurTable
        data={driverAvailabilities}
        columns={columns}
        testid={"DriverAvailabilityTable"}
    />;
};