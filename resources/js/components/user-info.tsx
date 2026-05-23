import { Link } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInitials } from "@/hooks/use-initials";
import { type User } from "@/types";

interface UserInfoProps {
    user: User;
    onLogout: () => void;
}

export function UserInfo({ user, onLogout }: UserInfoProps) {
    const getInitials = useInitials();

    return (
        <div className="relative group">
            {/* CLICK → PROFILE */}
            <Link
                href="/user-profile"
                className="flex items-center gap-2.5"
            >
                <Avatar className="h-8 w-8">
                    <AvatarImage
                        src={user.avatar ?? "/images/login-illus.png"}
                        alt={user.name}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>

                <span className="text-sm font-medium truncate max-w-[120px] dark:text-white">
                    {user.name}
                </span>
            </Link>

            {/* DROPDOWN (HOVER) */}
            <div
                className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition dark:bg-[#252523] dark:border-[#3E3E3A]"
            >
                <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#1A1A19] rounded-t-sm dark:text-white"
                >
                    Profil Saya
                </Link>

                <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#1A1A19] dark:text-white"
                >
                    Pesanan
                </Link>

                <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600
                    hover:bg-red-100/30 rounded-b-sm dark:text-red-400 dark:hover:bg-red-900/30"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
