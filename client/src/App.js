import { BrowserRouter } from "react-router-dom";
import Router from "./routes/Router";
import { AuthProvider } from "./hooks/context/AuthProvider";
import { Provider } from "react-redux";
import { store } from "./hooks/redux/store";

const App = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </Provider>
    </AuthProvider>
  );
};

export default App;
