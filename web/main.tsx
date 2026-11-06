import { createRoot } from "react-dom/client";
import Home from "../app/page";
import "../app/globals.css";

const root = document.getElementById("root");
if (!root) throw new Error("缺少页面挂载节点");
createRoot(root).render(<Home />);
