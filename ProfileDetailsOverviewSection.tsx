import { ArrowDownward } from "./ArrowDownward";
import { Device } from "./Device";
import { Device1 } from "./Device1";
import { Device2 } from "./Device2";
import edit2 from "./edit-2.png";
import edit3 from "./edit-3.png";

const personalDetails = [
  { label: "Full name", value: "Megan Russell" },
  { label: "User ID", value: "@megrush21" },
  { label: "Date of Birth", value: "Sep 2, 2002" },
  { label: "Gender", value: "Female" },
  { label: "Nationality", value: "American" },
  { label: "Address", value: "🇺 California - United States" },
  { label: "Phone Number", value: "+82 10-1239-8320" },
  { label: "Email", value: "megrush@example.com" },
];

const accountSecurityDetails = [
  { label: "Password", value: "Change email address" },
  { label: "2-step vertification", value: "@megrush21" },
  { label: "Passkeys", value: "megrush@example.com" },
];

const sessionDevices = [
  {
    id: 1,
    DeviceIcon: "Device",
    name: "Windows Device",
    subLabel: "This device",
    lastActive: "Now",
    location: "KR-28, Korea",
    showLogout: false,
    borderStyle: "border-b border-dashed border-[#d2d2d2]",
  },
  {
    id: 2,
    DeviceIcon: "Device1",
    name: "iPhone",
    subLabel: null,
    lastActive: "21 Feb 2026, 16:40",
    location: "KR-28, Korea",
    showLogout: true,
    borderStyle: "border-b border-dashed border-[#d2d2d2]",
  },
  {
    id: 3,
    DeviceIcon: "Device2",
    name: "macOS",
    subLabel: null,
    lastActive: "12 May 2024, 22:21",
    location: "KR-28, Korea",
    showLogout: true,
    borderStyle: "border-b border-solid border-[#d2d2d2]",
  },
];

