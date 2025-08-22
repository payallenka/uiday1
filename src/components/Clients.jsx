import { clients } from "../constants";
import styles from "../style";

const Clients = () => (
  <section className={`${styles.flexCenter} my-4`}>
    <div className={`${styles.flexCenter} flex-wrap w-full`}>
      {clients.map((client) => (
        <div key={client.id} className={`flex-1 ${styles.flexCenter} sm:min-w-[192px] min-w-[120px] m-5 transition-all duration-300 ease-in-out hover:transform hover:translateY-[-2px] hover:scale-105 cursor-pointer`}>
          <img src={client.logo} alt="client_logo" className="sm:w-[192px] w-[100px] object-contain hover:drop-shadow-lg transition-all duration-300" />
        </div>
      ))}
    </div>
  </section>
);

export default Clients;
