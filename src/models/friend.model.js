import {randomString} from "../utils";
import {emptyName} from "./name.model";

export const emptyFriend = () => ({
  id: randomString(),
  name: emptyName(),
  lengthOfFriendship: '',
});
