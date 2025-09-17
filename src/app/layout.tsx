import { Outlet, Link, useLocation } from "react-router-dom"
import { Home, Library, Settings, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { AudioControl } from "@/components/common/AudioControl"
import { Logo } from "@/components/common/Logo"
import { Separator } from "@/components/ui/separator"

export function Layout() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass border-b border-white/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <Logo size="md" className="hover-lift" />
              <span className="font-bold text-xl gradient-text hidden sm:block">
                Quiz Presenter
              </span>
            </Link>

            {/* Navigation - Centered */}
            <nav className="hidden md:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                asChild
                className={isActive("/") ? "gradient-bg text-white hover:opacity-90" : "hover-lift"}
              >
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button
                variant={isActive("/library") ? "default" : "ghost"}
                size="sm"
                asChild
                className={isActive("/library") ? "gradient-bg-cool text-white hover:opacity-90" : "hover-lift"}
              >
                <Link to="/library">
                  <Library className="h-4 w-4 mr-2" />
                  Library
                </Link>
              </Button>
              <Button
                variant={isActive("/editor") ? "default" : "ghost"}
                size="sm"
                asChild
                className={isActive("/editor") ? "gradient-bg-nature text-white hover:opacity-90" : "hover-lift"}
              >
                <Link to="/editor/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create
                </Link>
              </Button>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <AudioControl className="hover-lift" />
              <ThemeToggle className="hover-lift" />
              <Separator orientation="vertical" className="h-6 bg-white/20" />
              <Button
                variant={isActive("/settings") ? "default" : "ghost"}
                size="sm"
                asChild
                className={isActive("/settings") ? "gradient-bg-warm text-white hover:opacity-90" : "hover-lift"}
              >
                <Link to="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <nav className="flex items-center justify-center space-x-1">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                asChild
                className={isActive("/") ? "gradient-bg text-white" : ""}
              >
                <Link to="/">
                  <Home className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant={isActive("/library") ? "default" : "ghost"}
                size="sm"
                asChild
                className={isActive("/library") ? "gradient-bg-cool text-white" : ""}
              >
                <Link to="/library">
                  <Library className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant={isActive("/editor") ? "default" : "ghost"}
                size="sm"
                asChild
                className={isActive("/editor") ? "gradient-bg-nature text-white" : ""}
              >
                <Link to="/editor/new">
                  <PlusCircle className="h-4 w-4" />
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
