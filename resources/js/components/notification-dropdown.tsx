import { useEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import {
    Clock,
    RefreshCw,
    Truck,
    MapPin,
    Bell,
    Settings,
    Megaphone,
} from "lucide-react";

export default function NotificationDropdown() {
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

    const TABS = [
        'Transaksi',
        'Update',
    ] as const

    type TabKey = typeof TABS[number]

    const [activeTab, setActiveTab] = useState<TabKey>('Transaksi')

    /* TAB UNDERLINE LOGIC */
    const containerRef = useRef<HTMLDivElement | null>(null);
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const [indicator, setIndicator] = useState({
        left: 0,
        width: 0,
    });

    useEffect(() => {
        const activeEl = tabRefs.current[activeTab];
        const containerEl = containerRef.current;

        if (!activeEl || !containerEl) return;

        const activeRect = activeEl.getBoundingClientRect();
        const containerRect = containerEl.getBoundingClientRect();

        setIndicator({
            left: activeRect.left - containerRect.left,
            width: activeRect.width,
        });
    }, [activeTab]);

    const TabTransaksi = () => (
        <div className="relative flex flex-col max-h-[360px]">

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto">

                {/* PEMBELIAN */}
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-[14.5px] text-gray-900 dark:text-white">
                            Pembelian
                        </span>
                        <Link href="#" className="text-green-600 text-[12px]">
                            Lihat Semua
                        </Link>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-center text-[11px] text-gray-700 dark:text-gray-300">
                        <StatusItem icon={<Clock size={16} />} label="Menunggu Konfirmasi" />
                        <StatusItem icon={<RefreshCw size={16} />} label="Pesanan Diproses" />
                        <StatusItem icon={<Truck size={16} />} label="Sedang Dikirim" />
                        <StatusItem icon={<MapPin size={16} />} label="Sampai Tujuan" />
                    </div>
                </div>

                {/* PENJUALAN */}
                <div className="px-4 py-3 border-t dark:border-[#3E3E3A]">
                    <h4 className="font-semibold text-[14.5px] text-gray-900 dark:text-white mb-1">
                        Penjualan
                    </h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 mb-3">
                        Cek pesanan yang masuk dan perkembangan tokomu
                        secara rutin di satu tempat
                    </p>

                    <Link
                        href="#"
                        className="block text-center text-[13px] text-green-600 font-semibold border border-green-600 rounded-sm py-1 hover:bg-green-50 mb-2"
                    >
                        Masuk ke Ditoekoe Seller
                    </Link>
                </div>

                {/* EMPTY STATE */}
                <div className="px-6 py-4 border-t dark:border-[#3E3E3A] text-center">
                    <img
                        src="/images/nav/no-notif.webp"
                        alt="Belum ada notifikasi"
                        className="mx-auto mb-2 w-20"
                    />

                    <h4 className="font-semibold text-[14.5px] text-gray-900 dark:text-white mb-1">
                        Belum ada notifikasi
                    </h4>

                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                        Notifikasi terkait transaksi kamu bakal muncul di sini
                    </p>

                    <Link
                        href="/"
                        className="inline-block bg-green-600 text-white text-[13px] font-semibold px-4 py-1 rounded-sm hover:bg-green-700 transition"
                    >
                        Mulai Belanja
                    </Link>
                </div>
            </div>

            {/* STICKY FOOTER */}
            <div className="sticky bottom-0 bg-white dark:bg-[#252523] border-t dark:border-[#3E3E3A] flex items-center justify-between px-4 py-2 text-[11px]
                        shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <Link href="#" className="text-green-600 font-medium hover:text-green-700">
                    Tandai Semua Dibaca
                </Link>
                <Link href="#" className="text-green-600 font-medium hover:text-green-700">
                    Lihat selengkapnya
                </Link>
            </div>
        </div>
    )

    const TabUpdate = () => (
        <div className="relative flex flex-col h-[360px]">

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto">

                {/* NOTIFICATION ITEM */}
                <div className="px-4 py-3 border-b dark:border-[#3E3E3A] bg-green-50 dark:bg-[#1A1A19]">
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400 mb-1">
                        <span className="flex items-center gap-1 text-green-600 font-semibold">
                            <Megaphone size={12} />
                            Promo
                        </span>
                        <span>•</span>
                        <span>24 Des</span>
                    </div>

                    <h4 className="font-semibold text-[13px] text-gray-900 dark:text-white leading-snug mb-1">
                        Cashback 80% untuk pengguna baru
                    </h4>

                    <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">
                        Tokopedia sudah berhasil mengirimkan produk kejutan
                        pembeli di Indonesia. Sekarang waktunya kamu cobain
                        nyamannya belanja apapun di Tokopedia pakai c...
                    </p>

                    <Link
                        href="/promo/cashback-80"
                        className="inline-block mt-1 text-[11px] text-green-600 font-semibold hover:underline"
                    >
                        Selengkapnya
                    </Link>
                </div>

                {/* contoh item lain (kalau banyak, otomatis scroll) */}
            </div>

            {/* STICKY FOOTER */}
            <div className="sticky bottom-0 bg-white dark:bg-[#252523] border-t dark:border-[#3E3E3A] flex items-center justify-between px-4 py-2 text-[11px]
                        shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <Link href="#" className="text-green-600 font-medium hover:text-green-700">
                    Tandai Semua Dibaca
                </Link>
                <Link href="/notifikasi" className="text-green-600 font-medium hover:text-green-700">
                    Lihat Selengkapnya
                </Link>
            </div>
        </div>
    );

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* ICON */}
            <button className="relative p-2 rounded-md hover:bg-gray-100/70 dark:hover:bg-[#252523]">
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* DROPDOWN */}
            {open && (
                <div className="absolute left-1/2 mt-4 w-[280px] -translate-x-1/2 bg-white dark:bg-[#252523] rounded-b-sm border border-gray-200 dark:border-[#3E3E3A] shadow-xl z-50 overflow-hidden">

                    {/* HEADER */}
                    <div className="flex items-center justify-between h-12 px-4 border-b dark:border-[#3E3E3A] shadow-md">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            Notifikasi
                        </h3>
                        <Settings className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300" />
                    </div>

                    {/* TABS */}
                    <div className="relative shrink-0">

                        {/* GARIS ABU */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 dark:bg-[#3E3E3A]" />

                        {/* TABS */}
                        <div className="relative grid grid-cols-2 text-sm font-semibold">
                            {TABS.map((tab, index) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={` py-2 text-center transition-colors
                                        ${activeTab === tab
                                            ? 'text-green-600'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                        }
                `}
                                >
                                    {tab}
                                </button>
                            ))}

                            {/* UNDERLINE */}
                            <span
                                className="pointer-events-none absolute bottom-0 h-0.5 bg-green-600 transition-transform duration-300 ease-out"
                                style={{
                                    width: `${100 / TABS.length}%`,
                                    transform: `translateX(${TABS.indexOf(activeTab) * 100}%)`,
                                }}
                            />
                        </div>
                    </div>

                    {/* CONTENT (NO PADDING DI SINI) */}
                    {activeTab === 'Transaksi' && <TabTransaksi />}
                    {activeTab === 'Update' && <TabUpdate />}
                </div>
            )}
        </div >
    );
}

function StatusItem({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-green-600 dark:hover:text-green-400">
            <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-[#1A1A19] flex items-center justify-center text-green-600 dark:text-green-400">
                {icon}
            </div>
            <span className="text-center leading-tight dark:text-gray-300">{label}</span>
        </div>
    );
}
