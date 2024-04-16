import Image from "next/image";
import { HiChevronDown } from "react-icons/hi2";

function UserAvatar({ data }: { data: any }) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={data?.user?.image || "/assets/profile-not-found.jpg"}
        alt="user_profile"
        width={32}
        height={32}
        className="rounded-full border object-contain"
      />
      <p className="text-xs font-semibold md:text-base">{data?.user?.name}</p>
    </div>
  );
}

export default UserAvatar;
