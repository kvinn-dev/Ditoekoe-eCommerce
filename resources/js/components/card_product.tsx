import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

type Product = {
    id: number;
    slug: string;
    name: string;
    price: number | string;
    discount_price?: number | string | null;
    price_formatted?: string | null;
    discount_price_formatted?: string | null;
    discount: number;
    hasDiscount: boolean;
    originalPrice: number;
    discountPrice: number;
    originalPriceFormatted?: string;
    finalPriceFormatted: string;
    sold: number;
    stock: number;
    image: string;
    category?: {
        id: number;
        name: string;
        slug: string;
    };
};

type PageProps = {
    products?: Product[];
};

const ITEMS_PER_LOAD = 30;

function formatRupiah(amount: number | null | undefined) {
    if (!amount) return 'Rp0';

    const intAmount = Math.round(amount);

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    })
        .format(intAmount)
        .replace(/\u00A0/g, '');
}

export default function CardProducts() {
    const { products = [] } = usePage<PageProps>().props;

    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

    const visibleProducts = products.slice(0, visibleCount);
    const canLoadMore = visibleCount < products.length;

    const processedProducts = visibleProducts.map((p) => {
        const originalPrice = Number(p.price) || 0;

        const discountPriceRaw =
            p.discount_price !== null && p.discount_price !== undefined
                ? Number(p.discount_price)
                : null;

        const hasDiscount =
            discountPriceRaw !== null &&
            !Number.isNaN(discountPriceRaw) &&
            discountPriceRaw > 0 &&
            discountPriceRaw < originalPrice;

        const discountPercent = hasDiscount
            ? Math.round(((originalPrice - discountPriceRaw) / originalPrice) * 100)
            : 0;

        const finalPrice = hasDiscount ? discountPriceRaw : originalPrice;

        return {
            ...p,
            originalPrice,
            discountPrice: discountPriceRaw,
            hasDiscount,
            discountPercent,
            finalPrice,
            originalPriceFormatted: formatRupiah(originalPrice),
            finalPriceFormatted: formatRupiah(finalPrice),
        };
    });

    return (
        <div className="min-h-screen text-gray-900">
            <section className="bg-white dark:bg-[#1A1A19]">
                <div className="container mx-auto max-w-6xl py-5">
                    <div className="mb-10">
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                            {processedProducts.map((p) => {
                                const sold = p.sold ?? 0;

                                return (
                                    <Link
                                        key={p.id}
                                        href={`/product/${p.slug}`}
                                        className="relative rounded-xl border border-gray-200 bg-white transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-sm dark:border-[#252523] dark:bg-[#1A1A19]"
                                    >
                                        {p.hasDiscount && (
                                            <div className="absolute top-3 left-3 z-20">
                                                <div className="discount-wrapper-fs">
                                                    <span className="discount-dark-fs"></span>
                                                    <span className="discount-light-fs">
                                                        -{p.discountPercent}%
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="relative h-44 w-full overflow-hidden rounded-t-xl">
                                            <img
                                                src={p.image ?? '/images/placeholder.png'}
                                                alt={p.name ?? '-'}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>

                                        <div className="mb-3 px-2.5 py-2.5">
                                            <h3 className="mb-1.5 line-clamp-2 min-h-[40px] text-sm font-medium text-gray-800 dark:text-gray-100">
                                                {p.name ?? '-'}
                                            </h3>

                                            <div className="mt-3 flex gap-2">
                                                <div className="flex-1">
                                                    <div className="mb-1 flex flex-col gap-0.5">
                                                        {p.hasDiscount ? (
                                                            <div className="text-[12px] leading-tight text-gray-400 line-through">
                                                                {p.originalPriceFormatted}
                                                            </div>
                                                        ) : (
                                                            <div className="invisible text-[12px] leading-tight">
                                                                placeholder
                                                            </div>
                                                        )}

                                                        <div className="text-[18px] leading-tight font-semibold text-green-600">
                                                            {p.finalPriceFormatted}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="mb-0.5 text-[11px] text-gray-500">
                                                            Terjual {sold} / {p.stock}
                                                        </div>

                                                        <div className="h-2 w-[100px] max-w-full rounded-full bg-gray-200">
                                                            <div
                                                                className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                                                                style={{
                                                                    width: p.stock
                                                                        ? `${Math.min((sold / p.stock) * 100, 100)}%`
                                                                        : '0%',
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex w-[80px] flex-col items-end justify-between">
                                                    <div className="flex gap-3 px-1 pt-1">
                                                        <button
                                                            type="button"
                                                            className="flex h-7.5 w-7.5 items-center justify-center rounded-md border border-green-600/50 transition hover:bg-gray-100"
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

                                                        <button
                                                            type="button"
                                                            className="flex h-7.5 w-7.5 items-center justify-center rounded-md border border-green-600/50 transition hover:bg-gray-100"
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

                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            router.post('/cart/add', { product_id: p.id });
                                                        }}
                                                        disabled={p.stock <= 0}
                                                        className="w-full rounded-md bg-green-600 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:bg-gray-400"
                                                    >
                                                        BELI
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {canLoadMore && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_LOAD)}
                                    className="rounded-lg border border-green-600 px-16 py-2.5 font-semibold text-green-700 transition hover:bg-green-100/50"
                                >
                                    Muat Lebih Banyak
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}