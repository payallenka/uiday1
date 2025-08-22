import { features } from "../constants";
import styles, { layout } from "../style";
import Button from "./Button";

const FeatureCard = ({ icon, title, content, index }) => (
  <div className={`flex flex-row p-6 rounded-[20px] ${index !== features.length - 1 ? "mb-6" : "mb-0"} bg-white/20 backdrop-blur-lg border border-white/30 hover:bg-gradient-to-r hover:from-green-700 hover:to-green-800 transition-all duration-300 hover:scale-105 hover:border-green-900 shadow-xl hover:shadow-2xl`}>
    <div className="w-[64px] h-[64px] rounded-full bg-transparent flex items-center justify-center">
      <img src={icon} alt="star" className="w-[50%] h-[50%] object-contain drop-shadow-lg" />
    </div>
    <div className="flex-1 flex flex-col ml-3">
      <h4 className="font-poppins font-semibold text-white text-[18px] leading-[23.4px] mb-1 drop-shadow-md">
        {title}
      </h4>
      <p className="font-poppins font-normal text-white/90 text-[16px] leading-[24px] drop-shadow-md">
        {content}
      </p>
    </div>
  </div>
);

const Business = () =>  (
  <section id="features" className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        You do the business, <br className="sm:block hidden" /> we’ll handle
        the money.
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        With the right credit card, you can improve your financial life by
        building credit, earning rewards and saving money. But with hundreds
        of credit cards on the market.
      </p>

      <Button styles={`mt-10`} />
    </div>

    <div className={`${layout.sectionImg} flex-col`}>
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} {...feature} index={index} />
      ))}
    </div>
  </section>
);

export default Business;
