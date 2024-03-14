import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DriverAvailabilityForm from "main/components/DriverAvailability/DriverAvailabilityForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function DriverAvailabilityCreatePage({storybook=false}) {

    const objectToAxiosParams = (availability) => ({
        url: "/api/driverAvailability/new", 
        method: "POST",
        params: { 
            day: availability.day,
            shiftStart: availability.startTime, 
            shiftEnd: availability.endTime,
            driverID: availability.driverID,
            notes: availability.notes
        }
    });

    const onSuccess = (availability) => {
        toast(`New availability -day: ${availability.day}, shiftStart: ${availability.startTime}, shiftEnd: ${availability.endTime}, notes: ${availability.notes}`);
    }
    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/driverAvailability/new"]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/api/driverAvailability" />
    }

    return (
        <BasicLayout>
        <div className="pt-2">
            <h1>Add availability </h1>
            <DriverAvailabilityForm submitAction={onSubmit} />
        </div>
        </BasicLayout>
    )
}