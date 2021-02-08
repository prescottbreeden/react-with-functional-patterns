import { SecureWrap } from "./common/SecureWrap.component";
import { CreateFriend } from "./components/CreateFriend.component";
import { CreateName } from "./components/CreateName.component";
import { CreatePanda } from "./components/CreatePanda.component";
import {
  permission1,
  permission2,
  permission3,
  permission4,
} from "./constants/permissions";

function App() {
  return (
    <main className="App">
      <h1>Let's make a User!</h1>
      <SecureWrap permission={permission1}>
        <CreateName />
      </SecureWrap>
      <hr />
      <h1>Let's make a BFF!</h1>
      <SecureWrap permission={permission2}>
        <CreateFriend />
      </SecureWrap>
      <hr />
      <h1>Let's make a Panda!</h1>
      <SecureWrap permission={permission3}>
        <CreatePanda />
      </SecureWrap>
      <hr />
      <h1>Let's make a Secret Agent Panda!</h1>
      <SecureWrap permission={permission4}>
        <CreatePanda />
      </SecureWrap>
    </main>
  );
}

export default App;
