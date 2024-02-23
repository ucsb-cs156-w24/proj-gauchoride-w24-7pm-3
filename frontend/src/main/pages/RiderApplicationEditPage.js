import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RiderApplicationForm from 'main/components/RiderApplication/RiderApplicationForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RiderApplicationEditPage({ storybook = false }) {
    let { id } = useParams();

    const { data: riderApplication, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/riderApplication?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/riderApplication`,
                params: {
                    id
                }
            }
        );

    const objectToAxiosPutParams = (riderApplication) => ({
        url: "/api/riderApplication",
        method: "PUT",
        params: {
            id: riderApplication.id,
        },
        data: {
            status: riderApplication.status,
            perm_number: riderApplication.perm_number,
            created_date: riderApplication.created_date,
            updated_date: riderApplication.updated_date,
            cancelled_date: riderApplication.cancelled_date,
            description: riderApplication.description,
            notes: riderApplication.notes
        }
    });

    const onSuccess = (riderApplication) => {
        toast(`Rider Application Updated - id: ${riderApplication.id} perm_number: ${riderApplication.perm_number}`);
    };

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/riderApplication?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/apply/rider"/>
    }

    // Stryker disable all : placeholder for future implementation
    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Rider Application</h1>
                {
                    riderApplication && <RiderApplicationForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={riderApplication} />
                }
            </div>
        </BasicLayout>
    )

}