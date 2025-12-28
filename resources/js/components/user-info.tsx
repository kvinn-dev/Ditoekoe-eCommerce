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

                <span className="text-sm font-medium truncate max-w-[120px]">
                    {user.name}
                </span>
            </Link>

            {/* DROPDOWN (HOVER) */}
            <div
                className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition"
            >
                <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 rounded-t-sm"
                >
                    Profil Saya
                </Link>

                <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                    Pesanan
                </Link>

                <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600
                    hover:bg-red-100/30 rounded-b-sm"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
