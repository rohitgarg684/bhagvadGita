import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ChapterVisibilityProvider } from "./contexts/ChapterVisibilityContext";
import { ImagesProvider } from "./hooks/useImages";
import Home from "./pages/Home";
import ChapterPage from "./pages/ChapterPage";
import VersePage from "./pages/VersePage";
import GamesPage from "./pages/GamesPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={LoginPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/chapter/:chapterNum" component={ChapterPage} />
      <Route path="/chapter/:chapterNum/verse/:verseNum" component={VersePage} />
      <Route path="/chapter/:chapterNum/games" component={GamesPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <ChapterVisibilityProvider>
            <ImagesProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </ImagesProvider>
          </ChapterVisibilityProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
