import { card } from "../assets";
import styles, { layout } from "../style";
import Button from "./Button";

const CardDeal = () => (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Find a better card deal <br className="sm:block hidden" /> in few easy
        steps.
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Arcu tortor, purus in mattis at sed integer faucibus. Aliquet quis
        aliquet eget mauris tortor.ç Aliquet ultrices ac, ametau.
      </p>

      <Button styles="py-4 px-6 font-poppins font-medium text-[18px] text-[#fff] bg-neutral-800 hover:bg-neutral-700 rounded-[10px] outline-none transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg border border-neutral-700 mt-10">
        Get Started
      </Button>
    </div>

    <div className={layout.sectionImg}>
      <div className="neumorphic-card">
        <img src={card} alt="billing" className="w-[100%] h-[100%] bounce-in delay-300 float-animation" />
      </div>
    </div>
  </section>
);

export default CardDeal;
