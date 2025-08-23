import React from 'react';
import Button from './Button';
import { RiBankLine, RiShieldLine, RiCustomerService2Line } from '@remixicon/react';

const ContentCards = () => {
  const cards = [
    {
      id: 1,
      title: "Digital Banking",
      description: "Experience the future of banking with our cutting-edge digital platform.",
      icon: <RiBankLine className="opacity-80" size={32} aria-hidden="true" />
    },
    {
      id: 2,
      title: "Secure Payments",
      description: "Make secure transactions with our advanced encryption technology.",
      icon: <RiShieldLine className="opacity-80" size={32} aria-hidden="true" />
    },
    {
      id: 3,
      title: "24/7 Support",
      description: "Get round-the-clock support from our dedicated customer service team.",
      icon: <RiCustomerService2Line className="opacity-80" size={32} aria-hidden="true" />
    }
  ];

  return (
    <section className="py-16 px-4 bg-neutral-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white/10 backdrop-blur-lg border border-neutral-700 rounded-2xl p-8 shadow-xl transition-all duration-300 flex flex-col justify-between h-full
                hover:shadow-2xl hover:bg-gradient-to-r hover:from-green-600 hover:to-green-800 hover:border-green-700 hover:transform hover:translate-y-[-8px] hover:scale-105"
            >
              <div>
                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-2xl mb-6 shadow-lg">
                  <span className="drop-shadow-lg text-white flex items-center justify-center">{card.icon}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">
                  {card.title}
                </h3>
                <p className="text-neutral-50 leading-relaxed mb-6 drop-shadow-md">
                  {card.description}
                </p>
              </div>
              <Button styles="py-4 px-6 font-poppins font-medium text-[18px] text-[#fff] bg-neutral-800 hover:bg-neutral-700 rounded-[10px] outline-none transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg border border-neutral-700 mt-10">Learn More</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentCards;
