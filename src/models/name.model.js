import { randomString } from "../utils/general";

export const emptyName = () => ({
  id: randomString(),
  firstName: "",
  lastName: "",
  middleName: "",
});
