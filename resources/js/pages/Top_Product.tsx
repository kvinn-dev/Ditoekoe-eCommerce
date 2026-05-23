import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef, useMemo } from 'react';
import NavMain from '@/components/nav-main';
import { NavFooter } from '@/components/nav-footer';
import { type SharedData } from '@/types';

export default function TopProduct({
    auth,
    products = [],
}: {
    auth: SharedData['auth']
    products?: any[]
}) {

    const [openMore, setOpenMore] = useState(false)
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })

    /**
     * CATEGORY
     */
    const [activeCategory, setActiveCategory] = useState<string>('all')

    useEffect(() => {
        setActiveCategory('all')
    }, [])

    /**
     * FILTER PRODUK BERDASARKAN CATEGORY
     */
    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return []

        if (activeCategory === 'all') {
            return products
        }

        return products.filter(
            (product) => product?.category?.slug === activeCategory
        )
    }, [activeCategory, products])

    /**
     * LOAD MORE
     */
    const ITEMS_PER_LOAD = 30
    const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_LOAD)

    const visibleProducts = useMemo(() => {
        return filteredProducts.slice(0, visibleCount)
    }, [filteredProducts, visibleCount])

    const canLoadMore = visibleCount < filteredProducts.length

    useEffect(() => {
        setVisibleCount(ITEMS_PER_LOAD)
    }, [activeCategory])

    /**
     * CATEGORY LIST
     */
    const categories = useMemo(() => {
        if (!Array.isArray(products)) return []

        const map = new Map<string, any>()

        products.forEach((p) => {
            if (p?.category?.slug) {
                map.set(p.category.slug, p.category)
            }
        })

        return Array.from(map.values())
    }, [products])

    const MAIN_CATEGORY_LIMIT = 5
    const mainCategories = categories.slice(0, MAIN_CATEGORY_LIMIT)
    const moreCategories = categories.slice(MAIN_CATEGORY_LIMIT)

    const normalizedProducts = useMemo(() => {
        return visibleProducts.map((p) => {
            const originalPrice = Number(p.price ?? 0)
            const discountPrice = Number(p.discount_price ?? originalPrice)

            const hasDiscount =
                p.discount_price !== null &&
                p.discount_price !== undefined &&
                discountPrice < originalPrice

            const discount = hasDiscount
                ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
                : 0

            const sold = Number(p.sold_count ?? 0)
            const stock = Number(p.stock ?? 0)
            const total = stock > 0 ? stock : sold + 1 // anti NaN

            return {
                id: p.id,
                name: p.name,
                slug: p.slug,
                image: p.image || '/images/placeholder.png',

                hasDiscount,
                discount,

                originalPrice,
                discountPrice,

                originalPriceFormatted: `Rp ${originalPrice.toLocaleString('id-ID')}`,
                finalPriceFormatted: `Rp ${(hasDiscount ? discountPrice : originalPrice).toLocaleString('id-ID')}`,

                sold,
                total,
            }
        })
    }, [visibleProducts])

    return (
        <>
            <Head title="Produk Terlaris - Ditoekoe" />

            <div className="min-h-screen text-gray-900">
                <NavMain />

                <section className="bg-white dark:bg-[#1A1A19]">
                    <div className="container mx-auto max-w-6xl">

                        {/* HEADER */}
                        <div className="text-center mb-8 mt-8">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                                Produk Terlaris
                            </h2>
                        </div>

                        {/* CATEGORY FILTER - Toggle Style */}
                        <div className="mb-6">
                            <div className="bg-white dark:bg-[#1A1A19] border border-gray-200 dark:border-[#252523] h-15 rounded-t-lg shadow-sm relative">
                                <div className="flex h-full w-full">

                                    {/* ALL */}
                                    <button
                                        onClick={() => {
                                            setActiveCategory('all')
                                            setOpenMore(false)
                                        }}
                                        className={`relative flex-1 h-full flex items-center justify-center text-[13px] font-medium transition-colors duration-300 z-10 ${activeCategory === 'all'
                                            ? 'text-gray-900 dark:text-gray-100 font-semibold'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}
                                    >
                                        Semua
                                    </button>

                                    {/* MAIN CATEGORIES */}
                                    {mainCategories.map((c, index) => (
                                        <button
                                            key={c.id}
                                            onClick={() => {
                                                setActiveCategory(c.slug)
                                                setOpenMore(false)
                                            }}
                                            className={`relative flex-1 h-full flex items-center justify-center text-[13px] font-medium transition-colors duration-300 z-10 ${activeCategory === c.slug
                                                ? 'text-gray-900 dark:text-gray-100 font-semibold'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                            data-index={index}
                                        >
                                            {c.name}
                                        </button>
                                    ))}

                                    {/* LAINNYA */}
                                    {moreCategories.length > 0 && (
                                        <button
                                            onClick={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect()
                                                setDropdownPos({
                                                    top: rect.bottom + 8,
                                                    left: rect.left,
                                                })
                                                setOpenMore((prev) => !prev)
                                            }}
                                            className={`relative flex-1 h-full flex items-center justify-center gap-1.5 text-[13px] font-medium transition-colors duration-300 z-10 ${openMore
                                                ? 'text-gray-900 dark:text-gray-100 font-semibold'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                        >
                                            Lainnya
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                className={`w-4 h-4 transition-transform duration-200 ${openMore ? 'rotate-180' : ''
                                                    }`}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                                            </svg>
                                        </button>
                                    )}

                                    {/* SLIDING UNDERLINE */}
                                    <div
                                        className="absolute bottom-0 h-1 bg-green-600 transition-all duration-300 ease-out"
                                        style={{
                                            width: `calc(100% / ${1 + mainCategories.length + (moreCategories.length ? 1 : 0)
                                                })`,
                                            transform: `translateX(${activeCategory === 'all'
                                                ? 0
                                                : mainCategories.findIndex(c => c.slug === activeCategory) !== -1
                                                    ? (mainCategories.findIndex(c => c.slug === activeCategory) + 1) * 100
                                                    : (1 + mainCategories.length) * 100
                                                }%)`,
                                        }}
                                    />
                                </div>
                            </div>

                            {/* DROPDOWN LAINNYA */}
                            {openMore && moreCategories.length > 0 && (
                                <div
                                    style={{
                                        top: dropdownPos.top,
                                        left: dropdownPos.left,
                                    }}
                                    className="fixed w-44 bg-white dark:bg-[#1A1A19] border border-gray-200 dark:border-[#252523] rounded-md shadow-xl z-[9999]"
                                >
                                    {moreCategories.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setActiveCategory(item.slug)
                                                setOpenMore(false)
                                            }}
                                            className={`block w-full text-left px-4 py-2.5 text-sm transition ${activeCategory === item.slug
                                                ? 'text-gray-900 dark:text-gray-100 font-semibold bg-green-50'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252523]'
                                                }`}
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* PRODUCTS GRID */}
                        <div className="mb-10">
                            <div
                                className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
                            >
                                {normalizedProducts.map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/product/${p.slug}`}
                                        className="relative bg-white dark:bg-[#1A1A19] rounded-xl border border-gray-200 dark:border-[#252523] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-sm"
                                    >
                                        {/* DISCOUNT BADGE */}
                                        {p.discount > 0 && (
                                            <div className="absolute top-3 left-3 z-20">
                                                <div className="discount-wrapper-fs">
                                                    <span className="discount-dark-fs"></span>
                                                    <span className="discount-light-fs">
                                                        -{p.discount}%
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* IMAGE */}
                                        <div className="relative h-44 w-full overflow-hidden rounded-t-xl">
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* CONTENT */}
                                        <div className="px-2.5 py-2.5 mb-3">
                                            <h3 className="text-sm font-medium line-clamp-2 mb-1.5 min-h-[40px] text-gray-800 dark:text-gray-100">
                                                {p.name}
                                            </h3>

                                            <div className="flex gap-2 mt-3">
                                                {/* LEFT */}
                                                <div className="flex-1">
                                                    {/* PRICE */}
                                                    <div className="mb-1 flex flex-col gap-0.5">
                                                        {/* ORIGINAL PRICE (atau placeholder) */}
                                                        <div
                                                            className={`text-[12px] leading-tight ${p.discount > 0
                                                                    ? 'text-gray-400 line-through'
                                                                    : 'invisible'
                                                                }`}
                                                        >
                                                            Rp {p.originalPrice.toLocaleString('id-ID')}
                                                        </div>

                                                        {/* FINAL PRICE */}
                                                        <div className="text-green-600 font-semibold text-[18px] leading-tight">
                                                            Rp {p.discountPrice.toLocaleString('id-ID')}
                                                        </div>
                                                    </div>

                                                    {/* PROGRESS */}
                                                    <div>
                                                        <div className="text-[11px] text-gray-500 mb-0.5">
                                                            Terjual {p.sold}
                                                        </div>

                                                        <div className="w-[100px] max-w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                                                                style={{
                                                                    width: `${Math.min(
                                                                        (p.sold / p.total) * 100,
                                                                        100
                                                                    )}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* RIGHT */}
                                                <div className="w-[80px] flex flex-col items-end justify-between">
                                                    <div className="pt-1 flex gap-3 px-1">
                                                        {/* FAVORITE */}
                                                        <button
                                                            className="w-7.5 h-7.5 rounded-md border border-green-600/50 flex items-center justify-center hover:bg-gray-100 transition"
                                                            title="Favorit"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={1.5}
                                                                stroke="#16a34a"
                                                                className="size-5"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                                                />
                                                            </svg>
                                                        </button>

                                                        {/* CART */}
                                                        <button
                                                            className="w-7.5 h-7.5 rounded-md border border-green-600/50 flex items-center justify-center hover:bg-gray-100 transition"
                                                            title="Tambah ke Keranjang"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={1.5}
                                                                stroke="#16a34a"
                                                                className="size-5"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {/* BUY */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            router.post('/cart/add', { product_id: p.id })
                                                        }}
                                                        className="w-full bg-green-600 text-white text-xs font-semibold py-1.5 rounded-md hover:bg-green-700 transition"
                                                    >
                                                        BELI
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            {canLoadMore && (
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_LOAD)}
                                        className="px-16 py-2.5 rounded-lg border-1 border-green-600 text-green-700 font-semibold hover:bg-green-100/50 hover:text-green-600 transition-colors duration-300"
                                    >
                                        Muat Lebih Banyak
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <NavFooter />
            </div>
        </>
    );
}