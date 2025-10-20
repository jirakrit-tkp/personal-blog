import { LinkedinIcon, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  Footer.displayName = "Footer";

  return (
    <footer className="bg-stone-100">
      <div className="bg-stone-200 md:px-30 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          {/* Left side - Flex container with "Get in touch" and social icons */}
          <div className="flex items-center space-x-10">
            {/* Left-left - "Get in touch" text */}
            <div className="text-stone-800 font-medium text-sm">
              Get in touch
            </div>
            
            {/* Left-right - Social media icons */}
            <div className="flex items-center space-x-6">
              <a 
                href="https://www.linkedin.com/in/jirakrit-takerngpon/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-800 hover:text-stone-600 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={15} />
              </a>
              <a 
                href="https://github.com/jirakrit-tkp" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-800 hover:text-stone-600 transition-colors"
                aria-label="GitHub"
              >
                <Github size={15} />
              </a>
              <a 
                href="mailto:jirakrit.tkp@gmail.com" 
                className="text-stone-800 hover:text-stone-600 transition-colors"
                aria-label="Email"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>
          
          {/* Right side - "Home page" link */}
          <div>
            <Link 
              to={"/"}
              className="text-stone-800 font-bold underline hover:text-stone-600 transition-colors text-sm"
            >
              Home page
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
