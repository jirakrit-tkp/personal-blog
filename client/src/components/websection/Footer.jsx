import { LinkedinIcon, Github, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  Footer.displayName = "Footer";

  return (
    <footer className="bg-neutral-100">
      <div className="bg-neutral-200 px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left side - Flex container with "Get in touch" and social icons */}
          <div className="flex items-center space-x-6">
            {/* Left-left - "Get in touch" text */}
            <div className="text-neutral-800 font-medium text-sm">
              Get in touch
            </div>
            
            {/* Left-right - Social media icons */}
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="text-neutral-800 hover:text-neutral-600 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={10} />
              </a>
              <a 
                href="#" 
                className="text-neutral-800 hover:text-neutral-600 transition-colors"
                aria-label="GitHub"
              >
                <Github size={10} />
              </a>
              <a 
                href="mailto:contact@example.com" 
                className="text-neutral-800 hover:text-neutral-600 transition-colors"
                aria-label="Email"
              >
                <Mail size={10} />
              </a>
            </div>
          </div>
          
          {/* Right side - "Home page" link */}
          <div>
            <Link 
              to={"/"}
              className="text-neutral-800 underline hover:text-neutral-600 transition-colors text-sm"
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
