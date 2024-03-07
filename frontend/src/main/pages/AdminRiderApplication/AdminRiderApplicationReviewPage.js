import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RiderApplicationReviewForm from "main/components/RiderApplication/RiderApplicationReviewForm";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { useCurrentUser } from "main/utils/currentUser";
import { Navigate } from 'react-router-dom'

import { toast } from "react-toastify";


export default function AdminRiderApplicationReviewPage({storybook=false}) {
  let { id } = useParams();
  const { data: currentUser } = useCurrentUser();

  const email = currentUser.root?.user.email;

  const { data: riderApplication, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/riderApplication?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/riderApplication`,
        params: {
          id
        }
      }
    );

    const objectToAxiosPutParams = (riderApplication) => ({
      url: "/api/rider/admin",
      method: "PUT",
      params: {
        id: riderApplication.id,
        status: riderApplication.status,
        notes: riderApplication.notes
      },
      data: { 
        status: riderApplication.status,
        notes: riderApplication.notes
      }
    });
  
    const onSuccess = (riderApplication) => {
      toast(`Application Updated - id: ${riderApplication.id}`);
    }
  
    const mutation = useBackendMutation(
      objectToAxiosPutParams,
      { onSuccess },
      // Stryker disable next-line all : hard to set up test for caching
      [`/api/rider/admin?id=${id}`]
    );
  
    const { isSuccess } = mutation
  
    const onSubmit = async (data) => {
      mutation.mutate(data);
    }
  
    if (isSuccess && !storybook) {
      return <Navigate to="/admin/applications/riders" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Review Rider Application</h1>
                {riderApplication &&
                <RiderApplicationReviewForm initialContents={riderApplication} submitAction={onSubmit} email={email}/>
                }
            </div>
        </BasicLayout>
    )
}