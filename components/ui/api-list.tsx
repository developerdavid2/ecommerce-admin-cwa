import React from "react";
import ApiAlert from "@/components/ui/api-alert";
import { useParams } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";
interface ApiAlertProps {
  entityName: string;
  entityNameId: string;
}

const ApiList: React.FC<ApiAlertProps> = ({ entityName, entityNameId }) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/stores/${params.storeId}`;
  return (
    <>
      <ApiAlert
        title="GET"
        description={`${baseUrl}/${entityName}`}
        variant="public"
      />
      <ApiAlert
        title="GET"
        description={`${baseUrl}/${entityName}/${entityNameId}`}
        variant="public"
      />
      <ApiAlert
        title="POST"
        description={`${baseUrl}/${entityName}`}
        variant="admin"
      />
      <ApiAlert
        title="PATCH"
        description={`${baseUrl}/${entityName}/${entityNameId}`}
        variant="admin"
      />
      <ApiAlert
        title="DELETE"
        description={`${baseUrl}/${entityName}/${entityNameId}`}
        variant="admin"
      />
    </>
  );
};
export default ApiList;
