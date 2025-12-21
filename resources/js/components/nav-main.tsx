import { Link, usePage } from "@inertiajs/react";
import { type SharedData } from "@/types";

export default function NavMain() {
    const page = usePage<SharedData>();

    // 🛡️ HARD GUARD (INI PENTING)
    const auth = page.props.auth ?? { user: null };
    const user = auth.user;

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-500 dark:border-gray-600">

            {/* TOP PROMO BAR */}
            <div className="bg-gray-100 text-[13px] border-b border-gray-200 px-4 dark:bg-gray-500 dark:border-gray-600">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-gray-600 dark:text-gray-300">

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
                        <span className="hover:font-bold">belanja di aplikasi</span>

                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>

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
                    <div className="flex items-center gap-4">

                        {/* Cart */}
                        <Link href="/cart" className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                            <span className="absolute -right-2 -top-1 bg-[rgb(249,77,99)] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                3
                            </span>
                        </Link>

                        {/* Divider */}
                        <div className="h-6 w-[1px] bg-gray-300"></div>

                        {/* AUTH */}
                        {auth.user ? (
                            <Link
                                href="/dashboard"
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:border-gray-400 dark:border-[#3E3E3A] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="rounded-md border border-green-600 px-3 py-1 font-semibold text-sm text-green-600 hover:bg-green-100"
                                >
                                    Masuk
                                </Link>

                                <Link
                                    href="/register"
                                    className="rounded-md bg-green-600 px-3 py-1 font-semibold text-sm text-white hover:bg-green-600"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