export const ProfileDetailsOverviewSection = (): JSX.Element => {
  return (
    <div className="flex flex-col w-[1086px] px-0 py-4 mr-[-25.00px] bg-white rounded-2xl border border-solid border-[#d2d2d2] overflow-y-scroll relative items-start">
      <div className="flex flex-col items-start justify-center gap-2.5 px-8 py-4 relative self-stretch w-full flex-[0_0_auto]">
        <div className="w-fit mt-[-1.00px] [font-family:'Pretendard-Bold',Helvetica] font-bold text-[#2c3436] text-[32px] tracking-[0] leading-[normal] whitespace-nowrap relative flex items-center">
          Profile
        </div>
      </div>

      <div className="inline-flex flex-col gap-9 px-8 py-4 flex-[0_0_auto] bg-white relative items-start">
        {/* Personal Details Section */}
        <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] rounded-2xl border border-solid border-[#d2d2d2]">
          <div className="w-[1018px] justify-between p-4 flex-[0_0_auto] border-b border-solid border-[#d2d2d2] relative flex items-center">
            <div className="flex w-[184px] items-center gap-2.5 relative">
              <div className="w-fit mt-[-1.00px] [font-family:'Pretendard-Bold',Helvetica] font-bold text-[#2c3436] text-lg tracking-[0] leading-[normal] whitespace-nowrap relative flex items-center">
                Personal details
              </div>
            </div>
            <button className="all-[unset] box-border inline-flex items-center justify-center gap-1 px-2.5 py-2 relative flex-[0_0_auto] bg-[#f7f7f7] rounded-lg border border-solid border-[#d2d2d2]">
              <img
                className="relative w-5 h-5 aspect-[1]"
                alt="Edit"
                src={edit2}
              />
              <div className="relative flex items-center w-fit mt-[-0.50px] [font-family:'Pretendard-SemiBold',Helvetica] font-semibold text-[#2c3436] text-base tracking-[0] leading-[normal] whitespace-nowrap">
                Edit
              </div>
            </button>
          </div>

          {personalDetails.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-6 p-4 relative self-stretch w-full flex-[0_0_auto] ${
                index < personalDetails.length - 1
                  ? "border-b border-dashed border-[#d2d2d2]"
                  : ""
              }`}
            >
              <div className="flex w-[180px] items-center gap-2.5 relative">
                <div className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#596063] text-lg tracking-[0] leading-[normal] whitespace-nowrap">
                  {item.label}
                </div>
              </div>
              <div className="flex w-[184px] items-center gap-2.5 relative">
                <div className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#2c3436] text-lg tracking-[0] leading-[normal] whitespace-nowrap">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Account Security Section */}
        <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] rounded-2xl border border-solid border-[#d2d2d2]">
          <div className="w-[1018px] justify-between p-4 flex-[0_0_auto] border-b border-solid border-[#d2d2d2] relative flex items-center">
            <div className="flex w-[184px] items-center gap-2.5 relative">
              <div className="w-fit mt-[-1.00px] [font-family:'Pretendard-Bold',Helvetica] font-bold text-[#2c3436] text-lg tracking-[0] leading-[normal] whitespace-nowrap relative flex items-center">
                Account security
              </div>
            </div>
            <button className="all-[unset] box-border inline-flex items-center justify-center gap-1 px-2.5 py-2 relative flex-[0_0_auto] bg-[#f7f7f7] rounded-lg border border-solid border-[#d2d2d2]">
              <img
                className="relative w-5 h-5 aspect-[1]"
                alt="Edit"
                src={edit3}
              />
              <div className="relative flex items-center w-fit mt-[-0.50px] [font-family:'Pretendard-SemiBold',Helvetica] font-semibold text-[#2c3436] text-base tracking-[0] leading-[normal] whitespace-nowrap">
                Edit
              </div>
            </button>
          </div>

          {accountSecurityDetails.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-6 p-4 relative self-stretch w-full flex-[0_0_auto] ${
                index < accountSecurityDetails.length - 1
                  ? "border-b border-dashed border-[#d2d2d2]"
                  : ""
              }`}
            >
              <div className="flex w-[180px] items-center gap-2.5 relative">
                <div className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#596063] text-lg tracking-[0] leading-[normal] whitespace-nowrap">
                  {item.label}
                </div>
              </div>
              <div className="flex w-[184px] items-center gap-2.5 relative">
                <div className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#2c3436] text-lg tracking-[0] leading-[normal] whitespace-nowrap">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sessions Section */}
        <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] rounded-2xl border border-solid border-[#d2d2d2]">
          <div className="w-[1018px] justify-between p-4 flex-[0_0_auto] border-b border-solid border-[#d2d2d2] relative flex items-center">
            <div className="flex w-[184px] items-center gap-2.5 relative">
              <div className="w-fit mt-[-1.00px] [font-family:'Pretendard-Bold',Helvetica] font-bold text-[#2c3436] text-lg tracking-[0] leading-[normal] whitespace-nowrap relative flex items-center">
                Sessions
              </div>
            </div>
            <div className="inline-flex items-center justify-center gap-1 px-2.5 py-2 relative flex-[0_0_auto] bg-[#f7f7f7] rounded-lg border border-solid border-[#d2d2d2]">
              <p className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Pretendard-SemiBold',Helvetica] font-semibold text-[#2c3436] text-base tracking-[0] leading-[normal] whitespace-nowrap">
                Log out of all devices
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
              {/* Table Header */}
              <div className="flex items-center justify-between px-4 py-2 relative self-stretch w-full flex-[0_0_auto] border-t border-solid border-b border-[#d2d2d2]">
                <div className="flex w-[184px] items-center gap-2 relative">
                  <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                    <div className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#596063] text-base tracking-[0] leading-[normal] whitespace-nowrap">
                      Device Name
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center justify-center gap-2 px-2 py-0 relative flex-[0_0_auto]">
                  <div className="relative flex items-center w-[169px] mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#596063] text-base tracking-[0] leading-[normal]">
                    Last Active
                  </div>
                </div>
                <div className="inline-flex items-center justify-center gap-2 px-2 py-0 relative flex-[0_0_auto]">
                  <div className="relative flex items-center w-[170px] mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#596063] text-base tracking-[0] leading-[normal]">
                    Location
                  </div>
                </div>
                <div className="inline-flex flex-col items-start gap-2.5 px-2 py-0 relative flex-[0_0_auto]" />
              </div>

              {/* Device Rows */}
              {sessionDevices.map((device) => (
                <div
                  key={device.id}
                  className={`flex items-center justify-between p-4 relative self-stretch w-full flex-[0_0_auto] ${device.borderStyle}`}
                >
                  <div className="flex w-[184px] items-center gap-2 relative">
                    {device.DeviceIcon === "Device" && (
                      <Device className="!relative !w-6 !h-6" />
                    )}
                    {device.DeviceIcon === "Device1" && (
                      <Device1 className="!relative !w-6 !h-6" />
                    )}
                    {device.DeviceIcon === "Device2" && (
                      <Device2 className="!relative !w-6 !h-6" />
                    )}
                    <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                      <div className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#2c3436] text-base tracking-[0] leading-[normal] whitespace-nowrap">
                        {device.name}
                      </div>
                      {device.subLabel && (
                        <div className="relative flex items-center self-stretch [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#668369] text-sm tracking-[0] leading-[normal]">
                          {device.subLabel}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="inline-flex items-center justify-center gap-2 px-2 py-0 relative flex-[0_0_auto]">
                    <div className="relative flex items-center w-[169px] mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#596063] text-base tracking-[0] leading-[normal]">
                      {device.lastActive}
                    </div>
                  </div>

                  <div className="inline-flex items-center justify-center gap-2 px-2 py-0 relative flex-[0_0_auto]">
                    <div className="relative flex items-center w-[170px] mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#596063] text-base tracking-[0] leading-[normal]">
                      {device.location}
                    </div>
                  </div>

                  <div className="inline-flex flex-col items-start gap-2.5 px-2 py-0 relative flex-[0_0_auto]">
                    {device.showLogout && (
                      <div className="flex items-center justify-center p-2 self-stretch w-full rounded border border-solid border-[#d2d2d2] relative flex-[0_0_auto]">
                        <div className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#596063] text-base tracking-[0] leading-[normal] whitespace-nowrap">
                          Log out
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Load More Row */}
              <div className="flex items-center justify-between px-4 py-2 relative self-stretch w-full flex-[0_0_auto]">
                <div className="flex w-[184px] items-center gap-2 relative">
                  <ArrowDownward className="!relative !w-6 !h-6 !aspect-[1]" />
                  <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                    <div className="relative flex items-center w-fit mt-[-1.00px] [font-family:'Pretendard-Regular',Helvetica] font-normal text-[#596063] text-base tracking-[0] leading-[normal] whitespace-nowrap">
                      Load 8 more devices
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center justify-center gap-2 px-2 py-0 relative flex-[0_0_auto]" />
                <div className="inline-flex items-center justify-center gap-2 px-2 py-0 relative flex-[0_0_auto]" />
                <div className="inline-flex flex-col items-start gap-2.5 px-2 py-0 relative flex-[0_0_auto]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
