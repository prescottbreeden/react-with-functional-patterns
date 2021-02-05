import {randomString} from "../utils";
import {emptyFood} from "./food";
import {emptyFriend} from "./friend";
import {emptyName} from "./name";

export const emptyPanda = () => ({
  id: randomString(),
  name: emptyName(),
  food: emptyFood(),
  friends: [emptyFriend()],
});
