import { SecureWrap } from "./common/SecureWrap.component";
import { CreateFriend } from "./components/CreateFriend.component";
import { CreateName } from "./components/CreateName.component";
import { CreatePanda } from "./components/CreatePanda.component";
import { permission4 } from "./constants/permissions";

function App() {
  return (
    <main className="App">
      <div>
        <h1>Let's make a User!</h1>
        <CreateName />
      </div>
      <div>
        <h1>Let's make a BFF!</h1>
        <CreateFriend />
      </div>
      <div>
        <h1>Let's make a Panda!</h1>
        <CreatePanda />
      </div>
      <div>
        <h1>Let's make a Secret Agent Panda!</h1>
        <SecureWrap permission={permission4}>
          <CreatePanda />
        </SecureWrap>
      </div>
    </main>
  );
}

export default App;
