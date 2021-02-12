import { randomString } from "../utils/general";
import { emptyFood } from "./food.model";
import { emptyFriend } from "./friend.model";
import { emptyName } from "./name.model";

export const emptyPanda = () => ({
  id: randomString(),
  name: emptyName(),
  food: emptyFood(),
  friends: [emptyFriend()],
});
