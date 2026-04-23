import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Templates from "./pages/Templates";

interface AppProps {
  url: string;
}

export default function App({ url }: AppProps) {
  const pathname = url.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";

  if (pathname === "/how-it-works") return <HowItWorks />;
  if (pathname === "/templates") return <Templates />;
  return <Home />;
}
