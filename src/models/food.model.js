import { randomString } from "../utils/general";

export const emptyFood = () => ({
  id: randomString(),
  bambooLeaves: false,
  bambooShoots: false,
  bambooStems: false,
});
