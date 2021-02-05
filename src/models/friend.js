import {randomString} from "../utils";
import {emptyName} from "./name";

export const emptyFriend = () => ({
  id: randomString(),
  name: emptyName(),
  lengthOfFriendship: '',
});
