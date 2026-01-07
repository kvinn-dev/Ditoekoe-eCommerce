import { Link, usePage } from "@inertiajs/react";
import { type SharedData } from "@/types";
import { useEffect, useState } from "react";
import { Bell, Mail } from "lucide-react";
import { UserInfo } from "@/components/user-info";
import NotificationDropdown from "@/components/notification-dropdown";
import CartDropdown from "@/components/cart-dropdown";

export default function NavMain() {
    const page = usePage<SharedData>();
    const auth = page.props.auth ?? { user: null };
    const user = auth.user;

    // State untuk CSRF token
    const [csrfToken, setCsrfToken] = useState<string>("");

    useEffect(() => {
        const fetchCsrf = async () => {
            try {
                const res = await fetch("/csrf-token", { credentials: "include" });
                const data = await res.json();
                setCsrfToken(data.csrfToken);
            } catch (err) {
                console.error("Gagal ambil CSRF token", err);
            }
        };
        fetchCsrf();
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch("/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                credentials: "include",
            });

            if (res.ok) {
                window.location.reload();
            } else {
                console.error("Logout gagal");
            }
        } catch (err) {
            console.error("Logout error", err);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-500 dark:border-gray-600">

            {/* TOP PROMO BAR */}
            <div className="bg-gray-100 text-[13px] border-b border-gray-200 px-4 dark:bg-gray-500 dark:border-gray-600">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-gray-600 dark:text-gray-300">

                    <div className="relative group inline-block">
                        {/* TEXT / TRIGGER */}
                        <Link
                            href="/promo-aplikasi"
                            className="flex items-center gap-1 py-1 text-gray-900"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5A2.25 2.25 0 0 0 8.25 22.5h7.5A2.25 2.25 0 0 0 18 20.25V3.75A2.25 2.25 0 0 0 15.75 1.5H13.5m-3 0V3h3V1.5"
                                />
                            </svg>

                            <span className="font-bold">Gratis Ongkir + Banyak Promo</span>
                            <span className="text-gray-900 group-hover:font-bold">
                                belanja di aplikasi
                            </span>

                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>

                        {/* POPUP */}
                        <div
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border rounded-sm shadow-lg p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <p className="text-xs text-center text-gray-900 mb-1">
                                Scan QR ini untuk download aplikasi dan dapatkan promonya!
                            </p>

                            <div className="flex justify-center mb-1">
                                <img
                                    src="/images/nav/qr-apk.webp"
                                    alt="QR Download App"
                                    className="w-36 h-36"
                                />
                            </div>

                            <p className="text-xs text-center text-gray-500 mb-2">
                                atau klik tombol di bawah:
                            </p>

                            <div className="grid grid-cols-2 gap-2">
                                {/* BARIS ATAS */}
                                <img
                                    src="/images/nav/google-play.svg"
                                    className="h-10 object-contain justify-self-center"
                                    alt="Google Play"
                                />
                                <img
                                    src="/images/nav/app-store.svg"
                                    className="h-10 object-contain justify-self-center"
                                    alt="App Store"
                                />

                                {/* BARIS BAWAH - TENGAH */}
                                <img
                                    src="/images/nav/app-gallery.svg"
                                    className="h-8 object-contain col-span-2 justify-self-center"
                                    alt="App Gallery"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {["Tentang Ditoekoe", "Mulai Berjualan", "Promo", "Ditoekoe Care"].map((item) => (
                            <Link
                                key={item}
                                href="/"
                                className="hover:text-green-600"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-2 bg-white">
                <div className="flex items-center justify-between gap-6">

                    {/* LOGO */}
                    <Link href="/" className="text-2xl font-bold text-green-600">
                        Ditoekoe
                    </Link>

                    {/* SEARCH BAR */}
                    <div className="flex-1 hidden md:flex">
                        <div className="w-full relative">
                            <input
                                type="text"
                                placeholder="Cari di Ditoekoe"
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm shadow-xs outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 dark:border-green-600 dark:bg-green-700 dark:text-gray-200"
                            />

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center">

                        {/* ICON GROUP */}
                        <div className="flex items-center gap-1">
                            {/* CART */}
                            <CartDropdown />

                            {auth.user && (
                                <>
                                    {/* NOTIF */}
                                    <NotificationDropdown />

                                    {/* INBOX */}
                                    <Link
                                        href="/user-profile"
                                        data={{
                                            section: "inbox",
                                            tab: "Chat",
                                        }}
                                        className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100/70 cursor-pointer"
                                    >
                                        <Mail className="w-5 h-5 text-gray-700" />
                                    </Link>

                                </>
                            )}
                        </div>

                        {/* AUTH AREA */}
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <>
                                    {/* DIVIDER */}
                                    <div className="mx-4 mr-4 h-6 w-px bg-gray-300" />

                                    {/* USER PROFILE */}
                                    <UserInfo
                                        user={auth.user}
                                        onLogout={handleLogout}
                                    />
                                </>
                            ) : (
                                <>
                                    {/* DIVIDER */}
                                    <div className="mx-4 h-6 w-px bg-gray-300" />

                                    {/* MASUK */}
                                    <Link
                                        href="/login"
                                        className="rounded-md border border-green-600 px-3 py-1 font-semibold text-sm text-green-600 hover:bg-green-100"
                                    >
                                        Masuk
                                    </Link>

                                    {/* DAFTAR */}
                                    <Link
                                        href="/register"
                                        className="rounded-md bg-green-600 px-3 py-1 font-semibold text-sm text-white hover:bg-green-700"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </header >
    );
}
