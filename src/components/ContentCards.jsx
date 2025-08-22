import React from 'react';

const ContentCards = () => {
  const cards = [
    {
      id: 1,
      title: "Digital Banking",
      description: "Experience the future of banking with our cutting-edge digital platform.",
      icon: "💳"
    },
    {
      id: 2,
      title: "Secure Payments",
      description: "Make secure transactions with our advanced encryption technology.",
      icon: "🔒"
    },
    {
      id: 3,
      title: "24/7 Support",
      description: "Get round-the-clock support from our dedicated customer service team.",
      icon: "🎧"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-green-200 to-green-400 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">
          Our Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800 transition-all duration-300 hover:transform hover:translateY-[-8px] hover:scale-105 hover:border-green-900"
            >
              <div className="w-16 h-16 rounded-full bg-transparent flex items-center justify-center text-2xl mb-6 shadow-lg">
                <span className="drop-shadow-lg text-white">{card.icon}</span>
              </div>
              
              <h3 className="text-2xl font-semibold mb-4 text-white drop-shadow-md">
                {card.title}
              </h3>
              
              <p className="text-white/90 leading-relaxed mb-6 drop-shadow-md">
                {card.description}
              </p>
              
              <button className="w-full py-3 px-6 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-lg font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800 hover:shadow-lg hover:scale-105 hover:border-green-900">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentCards;