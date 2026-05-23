import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from "react";
import { type SharedData } from '@/types';
import { ChevronRight, ChevronLeft, ShoppingCart, Star, Truck, Shield, Clock } from 'lucide-react';
import NavMain from "@/components/nav-main";
import { NavFooter } from '@/components/nav-footer';
import CardProducts from '@/components/card_product';

const bannerData = [
    {
        id: 1,
        title: "Promo Guncang 12.12",
        subtitle: "HALEON",
        slug: "banner-01",
        src: "images/banner/01.webp",
        href: "flash-sale",
    },
    {
        id: 2,
        title: "Flash Sale Akhir Tahun",
        subtitle: "SENSODYNE",
        slug: "banner-02",
        src: "images/banner/02.webp",
    },
    {
        id: 3,
        title: "Paket Hemat Keluarga",
        subtitle: "PARAMONT",
        slug: "banner-03",
        src: "images/banner/03.webp",
    },
    {
        id: 4,
        title: "Paket Hemat Keluarga",
        subtitle: "PARAMONT",
        slug: "banner-04",
        src: "images/banner/04.webp",
    }
];

interface FlashSaleProduct {
    id: number;
    name: string;
    slug: string;
    price: number;
    discount_price: number | null;
    discount?: number;
    image: string | null;
    category: {
        name: string;
        slug: string;
    };
    stock?: number;
    sold?: number;
    progress?: number;
}

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
    topProducts: any[];
}

