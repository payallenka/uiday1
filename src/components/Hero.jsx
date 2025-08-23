
import Button from './Button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="flex flex-col items-center justify-center py-24 px-6 text-center gap-6">
      {/* Main Heading */}
      <h1 className="text-6xl md:text-7xl xl:text-[5.25rem] font-medium text-white">
        The Next <span className="text-primary">Generation</span> <br className="sm:block hidden" />
        Payment Method.
      </h1>

      {/* Subheading */}
      <p className="text-lg max-w-xl mt-4 text-neutral-50">
        Our team of experts uses a methodology to identify the credit cards
        most likely to fit your needs. We examine annual percentage rates,
        annual fees.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <Link to="/auth">
          <Button styles="">Get Started</Button>
        </Link>
        
      </div>
    </section>
  );
};

export default Hero;
