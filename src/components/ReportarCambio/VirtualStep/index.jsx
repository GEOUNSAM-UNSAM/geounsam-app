import samuLaptop from "../../../assets/samu_laptop.png";
import ReporteNotice from "../ReporteNotice";

export default function VirtualStep() {
  return (
    <>
      <ReporteNotice variant="remote" />

      <section className="flex flex-col gap-3 py-3">
        <div className="flex flex-col gap-2">
          <p className="text-body-m text-identity">
            PASA A VIRTUAL
          </p>
          <p className="text-body-s text-neutral-extra-dark">
            Sin ubicación necesaria
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 py-3">
          <div className="relative flex w-full flex-col items-center">
            <div className="flex min-h-[152px] w-full lg:w-3/4 items-center rounded-[20px] border border-action bg-neutral-white p-3">
              <p className="w-full text-center text-title-m text-neutral-extra-dark">
                La clase presencial se cancela y pasa a ser virtual. La
                comunidad puede confirmarlo desde cualquier lugar.
              </p>
            </div>
            <div className="h-0 w-0 border-l-[13px] border-r-[13px] border-t-[24px] border-l-transparent border-r-transparent border-t-action" />
            <div className="-mt-[25px] h-0 w-0 border-l-[12px] border-r-[12px] border-t-[22px] border-l-transparent border-r-transparent border-t-neutral-white" />
          </div>

          <img
            src={samuLaptop}
            alt=""
            className="h-[200px] w-[151px] object-contain"
          />
        </div>
      </section>
    </>
  );
}
