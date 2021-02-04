import {emptyFood} from "./food";
import {emptyFriend} from "./friend";
import {emptyName} from "./name";

export const emptyPanda = () => ({
  name: emptyName(),
  food: emptyFood(),
  friend: emptyFriend(),
});
