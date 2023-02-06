import type { NextPage } from "next/types";
import { api } from "../../utils/api";

type propsType = {
  userId: string;
  type: string;
  relationTo: string | null;
};
const SetType: NextPage<propsType> = (props) => {
  if (props.relationTo != null) {
    const nameTable = api.portfolio.tables.getTable.useQuery({
      page: props.userId,
      id: props.relationTo,
    });
    if (
      nameTable.isSuccess &&
      nameTable.data[0] != undefined &&
      nameTable.data != undefined
    ) {
      const data = nameTable.data[0];
      return <>{props.type == "many" ? data.name + "[ ]" : data.name}</>;
    }
  }
  return <>{props.type}</>;
};
export default SetType;
