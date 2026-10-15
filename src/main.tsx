import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "scroll-to-future/style.css";
import App from "./App";
import "./css/index.css";
import "./css/inputs.scss";
import { store } from "./store/redux/store";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>,
);
