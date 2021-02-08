import { SecureWrap } from "./components/SecureWrap.component";
import { CreateFriend } from "./components/CreateFriend.component";
import { CreateName } from "./components/CreateName.component";
import { CreatePanda } from "./components/CreatePanda.component";
import {
  permission1,
  permission2,
  permission3,
  permission4,
} from './constants/permissions';


function App() {
  return (
    <main className="App">
      <SecureWrap permission={permission1}>
        <CreateName />
      </SecureWrap>
      <hr />
      <SecureWrap permission={permission2}>
        <CreateName />
      </SecureWrap>
      <hr />
      <SecureWrap permission={permission3}>
        <CreatePanda />
      </SecureWrap>
      <hr />
      <SecureWrap permission={permission4}>
        <CreateFriend />
      </SecureWrap>
    </main>
  );
}

export default App;
