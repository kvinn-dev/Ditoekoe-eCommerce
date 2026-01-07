import { useRef, useState } from "react";
import { Link } from "@inertiajs/react";

export default function CartDropdown() {
    const [open, setOpen] = useState(false);
    const closeTimer = useRef<number | null>(null);

    const handleMouseEnter = () => {
        if (closeTimer.current) {
            window.clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
        setOpen(true);
    };

    const handleMouseLeave = () => {
        closeTimer.current = window.setTimeout(() => {
            setOpen(false);
        }, 30);
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* CART ICON */}
            <Link href="/cart" className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100/70">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="#374151"
                    className="size-5.5"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                    />
                </svg>
            </Link>

            {/* DROPDOWN */}
            {open && (
                <div className="absolute left-1/2 mt-4 w-[350px] -translate-x-1/2 bg-white border border-gray-200 rounded-b-sm shadow-xl z-50 overflow-hidden">

                    {/* HEADER */}
                    <div className="flex items-center justify-between h-12 px-4 border-b shadow-md">
                        <h3 className="font-semibold text-gray-900 text-sm">
                            Keranjang
                        </h3>
                        <Link
                            href="/cart"
                            className="text-green-600 text-xs font-semibold hover:underline"
                        >
                            Lihat
                        </Link>
                    </div>

                    {/* EMPTY CART */}
                    <div className="px-6 py-2 text-center">
                        <img
                            src="/images/nav/no-cart.webp"
                            alt="Keranjang kosong"
                            className="mx-auto w-36 mb-4"
                        />

                        <h4 className="font-bold text-gray-900 text-base mb-1">
                            Wah, keranjang belanjamu kosong
                        </h4>

                        <p className="text-gray-500 text-[13px] mb-4">
                            Yuk, isi dengan barang-barang impianmu!
                        </p>

                        <Link
                            href="/"
                            className="inline-block border border-green-600 mb-5 text-green-600 font-semibold text-sm px-6 py-1 rounded-sm hover:bg-green-50 transition"
                        >
                            Mulai Belanja
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
