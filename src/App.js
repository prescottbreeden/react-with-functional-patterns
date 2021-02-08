import { AuthWrap } from "./components/AuthWrap.component";
import { CreateFriend } from "./components/CreateFriend.component";
import { CreateName } from "./components/CreateName.component";
import { CreatePanda } from "./components/CreatePanda.component";

function App() {
  return (
    <main className="App">
      <CreateName />
      <hr />
      <AuthWrap authorized={false}>
        <CreateFriend />
      </AuthWrap>
      <hr />
      <CreatePanda />
    </main>
  );
}

export default App;
