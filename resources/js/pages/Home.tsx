import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from "react";
import { type SharedData } from '@/types';
import { ChevronRight, ChevronLeft, ShoppingCart, Star, Truck, Shield, Clock } from 'lucide-react';

// ===============================
// MANUAL FLASH SALE WITH STOCK
// ===============================
const manualFlashSale = [
    {
        id: 1,
        name: "Sikat Gigi Sensodyne Fresh Mint 120g",
        slug: "sensodyne-fresh-mint",
        price: 35000,
        discount_price: 24500,
        image: "images/001.jpeg",
        category: { name: "Kesehatan", slug: "kesehatan" },
        stock: 30,
        max_stock: 100,
    },
    {
        id: 2,
        name: "Mouthwash Listerine Cool Mint 250ml",
        slug: "listerine-cool-mint",
        price: 48000,
        discount_price: 29900,
        image: "images/002.jpeg",
        category: { name: "Kesehatan", slug: "kesehatan" },
        stock: 15,
        max_stock: 100,
    },
    {
        id: 3,
        name: "Masker Vit C 10pcs",
        slug: "masker-vit-c",
        price: 60000,
        discount_price: 45000,
        image: "images/003.jpeg",
        category: { name: "Kecantikan", slug: "kecantikan" },
        stock: 75,
        max_stock: 100,
    },
    {
        id: 4,
        name: "Obat Kumur Betadine 100ml",
        slug: "betadine-gargle",
        price: 42000,
        discount_price: 27000,
        image: "images/004.jpeg",
        category: { name: "Kesehatan", slug: "kesehatan" },
        stock: 10,
        max_stock: 100,
    },
    {
        id: 5,
        name: "Hansaplast Universal 40 Strips",
        slug: "hansaplast-universal",
        price: 28000,
        discount_price: 18500,
        image: "images/005.jpeg",
        category: { name: "Kesehatan", slug: "kesehatan" },
        stock: 50,
        max_stock: 100,
    },
    {
        id: 6,
        name: "Biore Body Foam Antibacterial 450ml",
        slug: "biore-antibacterial",
        price: 34000,
        discount_price: 23500,
        image: "images/006.jpeg",
        category: { name: "Perawatan Tubuh", slug: "perawatan-tubuh" },
        stock: 45,
        max_stock: 100,
    },
    {
        id: 7,
        name: "Dettol Hand Sanitizer 50ml",
        slug: "dettol-hand-sanitizer",
        price: 22000,
        discount_price: 12500,
        image: "images/007.jpeg",
        category: { name: "Kesehatan", slug: "kesehatan" },
        stock: 90,
        max_stock: 100,
    },
    {
        id: 8,
        name: "Nivea Lip Balm Strawberry 4.8g",
        slug: "nivea-lip-balm",
        price: 26000,
        discount_price: 18000,
        image: "images/008.jpeg",
        category: { name: "Kecantikan", slug: "kecantikan" },
        stock: 68,
        max_stock: 100,
    },
    {
        id: 9,
        name: "Pond's Bright Beauty Serum 30ml",
        slug: "ponds-bright-serum",
        price: 55000,
        discount_price: 39900,
        image: "images/009.jpeg",
        category: { name: "Kecantikan", slug: "kecantikan" },
        stock: 22,
        max_stock: 100,
    },
    {
        id: 10,
        name: "Cetaphil Gentle Skin Cleanser 125ml",
        slug: "cetaphil-cleanser",
        price: 95000,
        discount_price: 72900,
        image: "images/010.jpeg",
        category: { name: "Kecantikan", slug: "kecantikan" },
        stock: 12,
        max_stock: 100,
    }
];

const bannerData = [
    {
        id: 1,
        title: "Promo Guncang 12.12",
        subtitle: "HALEON",
        src: "images/01.png",
    },
    {
        id: 2,
        title: "Flash Sale Akhir Tahun",
        subtitle: "SENSODYNE",
        src: "images/02.jpeg",
    },
    {
        id: 3,
        title: "Paket Hemat Keluarga",
        subtitle: "PARAMONT",
        src: "images/03.jpeg",
    },
    {
        id: 4,
        title: "Paket Hemat Keluarga",
        subtitle: "PARAMONT",
        src: "images/04.jpeg",
    }
];

