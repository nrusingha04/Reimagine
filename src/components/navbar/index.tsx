"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const handleSubmit = async () => {
    if (session?.user) {
      await signOut();
    } else {
      await signIn("google");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass border-b border-card-border backdrop-blur-glass"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection("hero")}
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary !bg-clip-text text-transparent">
              REimagine
            </span>
          </motion.div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("features")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Pricing
            </button>
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border overflow-hidden p-0">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                      <AvatarFallback className="bg-primary/20 text-primary">{session.user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-border shadow-glow-subtle animate-fade-in p-2 mt-2 rounded-xl">
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-red-500 focus:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors py-2.5 px-3 font-medium">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="hero"
                className="w-full font-semibold"
                onClick={handleSubmit}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            <button
              onClick={() => scrollToSection("features")}
              className="block w-full text-left text-foreground hover:text-primary transition-colors font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="block w-full text-left text-foreground hover:text-primary transition-colors font-medium"
            >
              Pricing
            </button>
            {session?.user ? (
              <Button variant="outline" className="w-full text-red-500 border-red-500/20 hover:bg-red-500/10" onClick={() => signOut()}>
                Sign Out
              </Button>
            ) : (
              <Button variant="hero" className="w-full" onClick={handleSubmit}>
                Sign In
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