export default function Home({
    featuredProducts = [],
    newProducts = [],
    categories = [],
    topProducts = [],
}: HomePageProps) {
    /* ================= STATE ================= */
    const [flashSale, setFlashSale] = useState<any[]>([]);
    const [currentSlide, setCurrentSlide] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const total = bannerData.length;
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const { auth } = usePage<SharedData>().props;

    // Banner navigation with transition lock
    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide(prev => prev + 1);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide(prev => prev - 1);
    };

    const goToSlide = (index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide(index);
    };

    // Auto-play
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentSlide, isAutoPlaying]);

    // Pause auto-play saat hover
    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(true);

    /* ================= FETCH FLASH SALE ================= */
    useEffect(() => {
        let isMounted = true;

        const fetchFlashSale = async () => {
            try {
                const res = await fetch('/flash-sale/batch?page=1', {
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (!res.ok) return;

                const data = await res.json();

                if (isMounted && Array.isArray(data?.products)) {
                    setFlashSale(data.products);
                }
            } catch (error) {
                console.error('Flash sale fetch failed:', error);
            }
        };

        fetchFlashSale();

        return () => {
            isMounted = false;
        };
    }, []);

    /* ================= DATA SOURCE ================= */
    const flashSaleData = flashSale;
    const ITEM_WIDTH = 170;
    const ITEM_GAP = 16;

    const useCategorySlider = (ITEM_WIDTH: number, GAP: number) => {
        const ref = useRef<HTMLDivElement>(null);
        const [canPrev, setCanPrev] = useState(false);
        const [canNext, setCanNext] = useState(false);

        const updateArrows = () => {
            const el = ref.current;
            if (!el) return;

            setCanPrev(el.scrollLeft > 0);
            setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
        };

        useEffect(() => {
            const el = ref.current;
            if (!el) return;

            updateArrows();

            let ticking = false;

            const onScroll = () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateArrows();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            el.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", updateArrows);

            return () => {
                el.removeEventListener("scroll", onScroll);
                window.removeEventListener("resize", updateArrows);
            };
        }, []);

        const scroll = (direction: "left" | "right") => {
            const el = ref.current;
            if (!el) return;

            const MOVE_COL = 5;
            const distance = MOVE_COL * (ITEM_WIDTH + GAP);

            el.scrollBy({
                left: direction === "right" ? distance : -distance,
                behavior: "smooth",
            });
        };

        return { ref, canPrev, canNext, scroll };
    };

    const categorySlider = useCategorySlider(ITEM_WIDTH, ITEM_GAP);

    const categoryItems = [
        { icon: "images/category/00001.webp", label: "Elektronik" },
        { icon: "images/category/00002.webp", label: "Komputer & Aksesoris" },
        { icon: "images/category/00003.webp", label: "Handphone & Aksesoris" },
        { icon: "images/category/00004.webp", label: "Pakaian Pria" },
        { icon: "images/category/00005.webp", label: "Sepatu Pria" },
        { icon: "images/category/00006.webp", label: "Tas Pria" },
        { icon: "images/category/00007.webp", label: "Aksesoris Fashion" },
        { icon: "images/category/00008.webp", label: "Jam Tangan" },
        { icon: "images/category/00009.webp", label: "Kesehatan" },
        { icon: "images/category/00010.webp", label: "Hobi & Koleksi" },
        { icon: "images/category/00011.webp", label: "Makanan & Minuman" },
        { icon: "images/category/00012.webp", label: "Perawatan & Kecantikan" },
        { icon: "images/category/00013.webp", label: "Perlengkapan Rumah" },
        { icon: "images/category/00014.webp", label: "Pakaian Wanita" },
        { icon: "images/category/00015.webp", label: "Fashion Muslim" },
        { icon: "images/category/00016.webp", label: "Fashion Bayi & Anak" },
        { icon: "images/category/00017.webp", label: "Ibu & Bayi" },
        { icon: "images/category/00018.webp", label: "Sepatu Wanita" },
        { icon: "images/category/00019.webp", label: "Tas Wanita" },
        { icon: "images/category/00020.webp", label: "Otomotif" },
        { icon: "images/category/00021.webp", label: "Olahraga Outdoor" },
        { icon: "images/category/00022.webp", label: "Souvenir & Perlengkapan" },
        { icon: "images/category/00023.webp", label: "Voucher" },
        { icon: "images/category/00024.webp", label: "Buku & Alat Tulis" },
        { icon: "images/category/00025.webp", label: "Fotografi" },
        { icon: "images/category/00026.webp", label: "Deals Sekitarmu" },
    ];

    const ITEMS_PER_PAGE = 20;
    const [page, setPage] = useState(0);

    const totalPages = Math.ceil(categoryItems.length / ITEMS_PER_PAGE);

    const visibleItems = categoryItems.slice(
        page * ITEMS_PER_PAGE,
        (page + 1) * ITEMS_PER_PAGE
    );

    const canPrev = page > 0;
    const canNext = page < totalPages - 1;

    const useTopProductSlider = () => {
        const ref = useRef<HTMLDivElement>(null);
        const [canPrev, setCanPrev] = useState(false);
        const [canNext, setCanNext] = useState(true);

        const updateArrows = () => {
            const el = ref.current;
            if (!el) return;
            setCanPrev(el.scrollLeft > 0);
            setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
        };

        useEffect(() => {
            updateArrows();
            const el = ref.current;
            if (!el) return;
            let ticking = false;

            const onScroll = () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateArrows();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            el.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", updateArrows);
            return () => {
                el.removeEventListener("scroll", updateArrows);
                window.removeEventListener("resize", updateArrows);
            };
        }, []);

        const scroll = (direction: "left" | "right") => {
            const el = ref.current;
            if (!el) return;

            const ITEMS_PER_SCROLL = 3;

            const distance =
                (ITEM_WIDTH + ITEM_GAP) * Math.max(1, ITEMS_PER_SCROLL);

            el.scrollBy({
                left: direction === "right" ? distance : -distance,
                behavior: "smooth",
            });
        };

        return { ref, canPrev, canNext, scroll };
    };

    const topProductSlider = useTopProductSlider();

    const useChevronSlider = (deps: any[] = []) => {
        const ref = useRef<HTMLDivElement>(null);
        const [canPrev, setCanPrev] = useState(false);
        const [canNext, setCanNext] = useState(false);

        const updateArrows = () => {
            const el = ref.current;
            if (!el) return;

            const { scrollLeft, clientWidth, scrollWidth } = el;

            setCanPrev(scrollLeft > 0);
            setCanNext(scrollLeft + clientWidth < scrollWidth - 1);
        };

        /* 🔑 FIX UTAMA: update setelah data & DOM siap */
        useEffect(() => {
            const el = ref.current;
            if (!el) return;

            requestAnimationFrame(() => {
                updateArrows();
            });
        }, deps);

        useEffect(() => {
            const el = ref.current;
            if (!el) return;

            let ticking = false;

            const onScroll = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        updateArrows();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            el.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", updateArrows);

            return () => {
                el.removeEventListener("scroll", onScroll);
                window.removeEventListener("resize", updateArrows);
            };
        }, []);

        const scroll = (direction: "left" | "right") => {
            const el = ref.current;
            if (!el) return;

            const ITEMS_PER_SCROLL = 3;
            const distance = (ITEM_WIDTH + ITEM_GAP) * ITEMS_PER_SCROLL;

            el.scrollBy({
                left: direction === "right" ? distance : -distance,
                behavior: "smooth",
            });
        };

        return { ref, canPrev, canNext, scroll };
    };

    const flashSlider = useChevronSlider([flashSale.length]);

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
            <Head title="Belanja Online Murah & Aman">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-white text-gray-900 dark:bg-[#1A1A19]">
                {/* Header Navigation */}
                <NavMain />

                {/* Hero Section */}
                <section
                    className="relative mt-15"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Banner */}
                    <div className="group relative mx-4 max-w-6xl md:mx-auto overflow-hidden rounded-xl shadow-lg">
                        <div className="relative h-64 md:h-72 w-full overflow-hidden">
                            <div
                                className="flex h-full"
                                style={{
                                    willChange: "transform",
                                    transform: `translateX(-${currentSlide * 100}%)`,
                                    transition: isTransitioning
                                        ? "transform 1300ms cubic-bezier(0.22,1,0.36,1)"
                                        : "none",
                                }}
                                onTransitionEnd={() => {
                                    // Reset otomatis saat reach clone
                                    if (currentSlide > total) {
                                        setIsTransitioning(false);
                                        setCurrentSlide(1);
                                    } else if (currentSlide === 0) {
                                        setIsTransitioning(false);
                                        setCurrentSlide(total);
                                    } else {
                                        setIsTransitioning(false); // transisi selesai
                                    }
                                }}
                            >
                                {/* Clone last */}
                                <Link
                                    href={`/products/${bannerData[total - 1].slug}`}
                                    className="h-full w-full flex-shrink-0"
                                >
                                    <img
                                        src={bannerData[total - 1].src}
                                        className="h-full w-full object-cover"
                                        alt=""
                                    />
                                </Link>

                                {/* Real slides */}
                                {bannerData.map((banner, index) => (
                                    <Link
                                        key={index}
                                        href={`${banner.href}`}
                                        className="h-full w-full flex-shrink-0"
                                    >
                                        <img
                                            src={banner.src}
                                            alt={`Banner ${index + 1}`}
                                            className="h-full w-full object-cover"
                                            loading={index === 0 ? "eager" : "lazy"}
                                        />
                                    </Link>
                                ))}

                                {/* Clone first */}
                                <Link
                                    href={`/products/${bannerData[0].slug}`}
                                    className="h-full w-full flex-shrink-0"
                                >
                                    <img
                                        src={bannerData[0].src}
                                        className="h-full w-full object-cover"
                                        alt=""
                                    />
                                </Link>
                            </div>
                        </div>

                        {/* CHEVRONS */}
                        <div className="absolute inset-0 pointer-events-none group">
                            <button
                                onClick={() => {
                                    if (isTransitioning) return;
                                    setIsTransitioning(true);
                                    setCurrentSlide(prev => prev - 1);
                                }}
                                className="pointer-events-auto absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#1A1A19]/90 shadow-md p-3 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:scale-110 transition-all duration-300"
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                            </button>

                            <button
                                onClick={() => {
                                    if (isTransitioning) return;
                                    setIsTransitioning(true);
                                    setCurrentSlide(prev => prev + 1);
                                }}
                                className="pointer-events-auto absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#1A1A19]/90 shadow-md p-3 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:scale-110 transition-all duration-300"
                            >
                                <ChevronRight className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                            </button>
                        </div>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-4 z-20 flex gap-1">
                            {bannerData.map((_, index) => {
                                const activeIndex = (currentSlide - 1 + total) % total;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (isTransitioning) return;
                                            setIsTransitioning(true);
                                            setCurrentSlide(index + 1);
                                        }}
                                        className={`h-1.5 w-1.5 rounded-full transition-all 
                            ${index === activeIndex ? "w-0 bg-white" : "bg-white/70"}`}
                                    />
                                );
                            })}
                        </div>

                        {/* Button promo kecil kanan bawah */}
                        <Link
                            href="/promotions"
                            className="absolute bottom-4 right-4 z-20 rounded-sm bg-black px-2 py-1 text-xs font-regular text-white"
                        >
                            Lihat promo lainnya
                        </Link>

                        {/* Progress bar (hidden) */}
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20 hidden">
                            <div
                                className="h-full bg-green-600 transition-all duration-5000"
                                style={{
                                    width: isAutoPlaying ? "100%" : "0%",
                                    transitionDuration: isAutoPlaying ? "5s" : "0s",
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-10">
                    <div className="container mx-auto px-18">
                        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 text-center">

                            {/* Item 1 */}
                            <Link
                                href="/lokal"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-[#252523] p-3 bg-white dark:bg-[#1A1A19]">
                                    <img src="images/icon/icon_local.png" alt="Ditoekoe Pilih Lokal" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-[13px] font-regular text-gray-900 dark:text-gray-300">Ditoekoe Pilih Lokal</p>
                            </Link>

                            {/* Item 2 */}
                            <Link
                                href="/mall"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-[#252523] p-3 bg-white dark:bg-[#1A1A19]">
                                    <img src="images/icon/icon_bag.png" alt="Ditoekoe Mall" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-[13px] font-regular text-gray-900 dark:text-gray-300">Ditoekoe Mall</p>
                            </Link>

                            {/* Item 3 */}
                            <Link
                                href="/pulsa"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-[#252523] p-3 bg-white dark:bg-[#1A1A19]">
                                    <img src="images/icon/icon_pulsa.png" alt="Pulsa Tagihan Tiket" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-[13px] font-regular text-gray-900 dark:text-gray-300">Pulsa, Tagihan, dan Tiket</p>
                            </Link>

                            {/* Item 4 */}
                            <Link
                                href="/flash-sale"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-[#252523] p-3 bg-white dark:bg-[#1A1A19]">
                                    <img src="images/icon/icon_flashsale.png" alt="Flash Sale" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-[13px] font-regular text-gray-900 dark:text-gray-300">Flash Sale</p>
                            </Link>

                            {/* Item 5 */}
                            <Link
                                href="/supermarket"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-[#252523] p-3 bg-white dark:bg-[#1A1A19]">
                                    <img src="images/icon/icon_supermarket.png" alt="Supermarket" className="h-8 w-10" />
                                </div>
                                <p className="mt-2 text-[13px] font-regular text-gray-900 dark:text-gray-300">Ditoekoe Supermarket</p>
                            </Link>

                            {/* Item 6 */}
                            <Link
                                href="/kelola"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-[#252523] p-3 bg-white dark:bg-[#1A1A19]">
                                    <img src="images/icon/icon_kelola.png" alt="Dikelola Ditoekoe" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-[13px] font-regular text-gray-900 dark:text-gray-300">Dikelola Ditoekoe</p>
                            </Link>

                            {/* Item 7 */}
                            <Link
                                href="/diskon"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-[#252523] p-3 bg-white dark:bg-[#1A1A19]">
                                    <img src="images/icon/icon_fitcheck.png" alt="FitCheck Diskon" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-[13px] font-regular text-gray-900 dark:text-gray-300">FitCheck Diskon 35%</p>
                            </Link>

                            {/* Item 8 */}
                            <Link
                                href="/gratis-ongkir"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-[#252523] p-3 bg-white dark:bg-[#1A1A19]">
                                    <img src="images/icon/icon_voucher.png" alt="Gratis Ongkir" className=" h-8 w-8.5" />
                                </div>
                                <p className="mt-2 text-[13px] font-regular text-gray-900 dark:text-gray-300">Gratis Ongkir & Voucher</p>
                            </Link>

                            {/* Item 9 */}
                            <Link
                                href="/berkah"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-[#252523] p-3 bg-white dark:bg-[#1A1A19]">
                                    <img src="images/icon/icon_berkah.png" alt="Ditoekoe Berkah" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-[13px] font-regular text-gray-900 dark:text-gray-300">Ditoekoe Berkah</p>
                            </Link>

                            {/* Item 10 */}
                            <Link
                                href="/semua"
                                className="flex flex-col items-center">
                                <div className="rounded-xl border border-gray-200 dark:border-[#252523] p-3 bg-white dark:bg-[#1A1A19]">
                                    <img src="images/icon/icon_promo.png" alt="Semua Promo" className="h-8 w-8" />
                                </div>
                                <p className="mt-2 text-[13px] font-regular text-gray-900 dark:text-gray-300">Semua Promo</p>
                            </Link>
                        </div>
                    </div>
                </section >

                {/* Category Section */}
                <section className="py-0 relative">
                    <div className="max-w-6xl mx-auto bg-white dark:bg-[#1A1A19] rounded-xl shadow-sm border border-gray-200 dark:border-[#252523] relative group overflow-hidden">

                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-[#252523]">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Kategori
                            </h2>
                        </div>

                        {/* Chevron Left */}
                        {categorySlider.canPrev && (
                            <button
                                onClick={() => categorySlider.scroll("left")}
                                className="pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#1A1A19]/90 shadow-md p-3 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:scale-110 transition-all duration-300"
                            >
                                <ChevronLeft className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                            </button>
                        )}

                        {categorySlider.canNext && (
                            <button
                                onClick={() => categorySlider.scroll("right")}
                                className="pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#1A1A19]/90 shadow-md p-3 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:scale-110 transition-all duration-300"
                            >
                                <ChevronRight className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                            </button>
                        )}

                        {/* Scroll Wrapper */}
                        <div ref={categorySlider.ref} className="overflow-x-hidden">

                            {/* GRID */}
                            <div
                                className="inline-grid grid-rows-2 auto-cols-[10%] divide-x divide-y divide-gray-300 dark:divide-[#252523]"
                                style={{ gridAutoFlow: "column" }}
                            >
                                {categoryItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center bg-white dark:bg-[#1A1A19]"
                                    >
                                        {/* ICON AREA (FIX HEIGHT) */}
                                        <div className="flex items-center justify-center h-[104px]">
                                            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-[#1A1A19] flex items-center justify-center">
                                                <img
                                                    src={item.icon}
                                                    alt={item.label}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>
                                        </div>

                                        {/* TEXT AREA (FIX HEIGHT) */}
                                        <div className="h-[40px] px-2 mb-1.5 flex items-start justify-center text-center">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight line-clamp-2">
                                                {item.label}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Flash Sale Section */}
                <section className="bg-white py-10 dark:bg-[#1A1A19]">
                    <div className="container mx-auto max-w-6xl rounded-xl">
                        {/* WRAPPER FLASH SALE */}
                        <div className="bg-white dark:bg-[#1A1A19] rounded-xl p-4 shadow-sm border border-gray-200 dark:border-[#252523]">
                            {/* Header Flash Sale */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <img
                                        src="images/icon/flashsale.png"
                                        alt="Flash Sale"
                                        className="h-8 w-auto object-contain"
                                    />

                                    {/* Countdown */}
                                    <div className="flex px-0.5 py-2 space-x-1 text-white font-medium -mt-1">
                                        {[timeLeft.h, timeLeft.m, timeLeft.s].map((t, i) => (
                                            <span
                                                key={i}
                                                className="bg-[#191919] dark:bg-[#000] w-6 h-5 flex items-center justify-center rounded text-xs"
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

                            <div className="relative group pointer-events-none">
                                {/* Scroll Slider */}
                                <div
                                    ref={flashSlider.ref}
                                    className="flex overflow-x-auto overflow-y-hidden scroll-smooth will-change-transform translate-z-0 px-2 pb-4 gap-4 scrollbar-hide pointer-events-auto"
                                >
                                    {flashSale.length > 0 &&
                                        flashSale.map((prod) => {
                                            const stock = Number(prod.stock ?? 0);
                                            const maxStock = Number(prod.max_stock ?? 100);

                                            const stockPercent =
                                                maxStock > 0
                                                    ? Math.max(0, Math.min(100, Math.round((stock / maxStock) * 100)))
                                                    : 0;

                                            const finalPrice =
                                                typeof prod.discount_price === 'number'
                                                    ? prod.discount_price
                                                    : prod.price;

                                            const discount =
                                                typeof prod.discount_price === 'number' && prod.price > 0
                                                    ? Math.round(((prod.price - prod.discount_price) / prod.price) * 100)
                                                    : null;

                                            return (
                                                <Link
                                                    href={`/product/${prod.slug}`}
                                                    key={prod.id}
                                                    className="min-w-[170px] max-w-[170px] snap-start bg-white dark:bg-[#1A1A19] rounded-lg border border-gray-300 dark:border-[#252523] flex flex-col"
                                                >
                                                    <div className="relative">
                                                        <img
                                                            src={prod.image || ''}
                                                            alt={prod.name}
                                                            className="w-full h-[150px] object-cover rounded-t-lg object-center"
                                                        />

                                                        {discount !== null && discount > 0 && (
                                                            <div className="discount-wrapper">
                                                                <span className="discount-dark"></span>
                                                                <span className="discount-light">-{discount}%</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="px-3 mb-[-15px] mt-2.5 flex flex-col min-h-[85px] items-center text-center">
                                                        <p className="text-[19px] font-medium text-green-600 leading-tight">
                                                            Rp{finalPrice.toLocaleString('id-ID')}
                                                        </p>

                                                        <div className="w-full mt-2">
                                                            <div className="w-full bg-green-200 dark:bg-green-600 h-3.5 rounded-sm overflow-hidden relative">
                                                                <div
                                                                    className="h-full bg-green-600 transition-all duration-700"
                                                                    style={{ width: `${stockPercent}%` }}
                                                                />
                                                                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white">
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
                                {flashSlider.canPrev && (
                                    <button
                                        onClick={() => flashSlider.scroll('left')}
                                        className="pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#1A1A19]/90 shadow-md p-3 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:scale-110 transition-all duration-300"
                                    >
                                        <ChevronLeft className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                                    </button>
                                )}

                                {flashSlider.canNext && (
                                    <button
                                        onClick={() => flashSlider.scroll('right')}
                                        className="pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#1A1A19]/90 shadow-md p-3 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:scale-110 transition-all duration-300"
                                    >
                                        <ChevronRight className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Top Product Section */}
                < section className="bg-white py-0 mb-10 dark:bg-[#1A1A19]" >
                    <div className="container mx-auto max-w-6xl rounded-xl">
                        <div className="bg-white dark:bg-[#1A1A19] rounded-xl px-6 py-4 shadow-sm border border-gray-200 dark:border-[#252523]">

                            {/* HEADER */}
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Produk Terlaris
                                </h2>

                                <Link
                                    href="/top-product"
                                    className="text-green-600 text-sm font-bold flex items-center gap-1"
                                >
                                    Lihat Semua
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

                            {/* WRAPPER */}
                            <div className="relative group">

                                {/* SCROLL VIEW */}
                                <div
                                    ref={topProductSlider.ref}
                                    id="top-products-scroll"
                                    className="flex overflow-x-auto overflow-y-hidden scroll-smooth will-change-transform translate-z-0 pb-4 gap-6 scrollbar-hide"
                                >
                                    {topProducts.map((prod) => (
                                        <Link
                                            key={prod.id}
                                            href={`/product/${prod.slug}`}
                                            className="w-[calc((100%-5*1.5rem)/6)] flex-shrink-0"
                                        >
                                            {/* IMAGE */}
                                            <div className="relative w-full h-[160px] overflow-hidden rounded-t-xl">

                                                {/* BADGE TOP */}
                                                <div className="absolute top-0 left-0 z-20 w-[35px] h-[44px] pointer-events-none">
                                                    <svg className="absolute inset-0" viewBox="0 0 60 60">
                                                        <defs>
                                                            <linearGradient id="topGradient" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="0%" stopColor="#22c55e" />
                                                                <stop offset="100%" stopColor="#16a34a" />
                                                            </linearGradient>
                                                        </defs>
                                                        <path
                                                            d="M0 0 H60 V38 C60 41 57 43 54 45 L32 58 C31 58.5 29 58.5 28 58 L6 45 C3 43 0 41 0 38 Z"
                                                            fill="url(#topGradient)"
                                                        />
                                                    </svg>
                                                    <span className="absolute top-[8px] left-1/2 -translate-x-1/2 text-white text-[11px] font-bold tracking-wider">
                                                        TOP
                                                    </span>
                                                </div>

                                                <img
                                                    src={prod.image}
                                                    className="w-full h-full object-cover"
                                                    alt={prod.name}
                                                />

                                                <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white text-[12px] px-2 py-1">
                                                    Penjualan / Bulan {prod.sold}
                                                </div>
                                            </div>

                                            {/* CONTENT */}
                                            <div className="bg-white dark:bg-[#1A1A19] rounded-b-xl px-1 pt-4">
                                                <p
                                                    className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1"
                                                    title={prod.name}
                                                >
                                                    {prod.name}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* CHEVRONS */}
                                {topProductSlider.canPrev && (
                                    <button
                                        onClick={() => topProductSlider.scroll("left")}
                                        className="pointer-events-auto absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#1A1A19]/90 shadow-md p-3 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:scale-110 transition-all duration-300"
                                    >
                                        <ChevronLeft className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                                    </button>
                                )}

                                {topProductSlider.canNext && (
                                    <button
                                        onClick={() => topProductSlider.scroll("right")}
                                        className="pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-[#1A1A19]/90 shadow-md p-3 rounded-full opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 hover:scale-110 transition-all duration-300"
                                    >
                                        <ChevronRight className="h-5 w-5 text-gray-800 dark:text-gray-100" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </section >

                <section className="mt-10">
                    <CardProducts />
                </section>

                {/* FOOTER */}
                <NavFooter />
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
            <div className="overflow-hidden rounded-lg border border-[#19140035] bg-white transition-all hover:shadow-lg dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-[#1A1A19]">
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
                    <h3 className="mb-2 line-clamp-1 font-medium group-hover:text-[#F53003] dark:group-hover:text-[#FF4433] dark:text-white">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-[#1b1b18] dark:text-white">
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
            <div className="rounded-lg border border-[#19140035] bg-white p-6 text-center transition-all hover:border-[#F53003] hover:shadow-md dark:border-[#3E3E3A] dark:bg-[#252523] dark:hover:border-[#FF4433]">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F53003]/10 mx-auto dark:bg-[#FF4433]/10">
                    <span className="text-xl">🛍️</span>
                </div>
                <h3 className="font-semibold group-hover:text-[#F53003] dark:group-hover:text-[#FF4433] dark:text-white">
                    {category.name}
                </h3>
                <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                    {category.products_count} produk
                </p>
            </div>
        </Link>
    );
}