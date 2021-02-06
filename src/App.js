import {CreateFriend} from "./components/CreateFriend.component";
import {CreateName} from "./components/CreateName.component";
import { CreatePanda } from "./components/CreatePanda.component";

function App() {
  return (
    <main className="App">
      <CreateName />
      <hr />
      <CreateFriend />
      <hr />
      <CreatePanda />
    </main>
  );
}

export default App;
