import React from "react";

import { CreateKeyTemplate } from "../components/templates/CreateKey";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateKeyPageProps {}

const CreateKeyPage: React.FC<CreateKeyPageProps> = () => {
  React.useEffect(() => {
    //
  }, []);

  return <CreateKeyTemplate />;
};

export default CreateKeyPage;