interface HomePageProps {
    featuredProducts: Array<{
        id: number;
        name: string;
        slug: string;
        price: number;
        discount_price: number | null;
        image: string | null;
        category: { name: string; slug: string };
    }>;
    newProducts: Array<{
        id: number;
        name: string;
        slug: string;
        price: number;
        discount_price: number | null;
        image: string | null;
        category: { name: string; slug: string };
    }>;
    categories: Array<{
        id: number;
        name: string;
        slug: string;
        products_count: number;
    }>;
    flashSale: Array<{
        id: number;
        name: string;
        slug: string;
        price: number;
        discount_price: number | null;
        image: string | null;
        category: { name: string; slug: string };
        stock?: number;
        max_stock?: number;
    }>;
}

export default function Home({
    featuredProducts = [],
    newProducts = [],
    categories = [],
    flashSale = []
}: HomePageProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const { auth } = usePage<SharedData>().props;
    const flashSaleData = flashSale.length ? flashSale : manualFlashSale;

    // Fungsi untuk slide berikutnya
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === bannerData.length - 1 ? 0 : prev + 1));
    };

    // Fungsi untuk slide sebelumnya
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? bannerData.length - 1 : prev - 1));
    };

    // Fungsi untuk pindah ke slide tertentu
    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    // Auto-play slider
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // Ganti slide setiap 5 detik

        return () => clearInterval(interval);
    }, [currentSlide, isAutoPlaying]);

    // Pause auto-play saat hover
    const handleMouseEnter = () => {
        setIsAutoPlaying(false);
    };

    const handleMouseLeave = () => {
        setIsAutoPlaying(true);
    };

    const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00" });

    useEffect(() => {
        const countdownTarget = new Date();
        countdownTarget.setHours(24, 0, 0, 0); // Target: jam 00:00 nanti malam

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownTarget.getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({
                h: String(hours).padStart(2, "0"),
                m: String(minutes).padStart(2, "0"),
                s: String(seconds).padStart(2, "0"),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Head title="Toko Online - Belanja Online Murah & Aman">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-600">
                {/* Header Navigation */}
                <header className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-500 dark:border-gray-600">
                    {/* Top Promo Bar */}
                    <div className="bg-gray-100 text-xs py-0 border-b border-gray-200 px-4 dark:bg-gray-500 dark:border-gray-600">
                        <div className="container mx-2 flex items-center justify-between text-gray-600 dark:text-gray-300">
                            <Link
                                href="/promo-aplikasi"
                                className="flex items-center gap-1 px-4 py-1 text-gray-900 bg-transparent"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                </svg>

                                <span className="font-bold text-sm">
                                    Gratis Ongkir + Banyak Promo
                                </span>

                                <span className="text-sm font-medium hover:font-bold">
                                    belanja di aplikasi
                                </span>

                                {/* Icon Arrow */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-4 h-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                    />
                                </svg>
                            </Link>
                            <div className="flex items-center gap-6">
                                <nav className=" text-sm hover:text-green-600">
                                    <Link href="/">Tentang TokoOnline</Link>
                                </nav>
                                <nav className="text-sm hover:text-green-600">
                                    <Link href="/">Mulai Berjualan</Link>
                                </nav>
                                <nav className="text-sm hover:text-green-600">
                                    <Link href="/">Promo</Link>
                                </nav>
                                <nav className=" text-sm hover:text-green-600">
                                    <Link href="/">TokoOnline Care</Link>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Main Navbar */}
                    <div className="container mx-auto px-4 py-2 bg-white">
                        <div className="flex items-center justify-between gap-6">

                            {/* LOGO */}
                            <Link href="/" className="text-2xl font-bold text-green-600">
                                TokoOnline
                            </Link>

                            {/* SEARCH BAR */}
                            <div className="flex-1 hidden md:flex">
                                <div className="w-full relative">
                                    <input
                                        type="text"
                                        placeholder="Cari di TokoOnline"
                                        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none focus:ring-1 focus:ring-green-600 focus:border-green-600 dark:border-green-600 dark:bg-green-700 dark:text-gray-200"
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
                                    <span className="absolute -right-2 -top-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
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
                                            className="rounded-md border border-green-600 px-3 py-1 text-sm text-green-600 hover:bg-green-100"
                                        >
                                            Masuk
                                        </Link>

                                        <Link
                                            href="/register"
                                            className="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-600"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section
                    className="relative mt-15"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Jadikan banner sebagai GROUP supaya bisa hover */}
                    <div className="group relative mx-4 max-w-6xl md:mx-auto overflow-hidden rounded-xl shadow-lg">

                        {/* Background murni gambar */}
                        <div className="relative h-64 md:h-72 w-full">
                            <img
                                src={bannerData[currentSlide].src}
                                alt={`Banner ${currentSlide + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* CHEVRONS */}
                        <div className="absolute inset-0 pointer-events-none group">
                            <button
                                onClick={prevSlide}
                                className="pointer-events-auto absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#333]/90 shadow-md p-3 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:scale-110 transition-all duration-300"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <button
                                onClick={nextSlide}
                                className="pointer-events-auto absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#333]/90 shadow-md p-3 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:scale-110 transition-all duration-300"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Dots lebih kecil (kiri bawah) */}
                        <div className="absolute bottom-4 left-4 z-20 flex gap-1">
                            {bannerData.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-1.5 w-1.5 rounded-full transition-all 
                        ${index === currentSlide ? "w-0 bg-white" : "bg-white/70"}`}
                                />
                            ))}
                        </div>

                        {/* Button promo kecil kanan bawah */}
                        <Link
                            href="/promotions"
                            className="absolute bottom-4 right-4 z-20 rounded-sm bg-black px-2 py-1 text-xs font-regular text-white"
                        >
                            Lihat promo lainnya
                        </Link>

                        {/* Progress bar autoplay */}
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
                            <div
                                className="h-full bg-green-600 transition-all duration-5000"
                                style={{
                                    width: isAutoPlaying ? "100%" : "0%",
                                    transitionDuration: isAutoPlaying ? "5s" : "0s"
                                }}
                            />
                        </div>

                    </div>
                </section>

                {/* Features Section (Shopee-style icons grid) */}
                <section className="py-10">
                    <div className="container mx-auto px-18">
                        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 text-center">

                            {/* Item 1 */}
                            <Link
                                href="/lokal"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-[#161615]">
                                    <img src="images/icon_local.png" alt="TokoOnline Lokal" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-sm font-regular text-gray-800 dark:text-gray-200">TokoOnline Lokal</p>
                            </Link>

                            {/* Item 2 */}
                            <Link
                                href="/mall"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-[#161615]">
                                    <img src="images/icon_bag.png" alt="TokoOnline Mall" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-sm font-regular text-gray-800 dark:text-gray-200">TokoOnline Mall</p>
                            </Link>

                            {/* Item 3 */}
                            <Link
                                href="/pulsa"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-[#161615]">
                                    <img src="images/icon_pulsa.png" alt="Pulsa Tagihan Tiket" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-sm font-regular text-gray-800 dark:text-gray-200">Pulsa, Tagihan, dan Tiket</p>
                            </Link>

                            {/* Item 4 */}
                            <Link
                                href="/flash-sale"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-[#161615]">
                                    <img src="images/icon_flashsale.png" alt="Flash Sale" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-sm font-regular text-gray-800 dark:text-gray-200">Flash Sale</p>
                            </Link>

                            {/* Item 5 */}
                            <Link
                                href="/supermarket"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-[#161615]">
                                    <img src="images/icon_supermarket.png" alt="Supermarket" className="h-8 w-10" />
                                </div>
                                <p className="mt-2 text-sm font-regular text-gray-800 dark:text-gray-200">TokoOnline Supermarket</p>
                            </Link>

                            {/* Item 6 */}
                            <Link
                                href="/kelola"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-[#161615]">
                                    <img src="images/icon_kelola.png" alt="Dikelola TokoOnline" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-sm font-regular text-gray-800 dark:text-gray-200">Dikelola TokoOnline</p>
                            </Link>

                            {/* Item 7 */}
                            <Link
                                href="/diskon"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-[#161615]">
                                    <img src="images/icon_fitcheck.png" alt="FitCheck Diskon" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-sm font-regular text-gray-800 dark:text-gray-200">FitCheck Diskon 35%</p>
                            </Link>

                            {/* Item 8 */}
                            <Link
                                href="/gratis-ongkir"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-[#161615]">
                                    <img src="images/icon_voucher.png" alt="Gratis Ongkir" className=" h-8 w-8.5" />
                                </div>
                                <p className="mt-2 text-sm font-regular text-gray-800 dark:text-gray-200">Gratis Ongkir & Voucher</p>
                            </Link>

                            {/* Item 9 */}
                            <Link
                                href="/berkah"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-[#161615]">
                                    <img src="images/icon_berkah.png" alt="TokoOnline Berkah" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-sm font-regular text-gray-800 dark:text-gray-200">TokoOnline Berkah</p>
                            </Link>

                            {/* Item 10 */}
                            <Link
                                href="/semua"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-[#161615]">
                                    <img src="images/icon_promo.png" alt="Semua Promo" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-sm font-regular text-gray-800 dark:text-gray-200">Semua Promo</p>
                            </Link>
                        </div>
                    </div>
                </section >

                {/* Kategori Section (Shopee-style grid) */}
                <section className="py-0">
                    <div className="max-w-6xl bg-white dark:bg-[#161615] rounded-xl mx-auto shadow-sm border border-gray-200 dark:border-gray-700 relative group">

                        {/* Header */}
                        <div className="p-6 pb-4 flex items-center justify-between">
                            <h2 className="text-xl text-gray-600 font-bold">Kategori</h2>
                        </div>

                        {/* Chevron */}
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/70 p-2 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                            <ChevronRight className="h-6 w-6 text-black" />
                        </button>

                        {/* GRID */}
                        <div className="grid grid-cols-5 lg:grid-cols-10 divide-x divide-y divide-gray-200 dark:divide-gray-700 border-t border-gray-200 dark:border-gray-700">

                            {[
                                { icon: "/icons/kategori/elektronik.png", label: "Elektronik" },
                                { icon: "/icons/kategori/komputer.png", label: "Komputer & Aksesoris" },
                                { icon: "/icons/kategori/hp.png", label: "Handphone & Aksesoris" },
                                { icon: "/icons/kategori/pakaian-pria.png", label: "Pakaian Pria" },
                                { icon: "/icons/kategori/sepatu-pria.png", label: "Sepatu Pria" },
                                { icon: "/icons/kategori/tas-pria.png", label: "Tas Pria" },
                                { icon: "/icons/kategori/aksesoris.png", label: "Aksesoris Fashion" },
                                { icon: "/icons/kategori/jam.png", label: "Jam Tangan" },
                                { icon: "/icons/kategori/kesehatan.png", label: "Kesehatan" },
                                { icon: "/icons/kategori/hobi.png", label: "Hobi & Koleksi" },
                                // Duplicate row
                                { icon: "/icons/kategori/elektronik.png", label: "Elektronik" },
                                { icon: "/icons/kategori/komputer.png", label: "Komputer & Aksesoris" },
                                { icon: "/icons/kategori/hp.png", label: "Handphone & Aksesoris" },
                                { icon: "/icons/kategori/pakaian-pria.png", label: "Pakaian Pria" },
                                { icon: "/icons/kategori/sepatu-pria.png", label: "Sepatu Pria" },
                                { icon: "/icons/kategori/tas-pria.png", label: "Tas Pria" },
                                { icon: "/icons/kategori/aksesoris.png", label: "Aksesoris Fashion" },
                                { icon: "/icons/kategori/jam.png", label: "Jam Tangan" },
                                { icon: "/icons/kategori/kesehatan.png", label: "Kesehatan" },
                                { icon: "/icons/kategori/hobi.png", label: "Hobi & Koleksi" },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex flex-col items-center py-4 px-2 text-center"
                                >
                                    {/* AREA ICON TINGGI FIXED */}
                                    <div className="h-[90px] flex items-center justify-center">
                                        <div className="rounded-full bg-[#f5f5f5] dark:bg-[#222] p-4 w-20 h-20 flex items-center justify-center">
                                            <img
                                                src={item.icon}
                                                alt={item.label}
                                                className="h-12 w-12 object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* TEKS BEBAS PANJANG TAPI TIDAK GESER ICON */}
                                    <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight text-center px-1">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FLASH SALE SECTION */}
                <section className="bg-white py-10 dark:bg-[#1A1A19]">
                    <div className="container mx-auto max-w-6xl rounded-xl">

                        {/* WRAPPER FLASH SALE */}
                        <div className="bg-white dark:bg-[#252523] rounded-xl p-4 shadow-md border border-[#19140020] dark:border-[#3E3E3A]">

                            {/* Header Flash Sale */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src="images/flashsale.png"
                                        alt="Flash Sale"
                                        className="h-8 w-auto object-contain"
                                    />

                                    {/* Countdown */}
                                    <div className="flex px-2 py-2 space-x-1 text-white font-medium">
                                        {[timeLeft.h, timeLeft.m, timeLeft.s].map((t, i) => (
                                            <span
                                                key={i}
                                                className="bg-[#191919] dark:bg-[#000] w-7 h-6.5 flex items-center justify-center rounded text-sm"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Lihat Semua */}
                                <Link
                                    href="/flash-sale"
                                    className="text-green-600 text-sm font-bold flex items-center gap-1"
                                >
                                    <span>Lihat Semua</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                </Link>
                            </div>

                            {/* Scroll Slider */}
                            <div className="relative group">
                                <div
                                    id="flash-sale-scroll"
                                    className="flex overflow-x-auto scrollbar-hide gap-4"
                                >
                                    {(flashSale.length ? flashSale : manualFlashSale).slice(0, 10).map((prod) => {
                                        const stock = prod.stock ?? 0;
                                        const maxStock = prod.max_stock ?? 100;
                                        const stockPercent = Math.max(0, Math.min(100, Math.round((stock / maxStock) * 100)));

                                        const finalPrice = prod.discount_price || prod.price;
                                        const discount = prod.discount_price
                                            ? Math.round(((prod.price - prod.discount_price) / prod.price) * 100)
                                            : null;

                                        return (
                                            <Link
                                                href={`/products/${prod.slug}`}
                                                key={prod.id}
                                                className="min-w-[170px] max-w-[170px] bg-white dark:bg-[#2A2A28] rounded-lg border border-gray-300 dark:border-gray-400 flex flex-col"
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={prod.image || '/images/placeholder.jpg'}
                                                        className="w-full h-[150px] object-cover rounded-t-lg object-center"
                                                    />

                                                    {discount && (
                                                        <span className="absolute right-2 top-2 bg-[#FFCE00] text-black text-[10px] px-2 py-[2px] font-extrabold rounded-sm">
                                                            -{discount}%
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="p-3 flex flex-col min-h-[95px] items-center text-center">
                                                    <p className="text-xl font-semibold text-green-600 leading-tight">
                                                        Rp {finalPrice.toLocaleString("id-ID")}
                                                    </p>

                                                    <div className="w-full mt-2">
                                                        <div className="w-full bg-green-200 dark:bg-green-600 h-4.5 rounded-full overflow-hidden relative">
                                                            <div
                                                                className="h-full bg-green-600 transition-all duration-700"
                                                                style={{ width: `${stockPercent}%` }}
                                                            ></div>

                                                            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                                                                STOK TERBATAS
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* CHEVRONS */}
                                <div className="absolute inset-0 pointer-events-none group">
                                    <button
                                        onClick={() =>
                                            document
                                                .getElementById("flash-sale-scroll")
                                                ?.scrollBy({ left: -600, behavior: "smooth" })
                                        }
                                        className="pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#333]/90 shadow-md p-3 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:scale-110 transition-all duration-300"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>

                                    <button
                                        onClick={() =>
                                            document
                                                .getElementById("flash-sale-scroll")
                                                ?.scrollBy({ left: 600, behavior: "smooth" })
                                        }
                                        className="pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#333]/90 shadow-md p-3 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:scale-110 transition-all duration-300"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* New Arrivals */}
                < section className="py-12" >
                    <div className="container mx-auto px-4">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">Produk Terbaru</h2>
                                <p className="text-[#706f6c] dark:text-[#A1A09A]">
                                    Produk baru yang baru saja tiba
                                </p>
                            </div>
                            <Link
                                href="/products?sort=newest"
                                className="flex items-center gap-1 text-[#F53003] hover:underline dark:text-[#FF4433]"
                            >
                                Lihat Semua
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {newProducts.length > 0 ? (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {newProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-[#19140035] p-8 text-center dark:border-[#3E3E3A]">
                                <p className="text-[#706f6c] dark:text-[#A1A09A]">Belum ada produk baru</p>
                            </div>
                        )}
                    </div>
                </section >

                {/* CTA Section */}
                < section className="bg-gradient-to-r from-[#1b1b18] to-[#2d2d2a] py-16 text-white" >
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="mb-4 text-3xl font-bold">
                            Bergabung dengan Ribuan Pelanggan Puas
                        </h2>
                        <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
                            Dapatkan akses eksklusif ke promo dan penawaran spesial dengan mendaftar sekarang.
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 rounded-sm bg-[#F53003] px-8 py-3 font-medium hover:bg-[#e02b00]"
                        >
                            Daftar Sekarang
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section >

                {/* Footer */}
                < footer className="border-t border-[#19140035] bg-white py-8 dark:border-[#3E3E3A] dark:bg-[#161615]" >
                    <div className="container mx-auto px-4">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div>
                                <h3 className="mb-4 text-xl font-bold">TokoOnline</h3>
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                    Platform belanja online terpercaya dengan berbagai produk berkualitas.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold">Menu</h4>
                                <ul className="space-y-2">
                                    <li><Link href="/" className="text-sm hover:text-[#F53003] dark:hover:text-[#FF4433]">Home</Link></li>
                                    <li><Link href="/products" className="text-sm hover:text-[#F53003] dark:hover:text-[#FF4433]">Produk</Link></li>
                                    <li><Link href="/categories" className="text-sm hover:text-[#F53003] dark:hover:text-[#FF4433]">Kategori</Link></li>
                                    <li><Link href="/about" className="text-sm hover:text-[#F53003] dark:hover:text-[#FF4433]">Tentang Kami</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold">Bantuan</h4>
                                <ul className="space-y-2">
                                    <li><Link href="/contact" className="text-sm hover:text-[#F53003] dark:hover:text-[#FF4433]">Kontak</Link></li>
                                    <li><Link href="/faq" className="text-sm hover:text-[#F53003] dark:hover:text-[#FF4433]">FAQ</Link></li>
                                    <li><Link href="/shipping" className="text-sm hover:text-[#F53003] dark:hover:text-[#FF4433]">Pengiriman</Link></li>
                                    <li><Link href="/returns" className="text-sm hover:text-[#F53003] dark:hover:text-[#FF4433]">Pengembalian</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold">Legal</h4>
                                <ul className="space-y-2">
                                    <li><Link href="/privacy" className="text-sm hover:text-[#F53003] dark:hover:text-[#FF4433]">Privacy Policy</Link></li>
                                    <li><Link href="/terms" className="text-sm hover:text-[#F53003] dark:hover:text-[#FF4433]">Terms of Service</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-[#19140035] pt-8 text-center text-sm text-[#706f6c] dark:border-[#3E3E3A] dark:text-[#A1A09A]">
                            © {new Date().getFullYear()} TokoOnline. All rights reserved.
                        </div>
                    </div>
                </footer >
            </div >
        </>
    );
}

// Product Card Component
function ProductCard({ product }: { product: HomePageProps['featuredProducts'][0] }) {
    const finalPrice = product.discount_price || product.price;
    const hasDiscount = product.discount_price && product.discount_price < product.price;

    return (
        <Link href={`/products/${product.slug}`} className="group">
            <div className="overflow-hidden rounded-lg border border-[#19140035] bg-white transition-all hover:shadow-lg dark:border-[#3E3E3A] dark:bg-[#161615]">
                <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                        src={product.image || '/images/placeholder.jpg'}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    {hasDiscount && (
                        <span className="absolute left-2 top-2 rounded bg-[#F53003] px-2 py-1 text-xs font-medium text-white">
                            Sale
                        </span>
                    )}
                </div>
                <div className="p-4">
                    <span className="mb-1 block text-xs text-[#706f6c] dark:text-[#A1A09A]">
                        {product.category.name}
                    </span>
                    <h3 className="mb-2 line-clamp-1 font-medium group-hover:text-[#F53003] dark:group-hover:text-[#FF4433]">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                                Rp {finalPrice.toLocaleString('id-ID')}
                            </span>
                            {hasDiscount && (
                                <span className="text-sm text-[#706f6c] line-through dark:text-[#A1A09A]">
                                    Rp {product.price.toLocaleString('id-ID')}
                                </span>
                            )}
                        </div>
                        <button className="rounded-full bg-[#1b1b18] p-2 text-white hover:bg-black dark:bg-[#EDEDEC] dark:text-[#1C1C1A] dark:hover:bg-white">
                            <ShoppingCart className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

// Category Card Component
function CategoryCard({ category }: { category: HomePageProps['categories'][0] }) {
    return (
        <Link href={`/categories/${category.slug}`} className="group">
            <div className="rounded-lg border border-[#19140035] bg-white p-6 text-center transition-all hover:border-[#F53003] hover:shadow-md dark:border-[#3E3E3A] dark:bg-[#161615] dark:hover:border-[#FF4433]">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F53003]/10 mx-auto dark:bg-[#FF4433]/10">
                    <span className="text-xl">🛍️</span>
                </div>
                <h3 className="font-semibold group-hover:text-[#F53003] dark:group-hover:text-[#FF4433]">
                    {category.name}
                </h3>
                <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                    {category.products_count} produk
                </p>
            </div>
        </Link>
    );
}