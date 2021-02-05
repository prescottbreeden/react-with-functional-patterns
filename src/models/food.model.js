import {randomString} from "../utils";

export const emptyFood = () => ({
  id: randomString(),
  bambooLeaves: false,
  bambooShoots: false,
  bambooStems: false,
});
