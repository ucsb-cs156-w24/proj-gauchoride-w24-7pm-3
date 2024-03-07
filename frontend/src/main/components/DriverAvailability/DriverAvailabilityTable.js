import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { Link } from "react-router-dom";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/shiftUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function DriverAvailabilityTable({
    driverAvailability,
    currentUser,
    testIdPrefix = "DriverAvailabilityTable" }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/driverAvailability/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/driverAvailability/admin/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Driver Id',
            accessor: 'driverId',
            Cell: ({ value }) => (
                // Stryker disable next-line all : hard to set up test
                <Link to={`/driverInfo/${value}`}>{value}</Link>
              ),
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

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
    } 

    return <OurTable
        data={driverAvailability}
        columns={columns}
        testid={testIdPrefix}
    />;
};

