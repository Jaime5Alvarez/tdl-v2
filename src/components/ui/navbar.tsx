import { LogOut } from "lucide-react"
import { Button } from "./button"
import { ThemeToggle } from "./theme-toggle"
import { logout } from "@/app/login/actions"

export function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <a href="/" className="flex items-center space-x-2">
            <span className="font-bold">TDL</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout}
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      </div>
    </nav>
  )
} 