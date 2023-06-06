import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Settings from "./pages/Settings";

function App() {
  return (
      <BrowserRouter>
          <div className="App">
              <Routes>
                  <Route exact path={'/'} element={<Quiz/>}/>
                  <Route path={'/results'} element={<Results/>}/>
                  <Route path={'/settings'} element={<Settings/>}/>
              </Routes>
          </div>
      </BrowserRouter>
  );
}

export default App;