import React from 'react';
// Importamos a imagem que está na pasta assets
import nexusLogo from '../assets/nexus-logo.png'; 

interface LogoProps {
  className?: string;
}

function Logo({ className = "h-10" }: LogoProps) {
  return (
    <img 
      src={nexusLogo} 
      alt="Nexus Logo" 
      // Adicionei 'block' para evitar margens fantasmas que imagens inline têm
      className={`object-contain block ${className}`} 
    />
  );
}

export default Logo;