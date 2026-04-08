interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "h-12" }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center h-full">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-adslab-cyan/20 blur-xl rounded-full animate-pulse"></div>
        
        {/* Logo Image */}
        <img 
          src="https://i.ibb.co/PzjGmSD5/LOGO-ADS.png" 
          alt="AdsLab Logo" 
          className="relative h-full w-auto object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
