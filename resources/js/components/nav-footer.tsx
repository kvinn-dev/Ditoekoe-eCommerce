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
    "Ditoekoe Salam",
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
            "Ditoekoe B2B Digital",
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
    "Ditoekoe Salam": [
        [
            "Zakat Firah",
            "Cari Masjid Terdekat",
            "Jadwal Sholat Sidoarjo",
            "Juz Amma Online",
            "Ditoekoe Salam Produk"
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
    const [lang, setLang] = useState<"ID" | "EN">("ID"); // Bahasa default Indonesia

    // Toggle bahasa
    const handleToggleLang = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLang(e.target.checked ? "EN" : "ID");
    };

    // Tabs indicator
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });

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
                <div className="bg-white dark:bg-[#1A1A19]">

                    {/* HEADER */}
                    <div className="mb-6">
                        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">
                            Cari Semua di Ditoekoe!
                        </h2>

                        {/* TABS */}
                        <div className="relative border-b border-gray-200 dark:border-[#252523]">
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
                                            className="w-full text-[12.5px] text-gray-600 dark:text-gray-400 py-1.5 border-b border-gray-100 dark:border-[#252523] hover:text-green-600 dark:hover:text-green-400 transition-colors"
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
                                    src="/images/nav/foot-01.webp"
                                    alt="Buka Toko di Ditoekoe"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>
                    {/* DASHED SEPARATOR */}
                    <div className="mt-5 mb-3">
                        <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-600"></div>
                    </div>

                    {/* KEAMANAN DITOEKOE - ELEMEN BARU */}
                    <div className="mt-0 pt-6 dark:border-[#3E3E3A] ">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* TRANSPARAN */}
                            <div className="flex items-stretch gap-4">
                                <div className="flex-shrink-0 flex items-center justify-center">
                                    <div className="h-full aspect-square flex items-center justify-center">
                                        <img
                                            src="/images/nav/transparan.jfif"
                                            alt="Transparan"
                                            className="h-[120px] object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="font-black text-green-600 dark:text-white text-[18px] mb-1">Transparan</h4>
                                    <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Pembayaran Anda baru diteruskan ke penjual setelah barang Anda terima
                                    </p>
                                </div>
                            </div>

                            {/* AMAN */}
                            <div className="flex items-stretch gap-4">
                                <div className="flex-shrink-0 flex items-center justify-center">
                                    <div className="h-full aspect-square flex items-center justify-center">
                                        <img
                                            src="/images/nav/aman.jfif"
                                            alt="Aman"
                                            className="h-[120px] object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="font-black text-green-600 dark:text-white text-[18px] mb-1">Aman</h4>
                                    <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Bandingkan review untuk berbagai online shop terpercaya se-Indonesia
                                    </p>
                                </div>
                            </div>

                            {/* FASILITAS ESCROW GRATIS */}
                            <div className="flex items-stretch gap-4">
                                <div className="flex-shrink-0 flex items-center justify-center">
                                    <div className="h-full aspect-square flex items-center justify-center">
                                        <img
                                            src="/images/nav/escrow.jfif"
                                            alt="Fasilitas Escrow"
                                            className="h-[120px] object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="font-black text-green-600 dark:text-white text-[18px] mb-1">
                                        Fasilitas Escrow Gratis
                                    </h4>
                                    <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Fasilitas Escrow (rekening Bersama) Ditoekoe tidak dikenakan biaya tambahan
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* DASHED SEPARATOR */}
                        <div className="mt-10">
                            <div className="w-full border-t border-dashed border-gray-300 dark:border-gray-600"></div>
                        </div>

                        {/* FOOTER BARU */}
                        <div className="mt-4 pt-8 dark:border-[#3E3E3A]">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-0.5 ">

                                {/* Ditoekoe */}
                                <div className="pr-16">
                                    <div className="flex flex-col space-y-6 border-r border-gray-200/50 dark:border-gray-700 h-full">
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Ditoekoe</h4>
                                        <ul className="space-y-2">
                                            {['Tentang Ditoekoe', 'Hak Kekayaan Intelektual', 'Karir', 'Blog', 'Ditoekoe Affiliate Program', 'Ditoekoe B2B Digital', 'Ditoekoe Marketing Solutions', 'Kalkulator Indeks Massa Tubuh', 'Ditoekoe Farma', 'Promo Hari Ini', 'Beli Lokal', 'Promo Guncang'].map((item) => (
                                                <li key={item}>
                                                    <a href="#" className="text-[13.5px] text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                        {item}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Beli, Jual, Bantuan & Panduan */}
                                <div className="pr-16">
                                    <div className="flex flex-col space-y-6 border-r border-gray-200/50 dark:border-gray-700 h-full">
                                        {/* Beli */}
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Beli</h4>
                                            <ul className="space-y-2">
                                                {['Tagihan & Top Up', 'Ditoekoe COD', 'Bebas Ongkir'].map((item) => (
                                                    <li key={item}>
                                                        <a href="#" className="text-[13.5px] text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                            {item}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Jual */}
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Jual</h4>
                                            <ul className="space-y-2">
                                                {['Pusat Edukasi Seller', 'Daftar Mall'].map((item) => (
                                                    <li key={item}>
                                                        <a href="#" className="text-[13.5px] text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                            {item}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Bantuan & Panduan */}
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Bantuan & Panduan</h4>
                                            <ul className="space-y-2">
                                                {['Ditoekoe Care', 'Syarat dan Ketentuan', 'Kebijakan Privasi'].map((item) => (
                                                    <li key={item}>
                                                        <a href="#" className="text-[13.5px] text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                                            {item}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="pr-16">
                                    <div className="flex flex-col space-y-6 border-r border-gray-200/50 dark:border-gray-700 h-full">
                                        {/* Keamanan & Privasi + Ikuti Kami */}
                                        <div className="space-y-6">
                                            {/* Keamanan & Privasi */}
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Keamanan & Privasi</h4>
                                                <ul className="space-y-2">
                                                    {['Transparan', 'Aman', 'Fasilitas Escrow Gratis'].map((item) => (
                                                        <li key={item}>
                                                            <a href="#" className="text-[13.5px] text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">{item}</a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Ikuti Kami */}
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Ikuti Kami</h4>
                                                <div className="flex space-x-2">
                                                    {[
                                                        { name: 'Facebook', src: '/images/icon/fb.svg' },
                                                        { name: 'Twitter', src: '/images/icon/tw.svg' },
                                                        { name: 'Pinterest', src: '/images/icon/pin.svg' },
                                                        { name: 'Instagram', src: '/images/icon/ig.svg' }
                                                    ].map((item) => (
                                                        <a key={item.name} href="#" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                                                            <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                                                                <img
                                                                    src={item.src}
                                                                    alt={item.name}
                                                                    className="w-full object-contain"
                                                                />
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Aplikasi Mobile */}
                                <div className="space-y-6">
                                    <div>
                                        <div className="space-y-6">
                                            <h5 className="font-bold text-gray-900 dark:text-white mb-3">
                                                Nikmati keuntungan spesial di aplikasi:
                                            </h5>
                                            <ul className="space-y-2 mb-4">
                                                {[
                                                    {
                                                        text: 'Diskon 70% hanya di aplikasi',
                                                        icon: (
                                                            <svg className="nest-icon " width="24" height="24" fill="rgb(var(--GN500,0,158,66))" viewBox="0 0 24 24">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M2.5 12c0-5.24 4.26-9.5 9.5-9.5s9.5 4.26 9.5 9.5-4.26 9.5-9.5 9.5-9.5-4.26-9.5-9.5ZM4 12c0 4.41 3.59 8 8 8s8-3.59 8-8-3.59-8-8-8-8 3.59-8 8Zm8.68-2.49v1.81c1.82.49 2.6 1.23 2.6 2.58s-1.03 2.21-2.54 2.38v.64c0 .34-.28.62-.62.62-.34 0-.62-.27-.62-.62v-.65c-.85-.11-1.65-.41-2.36-.84-.25-.16-.41-.4-.41-.72 0-.47.36-.82.83-.82.16 0 .33.06.47.16.51.32.99.55 1.54.67v-1.91c-1.73-.46-2.58-1.12-2.58-2.55 0-1.32 1.01-2.2 2.52-2.36v-.14c0-.34.28-.62.62-.62.34 0 .62.27.62.62v.17c.65.1 1.22.29 1.74.58a.8.8 0 0 1 .43.72.8.8 0 0 1-.82.8c-.14 0-.29-.04-.42-.11-.34-.18-.68-.33-1-.41Zm-1.96.65c0 .37.17.62.83.86V9.4c-.58.09-.83.39-.83.76Zm1.96 2.96v1.67c.56-.08.85-.35.85-.78 0-.4-.2-.66-.85-.89Z">
                                                                </path>
                                                            </svg>
                                                        )
                                                    },
                                                    {
                                                        text: 'Promo Khusus aplikasi',
                                                        icon: (
                                                            <svg className="nest-icon " width="24" height="24" fill="rgb(var(--GN500,0,158,66))" viewBox="0 0 24 24">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="m21.09 10.05-.92-.91a1.31 1.31 0 0 1-.37-.9V7a2.701 2.701 0 0 0-.8-2 2.62 2.62 0 0 0-1.95-.81h-1.29a1.29 1.29 0 0 1-.9-.37L14 2.91a2.81 2.81 0 0 0-3.9 0l-.91.92a1.3 1.3 0 0 1-.89.37H7A2.66 2.66 0 0 0 5 5a2.7 2.7 0 0 0-.81 2v1.24a1.31 1.31 0 0 1-.37.9l-.92.91a2.73 2.73 0 0 0 0 3.9l.92.91c.234.241.367.564.37.9v1.29A2.7 2.7 0 0 0 5 19a2.73 2.73 0 0 0 1.94.81h1.31a1.3 1.3 0 0 1 .89.37l.91.92a2.73 2.73 0 0 0 3.9 0l.91-.92a1.2 1.2 0 0 1 .9-.37h1.29A2.89 2.89 0 0 0 19 19a2.7 2.7 0 0 0 .81-1.95v-1.29a1.31 1.31 0 0 1 .37-.9l.92-.91a2.73 2.73 0 0 0 0-3.9h-.01ZM20 12.89l-.92.91a2.77 2.77 0 0 0-.82 2v1.29a1.22 1.22 0 0 1-.37.89 1.19 1.19 0 0 1-.89.37h-1.3a2.75 2.75 0 0 0-1.95.82l-.91.92a1.3 1.3 0 0 1-1.78 0l-.91-.92a2.75 2.75 0 0 0-1.95-.82H7a1.27 1.27 0 0 1-1.167-.777 1.22 1.22 0 0 1-.093-.483v-1.33a2.77 2.77 0 0 0-.82-2L4 12.89a1.26 1.26 0 0 1 0-1.78l.92-.91a2.77 2.77 0 0 0 .82-2V7a1.22 1.22 0 0 1 .37-.89A1.42 1.42 0 0 1 7 5.69h1.3a2.75 2.75 0 0 0 1.95-.82l.86-.87a1.28 1.28 0 0 1 1.78 0l.91.91a2.75 2.75 0 0 0 1.95.82h1.3c.333.006.651.138.89.37a1.221 1.221 0 0 1 .37.89v1.25a2.77 2.77 0 0 0 .82 2l.92.91a1.26 1.26 0 0 1 0 1.78l-.05-.04Zm-9.882-2.126A1.4 1.4 0 0 1 9.34 11a1.36 1.36 0 0 1-1.4-1.4 1.4 1.4 0 1 1 2.178 1.164Zm3.524 2.712a1.4 1.4 0 0 1 .778-.236 1.31 1.31 0 0 1 1.4 1.4 1.4 1.4 0 1 1-2.178-1.164ZM15 8.25a.75.75 0 0 1 .53 1.279l-6 6a.75.75 0 0 1-1.06-1.06l6-6a.75.75 0 0 1 .53-.22Z">
                                                                </path>
                                                            </svg>
                                                        )
                                                    },
                                                    {
                                                        text: 'Gratis Ongkir tiap hari',
                                                        icon: (
                                                            <svg className="nest-icon " width="24" height="24" fill="rgb(var(--GN500,0,158,66))" viewBox="0 0 24 24">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="m18.66 8.19 2.41 2.75a2.75 2.75 0 0 1 .68 1.81V17A1.76 1.76 0 0 1 20 18.75h-1.41c.006.083.006.167 0 .25a2 2 0 0 1-4 0 1.896 1.896 0 0 1 0-.25H9.53a1.9 1.9 0 0 1 0 .25 2 2 0 0 1-4 0 1.9 1.9 0 0 1 0-.25H5A2.75 2.75 0 0 1 2.25 16v-4.25H2a.75.75 0 1 1 0-1.5h4a.75.75 0 1 1 0 1.5H3.75V16A1.25 1.25 0 0 0 5 17.25h7.25V7A1.25 1.25 0 0 0 11 5.75H5a.75.75 0 0 1 0-1.5h6A2.75 2.75 0 0 1 13.75 7v.25h2.84a2.73 2.73 0 0 1 2.07.94Zm1.517 8.987A.25.25 0 0 0 20.25 17v-4.25H17a.76.76 0 0 1-.75-.75v-1a.76.76 0 0 1 .75-.75h1.47l-.94-1.07a1.24 1.24 0 0 0-.94-.43h-2.84v8.5H20a.25.25 0 0 0 .177-.073ZM8.15 8.79h-4.5a.75.75 0 0 1 0-1.5h4.5a.75.75 0 1 1 0 1.5Z">
                                                                </path>
                                                            </svg>
                                                        )
                                                    }
                                                ].map((item, index) => (
                                                    <li key={index} className="flex items-center gap-2">
                                                        {item.icon}
                                                        <span className="text-[13.5px] text-gray-900 dark:text-gray-400">{item.text}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* QR + Download Buttons */}
                                    <div className="flex flex-col space-y-2">
                                        <p className="text-[13.5px] text-gray-600 dark:text-gray-400 mb-2">
                                            Buka aplikasi dengan scan QR atau klik tombol:
                                        </p>

                                        <div className="flex items-start gap-2">
                                            <div className="mx-[-10px] flex-shrink-0 w-30 h-28">
                                                <img
                                                    src="/images/nav/qr-apk.webp"
                                                    alt="QR Code Ditoekoe"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>

                                            <div className="flex flex-col mx-3.5 space-y-2 pt-1">
                                                <a href="#" className="block">
                                                    <div className="h-7 bg-white dark:bg-white border border-gray-200 shadow-sm rounded-sm flex items-center justify-center px-4 w-30">
                                                        <img src="/images/nav/appstore.png" alt="Get it on Google Play" className="h-6 object-contain" />
                                                    </div>
                                                </a>
                                                <a href="#" className="block">
                                                    <div className="h-7 bg-white dark:bg-white border border-gray-200 shadow-sm rounded-sm flex items-center justify-center px-4 w-30">
                                                        <img src="/images/nav/gp.png" alt="Download on the App Store" className="h-6 object-contain" />
                                                    </div>
                                                </a>
                                                <a href="#" className="block">
                                                    <div className="h-7 bg-white dark:bg-white border border-gray-200 shadow-sm rounded-sm flex items-center justify-center px-4 w-30">
                                                        <img src="/images/nav/appgallery.png" alt="Explore it on AppGallery" className="h-6 object-contain" />
                                                    </div>
                                                </a>
                                            </div>
                                        </div>

                                        {/* Link Pelajari Selengkapnya */}
                                        <div>
                                            <a
                                                href="#"
                                                className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-[13.5px] font-medium transition-colors"
                                            >
                                                Pelajari Selengkapnya
                                                <svg
                                                    className="nest-icon"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                    style={{ marginLeft: '3px' }}
                                                >
                                                    <path d="M3.57 13.18h15.22l-5.73 5.72c-.14.14-.22.34-.22.54a.75.75 0 0 0 1.28.53l7.1-7.1c.14-.14.22-.34.22-.53s-.08-.39-.22-.53l-7.1-7.1a.75.75 0 1 0-1.06 1.06l5.92 5.91H3.57a.75.75 0 0 0 0 1.5Z"></path>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Copyright & Toggle */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-[#3E3E3A] flex justify-between items-center">
                                <p className="text-[13.5px] text-gray-600 dark:text-gray-400">
                                    © Ditoekoe 2025. All Rights Reserved.
                                </p>

                                {/* Toggle Switch Bahasa */}
                                <div className="relative inline-flex h-8.5 w-40 bg-gray-200/70 dark:bg-[#252523] rounded-md p-1">
                                    {/* Slider */}
                                    <div
                                        className="absolute top-1 left-1 h-6.5 w-1/2 max-w-19 bg-green-600 rounded-md transition-all duration-300"
                                        style={{
                                            transform: lang === "EN" ? "translateX(100%)" : "translateX(0%)",
                                        }}
                                    ></div>

                                    {/* Tombol Indonesia */}
                                    <button
                                        onClick={() => setLang("ID")}
                                        className={`relative z-10 flex-1 text-[13.5px] font-medium transition-colors duration-300 ${lang === "ID" ? "text-white" : "text-green-600"
                                            }`}
                                    >
                                        <span>Indonesia</span>
                                    </button>

                                    {/* Tombol English */}
                                    <button
                                        onClick={() => setLang("EN")}
                                        className={`relative z-10 flex-1 text-[13.5px] font-medium transition-colors duration-300 ${lang === "EN" ? "text-white" : "text-green-600"
                                            }`}
                                    >
                                        <span>English</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}