import { AccountCircle } from "./AccountCircle";
import { AccountCircle1 } from "./AccountCircle1";
import { IconComponentNode } from "./IconComponentNode";
import arrowDropDown2 from "./arrow-drop-down-2.png";
import arrowDropDown from "./arrow-drop-down.png";
import creditCard2 from "./credit-card-2.svg";
import creditCard3 from "./credit-card-3.svg";
import creditCard from "./credit-card.svg";
import edit from "./edit.png";
import encrypted2 from "./encrypted-2.svg";
import encrypted3 from "./encrypted-3.svg";
import encrypted from "./encrypted.svg";
import image1 from "./image.png";
import image from "./image.svg";
import notifications2 from "./notifications-2.svg";
import notifications from "./notifications.svg";

const myAccountItems = [
  {
    id: "profile",
    label: "Profile",
    active: true,
    icon: "account-circle",
    iconColor: "#2C3436",
  },
  {
    id: "notification",
    label: "Notification",
    active: false,
    icon: "notifications",
    iconSrc: notifications,
    iconClass: "relative w-[15px] h-[19.19px] aspect-[0.78]",
  },
  {
    id: "preference",
    label: "Preference",
    active: false,
    icon: "icon-component",
  },
  {
    id: "billing",
    label: "Billing & Subscription",
    active: false,
    icon: "credit-card",
    iconSrc: creditCard,
    iconClass: "relative w-[19px] h-[15px] aspect-[1.27]",
  },
  {
    id: "privacy",
    label: "Privacy & Data",
    active: false,
    icon: "encrypted",
    iconSrc: encrypted,
    iconClass: "relative w-[15px] h-[18.94px] aspect-[0.79]",
  },
  {
    id: "connections",
    label: "Connections",
    active: false,
    icon: "account-circle1",
  },
];

const featuresItems = [
  {
    id: "profile",
    label: "Profile",
    icon: "account-circle",
    iconColor: "#596063",
  },
  {
    id: "notification",
    label: "Notification",
    icon: "notifications",
    iconSrc: image,
    iconClass: "relative w-[15px] h-[19.19px] aspect-[0.78]",
  },
  {
    id: "billing",
    label: "Billing & Subscription",
    icon: "credit-card",
    iconSrc: creditCard2,
    iconClass: "relative w-[19px] h-[15px] aspect-[1.27]",
  },
  {
    id: "privacy",
    label: "Privacy & Data",
    icon: "encrypted",
    iconSrc: encrypted2,
    iconClass: "relative w-[15px] h-[18.94px] aspect-[0.79]",
  },
];

const adminItems = [
  {
    id: "profile",
    label: "Profile",
    icon: "account-circle",
    iconColor: "#596063",
  },
  {
    id: "notification",
    label: "Notification",
    icon: "notifications",
    iconSrc: notifications2,
    iconClass: "relative w-[15px] h-[19.19px] aspect-[0.78]",
  },
  {
    id: "billing",
    label: "Billing & Subscription",
    icon: "credit-card",
    iconSrc: creditCard3,
    iconClass: "relative w-[19px] h-[15px] aspect-[1.27]",
  },
  {
    id: "privacy",
    label: "Privacy & Data",
    icon: "encrypted",
    iconSrc: encrypted3,
    iconClass: "relative w-[15px] h-[18.94px] aspect-[0.79]",
  },
];

const renderIcon = (item: any) => {
  if (item.icon === "account-circle") {
    return (
      <AccountCircle
        className="!relative !flex-[0_0_auto]"
        color={item.iconColor || "#596063"}
      />
    );
  }
  if (item.icon === "account-circle1") {
    return <AccountCircle1 className="!relative !flex-[0_0_auto]" />;
  }
  if (item.icon === "icon-component") {
    return <IconComponentNode className="!relative !flex-[0_0_auto]" />;
  }
  return (
    <div className="inline-flex items-center gap-2.5 relative flex-[0_0_auto]">
      <img className={item.iconClass} alt={item.label} src={item.iconSrc} />
    </div>
  );
};

