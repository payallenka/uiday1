import styles from "../style";
import { logo } from "../assets";
import { footerLinks, socialMedia } from "../constants";
import Button from "./Button";

const Footer = () => (
  <section className={`bg-neutral-900 ${styles.flexCenter} ${styles.paddingY} flex-col`}>

    <div className="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-neutral-700">
      <p className="font-poppins font-normal text-center text-[18px] leading-[27px] text-white">
        Copyright Ⓒ 2022 HooBank. All Rights Reserved.
      </p>
      <div className="flex flex-row md:mt-0 mt-6">
        {socialMedia.map((social, index) => (
          <img
            key={social.id}
            src={social.icon}
            alt={social.id}
            className={`w-[21px] h-[21px] object-contain cursor-pointer transition-all duration-300 ease-in-out hover:transform hover:translate-y-[-2px] hover:scale-110 hover:drop-shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-green-800 hover:rounded-full p-1 ${
              index !== socialMedia.length - 1 ? "mr-6" : "mr-0"
            }`}
            onClick={() => window.open(social.link)}
          />
        ))}
      </div>
    </div>
  </section>
);

export default Footer;
