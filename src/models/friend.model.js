import { randomString } from "../utils/general";
import { emptyName } from "./name.model";

export const emptyFriend = () => ({
  id: randomString(),
  name: emptyName(),
  lengthOfFriendship: "",
});
