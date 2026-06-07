"use client";
import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-card-border relative overflow-hidden">
      {/*  Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
        >
          {/* Logo & Description */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold bg-gradient-primary !bg-clip-text text-transparent">
                REimagine
              </span>
            </div>
            <p className="text-muted-foreground mb-6">
              Transform your photos with AI-powered editing tools. Remove
              backgrounds, enhance quality, and create stunning visuals.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>for creators</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Social</h4>
            <ul className="space-y-3">
              <li><a href="https://x.com/nrusingha_exe" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Twitter</a></li>
              <li><a href="https://www.instagram.com/nrusingha.exe/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="https://github.com/nrusingha04" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="https://discord.com/users/1035482527684632606" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Discord</a></li>
            </ul>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="pt-8 border-t border-card-border text-center">
          <p className="text-sm text-muted-foreground text-center">
            © 2026 REimagine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
