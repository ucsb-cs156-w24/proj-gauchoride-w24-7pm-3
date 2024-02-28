import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RiderApplicationForm from "main/components/RiderApplication/RiderApplicationForm";
import { useBackend } from "main/utils/useBackend";


export default function RiderApplicationShowPage() {
  let { id } = useParams();

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

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Rider Application</h1>
                {riderApplication &&
                <RiderApplicationForm initialContents={riderApplication}/>
                }
            </div>
        </BasicLayout>
    )
}