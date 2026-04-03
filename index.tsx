import { AccountNavigationMenuSection } from "./AccountNavigationMenuSection";
import { ProfileDetailsOverviewSection } from "./ProfileDetailsOverviewSection";
import { UserHeaderNavSection } from "./UserHeaderNavSection";

export const AccountMe = (): JSX.Element => {
  return (
    <div className="w-[1440px] h-[1431px] flex flex-col gap-2 bg-[#f7f7f7]">
      <UserHeaderNavSection />
      <div className="flex -ml-6 h-[1332px] w-[1416px] self-center px-8 py-4 overflow-y-scroll relative items-start">
        <AccountNavigationMenuSection />
        <ProfileDetailsOverviewSection />
      </div>
    </div>
  );
};
