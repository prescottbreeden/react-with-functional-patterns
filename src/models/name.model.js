import { randomString } from "../utils";

export const emptyName = () => ({
  id: randomString(),
  firstName: "",
  lastName: "",
  middleName: "",
});
