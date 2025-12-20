import { useState, useRef, useEffect } from "react";

/* =========================
   TABS & TYPES
========================= */
const TABS = [
    "Promo",
    "Tiket Pesawat",
    "Tiket Kereta",
    "Hotel",
    "Kartu Prakerja",
    "Food & Voucher",
    "Produk Digital",
    "Fintech",
    "Ditokoe Salam",
] as const;

type TabKey = typeof TABS[number];

/* =========================
   TAB DATA
========================= */
const TAB_DATA: Record<TabKey, string[][]> = {
    Promo: [
        [
            "Bebas Ongkir",
            "Flash Sale",
            "Tap Tap Kotak",
            "Semasa",
            "Serbu Official Store",
            "Catalog"
        ],
        [
            "Waktu Indonesia Belanja",
            "Promo Pengguna Baru",
            "Ditoekoe Peduli Sehat",
            "Kolaborasi Anak Bangsa",
            "Ditoekoe Parents"
        ],
        [
            "Waktu Indonesia Belanja TV Show",
            "Ditoekoe Nyam", "Home Living Salebration",
            "Ditoekoe B2B Digital",
            "Cantik Fest"
        ],
        [
            "Kejar Diskon",
            "Bangga Buatan Indonesia",
            "Super Gadget Day",
            "Mitra Ditoekoe",
            "GOPAY COINS"
        ],
    ],
    "Tiket Pesawat": [
        [
            "Tiket Pesawat ke Bali",
            "Tiket Pesawat ke Semarang",
            "Tiket Pesawat ke Palembang",
            "Tiket Pesawat ke Padang",
            "Tiket Pesawat ke Batam",
            "Tiket Pesawat ke Lombok",
            "Tiket Pesawat ke Labuan Bajo",
            "Tiket Pesawat ke Sydney",
        ],
        [
            "Tiket Pesawat ke Singapore",
            "Tiket Pesawat ke Surabaya",
            "Tiket Pesawat ke Makassar",
            "Tiket Pesawat ke Kuala Lumpur",
            "Tiket Pesawat ke Manado",
            "Tiket Pesawat ke Pontianak",
            "Tiket Pesawat ke Ambon",
            "Tiket Pesawat ke Bengkulu",
        ],
        [
            "Tiket Pesawat ke Medan",
            "Tiket Pesawat ke Malang",
            "Tiket Pesawat ke Bandung",
            "Tiket Pesawat ke Yogyakarta",
            "Tiket Pesawat ke Balikpapan",
            "Tiket Pesawat ke Jambi",
            "Tiket Pesawat ke Banjarmasin",
            "Tiket Pesawat ke Banyuwangi",
        ],
        [
            "Tiket Pesawat ke Jakarta",
            "Tiket Pesawat ke London",
            "Tiket Pesawat ke Bangkok",
            "Tiket Pesawat ke Solo",
            "Tiket Pesawat ke Pekanbaru",
            "Tiket Pesawat ke Paris",
            "Tiket Pesawat ke Kupang",
            "Tiket Pesawat ke Dubai",
        ],

    ],
    "Tiket Kereta": [
        [
            "Tiket Kereta Bandung Jakarta",
            "Tiket Kereta Bandung Surabaya",
            "Tiket Kereta Surabaya Malang",
            "Tiket Kereta Solo Semarang",
            "Tiket Kereta Sukabumi Bogor",
            "Tiket Kereta Pekalongan Bandung",
            "Tiket Kereta Sidoarjo Banyuwangi",
            "Tiket Kereta Bandung Bekasi",
        ],
        [
            "Tiket Kereta Jakarta Malang",
            "Tiket Kereta Surabaya Bandung",
            "Tiket Kereta Kebumen Jogja",
            "Tiket Kereta Jogja Solo",
            "Tiket Kereta Purwokerto Semarang",
            "Tiket Kereta Surabaya Solo",
            "Tiket Kereta Banyuwangi Lumajang",
            "Tiket Kereta Banyuwangi Surabaya",
        ],
        [
            "Tiket Kereta Jogja Bandung",
            "Tiket Kereta Semarang Solo",
            "Tiket Kereta Semarang Bandung",
            "Tiket Kereta Malang Surabaya",
            "Tiket Kereta Malang Bandung",
            "Tiket Kereta Palembang Lampung",
            "Tiket Kereta Cirebon Bandung",
            "Tiket Kereta Malang Banyuwangi",
        ],
        [
            "Tiket Kereta Jakarta Solo",
            "Tiket Kereta Bandung Malang",
            "Tiket Kereta Bandung Semarang",
            "Tiket Kereta Semarang Malang",
            "Tiket Kereta Bandung Solo",
            "Tiket Kereta Semarang Purwokerto",
            "Tiket Kereta Bandung Cirebon",
            "Tiket Kereta Bandung Tasik",
        ],
    ],

    "Hotel": [
        [
            "Hotel di Bandung",
            "Hotel di Yogyakarta",
            "Hotel di Bogor",
            "Hotel di Malang",
            "Hotel di Surabaya",
            "Hotel di Solo",
            "Hotel di Jakarta",
            "Hotel di Medan",
        ],
        [
            "Hotel di Palembang",
            "Hotel di Cirebon",
            "Hotel di Makassar",
            "Hotel di Padang",
            "Hotel di Bekasi",
            "Hotel di Batam",
            "Hotel di Garut",
            "Hotel di Magelang",
        ],
        [
            "Hotel di Balikpapan",
            "Hotel di Tangerang",
            "Hotel di Bukittinggi",
            "Hotel di Banjarmasin",
            "Hotel di Samarinda",
            "Hotel di Sukabumi",
            "Hotel di Salatiga",
            "Hotel di Tasikmalaya",
        ],
        [
            "Hotel di Madiun",
            "Hotel di Tegal",
            "Hotel di Lampung",
            "Hotel di Purwakarta",
            "Hotel di Lembang",
            "Hotel di Semarang",
            "Hotel di Lombok",
            "Hotel di Puncak",
        ],
    ],
    "Kartu Prakerja": [
        [
            "Luar Sekolah",
            "Arkademi",
            "Rumah Siap Kerja"
        ],
        [
            "Haruka Edu",
            "Hacktiv8",
            "Hellomotion Academy"
        ],
        [
            "Cakap",
            "Baking World"
        ],
        [
            "Skill Academy",
            "Studimu"
        ],
    ],
    "Food & Voucher": [
        [
            "Deals",
            "Deals Jakarta",
            "Deals Bandung",
            "Deals Surabaya"
        ],
        [
            "Deals Medan",
            "Deals Bali",
            "KFC",
            "Kintan"
        ],
        [
            "Shaburi",
            "McD",
            "Pizza Hut",
            "Yoshiroya"
        ],
        [
            "Shabu Hachi",
            "Domino Pizza",
            "Golden Lamian",
            "Ichiban Sushi"
        ],
        [
            "Pizza Marzano",
            "Imperial Kitchen",
            "Genki Sushi",
            "Bakmi GM"
        ],
    ],
    "Produk Digital": [
        [
            "Voucher Game Unipin",
            "Voucher Game Codashop",
            "Voucher Game Gemscool",
            "Bell Pulsa Smarttren",
            "Bell Pulsa AS",
            "Bell Paket Data TS",
            "Bell Paket Data XL",
            "Tokopedia B2B Digital",
            "Catchplay"
        ],
        [
            "Voucher Game Steam",
            "Voucher GooglePlay",
            "Voucher Itunes",
            "Bell Pulsa Bott",
            "Bell Pulsa Axis",
            "Bell Paket Data Axis",
            "Bell Paket Data Indosat",
            "Bein Sports"
        ],
        [
            "Free Fire",
            "Voucher Game Garena",
            "Bell Pulsa XL",
            "Bell Pulsa M3",
            "Bell Paket Data Bolt",
            "Bell Paket Data Trit",
            "Bayar Tagihan Listrik",
            "Wifi Id"
        ],
        [
            "Mobile Legends",
            "Voucher Point Blank",
            "Bell Pulsa Simpati",
            "Bell Pulsa Tri",
            "Bell Paket Data Trit",
            "Bell Paket Data AS",
            "Bell Token Listrik",
            "Viu"
        ],
    ],
    "Fintech": [
        [
            "Pinjaman Tanpa BI Checking",
            "Pinjaman Pribadi",
            "Pinjaman Adira Finance",
            "Proteksi Elektronik",
            "Kartu Kredit Bank UOB"
        ],
        [
            "Pinjaman Jaminan BPKB",
            "Pinjaman Karyawan",
            "Syallendra Dana Kas",
            "Proteksi Tagihan",
            "Kartu Kredit Bank MNC"
        ],
        [
            "Pinjaman Online Cepat Cair",
            "Pinjaman Pendidikan",
            "Mandiri Pasar Uang Syariah Ekstra",
            "Kamus Ditoekoe",
            "Kartu Kredit Citibank"
        ],
        [
            "Pinjaman KTA Tanpa Kartu Kredit",
            "Pinjaman Non Bank",
            "Proteksi Gadget",
            "Harga Emas Hari Ini",
            "Kartu Kredit Standard Chartered"
        ],
    ],
    "Ditokoe Salam": [
        [
            "Zakat Firah",
            "Cari Masjid Terdekat",
            "Jadwal Sholat Sidoarjo",
            "Juz Amma Online",
            "Ditokoe Salam Produk"
        ],
        [
            "Jadwal Sholat Bandung",
            "Donasi",
            "Produk Halal",
            "Qurban"
        ],
        [
            "Jadwal Sholat Semarang",
            "Jadwal Sholat Surabaya",
            "Jadwal Sholat Malang",
            "Jadwal Sholat Cirebon"
        ],
        [
            "Jadwal Sholat Medan",
            "Jadwal Sholat Jogja",
            "Jadwal Sholat Bogor",
            "Jadwal Sholat Depok"
        ],
    ],
};