export const AccountNavigationMenuSection = (): JSX.Element => {
  return (
    <div className="inline-flex flex-col items-start justify-center gap-6 p-4 relative flex-[0_0_auto]">
      <div className="inline-flex flex-col items-start justify-center gap-[15px] px-8 py-6 relative flex-[0_0_auto]">
        <div className="relative w-[156px] h-[156px] aspect-[1] bg-[url(/image-2.svg)] bg-cover bg-[50%_50%]" />

        <div className="inline-flex items-start gap-2 px-2 py-0 relative flex-[0_0_auto]">
          <p className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Pretendard-Bold',Helvetica] font-normal text-[#2c3436] text-[32px] tracking-[0] leading-[normal] whitespace-nowrap">
            <span className="font-bold">Meggie </span>
            <span className="[font-family:'Pretendard-Regular',Helvetica]">
              🌱
            </span>
          </p>
          <img className="relative w-5 h-5 aspect-[1]" alt="Edit" src={edit} />
        </div>
      </div>

      <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
        <div className="inline-flex p-1 flex-[0_0_auto] items-center relative">
          <div className="relative flex items-center w-fit [font-family:'Pretendard-Medium',Helvetica] font-medium text-[#596063] text-base tracking-[0] leading-[normal] whitespace-nowrap">
            My Account
          </div>
          <img
            className="relative w-6 h-6 aspect-[1]"
            alt="Arrow drop down"
            src={arrowDropDown}
          />
        </div>

        <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
          {myAccountItems.map((item) => (
            <div
              key={item.id + "-myaccount"}
              className={`flex items-center gap-2 p-4 relative self-stretch w-full flex-[0_0_auto] rounded-lg${item.active ? " bg-[#eaeaea]" : ""}`}
            >
              {renderIcon(item)}
              <div
                className={`flex w-fit ${item.id === "notification" ? "mt-[-0.90px]" : "mt-[-1.00px]"} ${item.id === "profile" && item.active ? "mt-[-2.00px]" : ""} [font-family:'Pretendard-Medium',Helvetica] font-medium ${item.active ? "text-[#2c3436]" : "text-[#596063]"} text-base tracking-[0] leading-[normal] whitespace-nowrap items-center relative`}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
        <div className="inline-flex p-1 flex-[0_0_auto] items-center relative">
          <div className="relative flex items-center w-fit [font-family:'Pretendard-Medium',Helvetica] font-medium text-[#596063] text-base tracking-[0] leading-[normal] whitespace-nowrap">
            Features
          </div>
          <img
            className="relative w-6 h-6 aspect-[1]"
            alt="Arrow drop down"
            src={image1}
          />
        </div>

        <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
          {featuresItems.map((item) => (
            <div
              key={item.id + "-features"}
              className="flex items-center gap-2 p-4 relative self-stretch w-full flex-[0_0_auto] rounded-lg"
            >
              {renderIcon(item)}
              <div
                className={`flex w-fit ${item.id === "notification" ? "mt-[-0.90px]" : item.id === "profile" ? "mt-[-2.00px]" : "mt-[-1.00px]"} [font-family:'Pretendard-Medium',Helvetica] font-medium text-[#596063] text-base tracking-[0] leading-[normal] whitespace-nowrap items-center relative`}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
        <div className="inline-flex p-1 flex-[0_0_auto] items-center relative">
          <div className="relative flex items-center w-fit [font-family:'Pretendard-Medium',Helvetica] font-medium text-[#596063] text-base tracking-[0] leading-[normal] whitespace-nowrap">
            Admin
          </div>
          <img
            className="relative w-6 h-6 aspect-[1]"
            alt="Arrow drop down"
            src={arrowDropDown2}
          />
        </div>

        <div className="flex flex-col items-start gap-2 relative self-stretch w-full flex-[0_0_auto]">
          {adminItems.map((item) => (
            <div
              key={item.id + "-admin"}
              className="flex items-center gap-2 p-4 relative self-stretch w-full flex-[0_0_auto] rounded-lg"
            >
              {renderIcon(item)}
              <div
                className={`flex w-fit ${item.id === "notification" ? "mt-[-0.90px]" : item.id === "profile" ? "mt-[-2.00px]" : "mt-[-1.00px]"} [font-family:'Pretendard-Medium',Helvetica] font-medium text-[#596063] text-base tracking-[0] leading-[normal] whitespace-nowrap items-center relative`}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
