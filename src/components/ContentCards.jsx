import React from 'react';

const ContentCards = () => {
  const cards = [
    {
      id: 1,
      title: "Digital Banking",
      description: "Experience the future of banking with our cutting-edge digital platform.",
      icon: "💳",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "Secure Payments",
      description: "Make secure transactions with our advanced encryption technology.",
      icon: "🔒",
      gradient: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      title: "24/7 Support",
      description: "Get round-the-clock support from our dedicated customer service team.",
      icon: "🎧",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-green-200 to-green-400 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Our Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.id}
              className="backdrop-blur-lg bg-white/20 border border-white/30 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:translateY-[-8px] hover:scale-105"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${card.gradient} flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                {card.icon}
              </div>
              
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                {card.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                {card.description}
              </p>
              
              <button className="w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg font-semibold transition-all duration-300 hover:from-teal-600 hover:to-teal-700 hover:shadow-lg">
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