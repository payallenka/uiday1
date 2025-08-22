import { quotes } from "../assets";

const FeedbackCard = ({ content, name, title, img }) => (
  <div className="flex justify-between flex-col px-10 py-12 rounded-[20px] max-w-[370px] md:mr-10 sm:mr-5 mr-0 my-5 bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800 transition-all duration-300 hover:transform hover:translateY-[-4px] hover:scale-105 hover:border-green-900 shadow-xl hover:shadow-2xl group">
    <img 
      src={quotes} 
      alt="double_quotes" 
      className="w-[42.6px] h-[27.6px] object-contain drop-shadow-lg" 
    />
    <p className="font-poppins font-normal text-[18px] leading-[32.4px] text-white my-10 drop-shadow-md group-hover:text-white">
      {content}
    </p>

    <div className="flex flex-row">
      <img src={img} alt={name} className="w-[48px] h-[48px] rounded-full border-2 border-white/30" />
      <div className="flex flex-col ml-4">
        <h4 className="font-poppins font-semibold text-[20px] leading-[32px] text-white drop-shadow-md group-hover:text-white">
          {name}
        </h4>
        <p className="font-poppins font-normal text-[16px] leading-[24px] text-white/90 drop-shadow-md group-hover:text-white">
          {title}
        </p>
      </div>
    </div>
  </div>
);

export default FeedbackCard;
