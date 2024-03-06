import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DriverShiftsForm from "main/components/Driver/DriverAvailability/DriverAvailabilityForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function DriverAvailabilityCreatePage({storybook=false}) {

    const objectToAxiosParams = (availability) => ({
        url: "/api/driverAvailability/post", 
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
        ["/api/driverAvailability/all"]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/driverAvailability/" />
    }

    return (
        <BasicLayout>
        <div className="pt-2">
            <h1>Add availability </h1>
            <DriverShiftsForm submitAction={onSubmit} />
        </div>
        </BasicLayout>
    )
}