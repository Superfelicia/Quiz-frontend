import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
      <BrowserRouter>
          <div className="App">
              <Routes>
                  <Route exact path={'/'} element={<Quiz/>}/>
                  <Route path={'/results'} element={<Results/>}/>
              </Routes>
          </div>
      </BrowserRouter>
  );
}

export default App;