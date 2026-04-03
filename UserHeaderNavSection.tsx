import ellipse2 from "./ellipse-2.svg";
import frame25 from "./frame-25.svg";

export const UserHeaderNavSection = (): JSX.Element => {
  return (
    <header className="flex flex-1 max-h-[99px] relative w-[1440px] h-[99px] items-center justify-between px-10 py-6 bg-[#ffffff1a] backdrop-blur-[6.0px] backdrop-brightness-[100.0%] backdrop-saturate-[105.0%] [-webkit-backdrop-filter:blur(6.0px)_brightness(100.0%)_saturate(105.0%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_4px_rgba(0,0,0,0.19),inset_-1px_0_4px_rgba(0,0,0,0.15)]">
      <div className="inline-flex items-center gap-8 relative flex-[0_0_auto]">
        <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
          <img
            className="relative w-[29px] h-[29px] aspect-[1]"
            alt="Ellipse"
            src={ellipse2}
          />

          <p className="relative flex items-center w-fit [font-family:'JetBrains_Mono-Bold',Helvetica] font-normal text-[#2c3436] text-2xl tracking-[0] leading-6 whitespace-nowrap">
            <span className="font-bold">CA</span>

            <span className="[font-family:'JetBrains_Mono-Regular',Helvetica]">
              BEAN
            </span>
          </p>
        </div>
      </div>

      <img className="relative flex-[0_0_auto]" alt="Frame" src={frame25} />
    </header>
  );
};