export function NavFooter() {
    const [activeTab, setActiveTab] = useState<TabKey>("Promo");

    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState({
        width: 0,
        left: 0,
    });

    useEffect(() => {
        const activeIndex = TABS.indexOf(activeTab);
        const activeTabEl = tabRefs.current[activeIndex];

        if (activeTabEl) {
            setIndicatorStyle({
                width: activeTabEl.offsetWidth,
                left: activeTabEl.offsetLeft,
            });
        }
    }, [activeTab]);

    return (
        <footer className="bg-white py-10 dark:bg-[#1A1A19]">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-white dark:bg-[#252523]">

                    {/* HEADER */}
                    <div className="mb-6">
                        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">
                            Cari Semua di Ditoekoe!
                        </h2>

                        {/* TABS */}
                        <div className="relative border-b border-gray-200 dark:border-[#3E3E3A]">
                            {/* TAB BUTTONS */}
                            <div className="flex flex-wrap gap-4 relative">
                                {TABS.map((tab, index) => (
                                    <button
                                        key={tab}
                                        ref={(el: HTMLButtonElement | null) => {
                                            tabRefs.current[index] = el;
                                        }}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-3 px-4.5 text-sm font-semibold transition-colors duration-200
                                                ${activeTab === tab
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* SLIDING UNDERLINE */}
                            <span
                                className="absolute bottom-0 h-[3px] rounded-t-full bg-green-600 dark:bg-green-400 transition-all duration-300 ease-out"
                                style={{
                                    width: indicatorStyle.width,
                                    transform: `translateX(${indicatorStyle.left}px)`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <div
                            className="px-4 grid gap-4"
                            style={{
                                gridTemplateColumns: `repeat(${TAB_DATA[activeTab].length}, minmax(0, 1fr))`,
                            }}
                        >
                            {TAB_DATA[activeTab].map((column, colIndex) => (
                                <div key={colIndex} className="space-y-2">
                                    {column.map((item, itemIndex) => (
                                        <div
                                            key={itemIndex}
                                            className="w-full text-[12.5px] text-gray-600 dark:text-gray-400 py-1.5 border-b border-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="max-w-md">
                            <h3 className="text-lg font-black text-green-600 mb-3">
                                Punya Toko Online? Buka cabangnya di Ditoekoe
                            </h3>

                            <p className="text-[13px] text-gray-600 dark:text-gray-300 mb-5">
                                <span className="font-medium">
                                    Mudah, nyaman dan bebas Biaya Layanan Transaksi.
                                </span>{" "}
                                <span className="font-black">GRATIS!</span>
                            </p>

                            <div className="flex items-center gap-4">
                                <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md font-bold text-sm transition-colors">
                                    Buka Toko GRATIS
                                </button>

                                <button className="text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-200 flex items-center gap-0.5">
                                    Pelajari lebih lanjut
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2.5}
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {/* RIGHT - IMAGE */}
                        <div className="flex justify-center md:justify-end md:flex-1 mx-[-40px]">
                            <div className="w-[360px] md:w-[420px] lg:w-[480px]">
                                <img
                                    src="images/footer/foot-01.webp"
                                    alt="Buka Toko di Ditoekoe"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>
                    {/* DASHED SEPARATOR */}
                    <div className="mt-0">
                        <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-600"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
}