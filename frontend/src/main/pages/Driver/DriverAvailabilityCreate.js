import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DriverShiftsForm from "main/components/Driver/DriverShiftsForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function DriverAvailabilityCreatePage() {

    const objectToAxiosParams = (availability) => ({
        url: "/api/driverAvailability/new",
        method: "POST",
        params: { 
            id: availability.id,
            day: availability.day,
            shiftStart: availability.shiftStart, 
            driverID: availability.driverID,
            driverBackupID: availability.driverBackupID
        }
    });

    const onSuccess = (availability) => {
        toast(`New Driver - id: ${availability.id}, day: ${availability.day}, shiftStart: ${availability.shiftStart}, driverID: ${availability.driverID}, driverBackupID: ${availability.driverBackupID}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/driverAvailability"]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/api/driverAvailability/admin/all" />
    }

    return (
        <BasicLayout>
        <div className="pt-2">
            <h1>Create New Driver </h1>
            <DriverShiftsForm submitAction={onSubmit} />
        </div>
        </BasicLayout>
    )
}