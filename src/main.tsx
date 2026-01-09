import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import { initDandleUi } from "./dandle-ui";
import { initHeroVideoInstantPlay } from "./patches/heroVideoInstantPlay";

initDandleUi();
initHeroVideoInstantPlay();

createRoot(document.getElementById("root")!).render(<App />);
