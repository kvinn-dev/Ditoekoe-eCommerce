import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'

type Product = {
  slug: string;
  discount_price: any;
  price: number;
  price_formatted: any;
  discount_price_formatted: any;
  id: number;
  name: string;
  discount: number;
  hasDiscount: boolean
  originalPrice: number;
  discountPrice: number;
  originalPriceFormatted?: string
  finalPriceFormatted: string
  sold: number;
  stock: number;
  image: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
}

type PageProps = {
  products?: Product[]
}

const ITEMS_PER_LOAD = 30

export default function CardProducts() {
  const { products = [] } = usePage<PageProps>().props

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD)

  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD)
  }, [])

  const visibleProducts = products.slice(0, visibleCount)
  const canLoadMore = visibleCount < products.length


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

    function formatRupiah(amount: number | null | undefined) {
      if (!amount) return "Rp0";
      // pastikan angka utuh
      const intAmount = Math.round(amount);
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      })
        .format(intAmount)
        .replace(/\u00A0/g, ''); // hapus spasi
    }
    console.log({
      price: p.price,
      price_formatted: p.price_formatted,
      originalPrice,
    })

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
      <section className="bg-white">
        <div className="container mx-auto max-w-6xl py-5">
          {/* PRODUCTS GRID */}
          <div className="mb-10">
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {processedProducts.map((p) => {
                const sold = p.sold ?? 0

                return (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="relative bg-white rounded-xl border border-gray-200 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-sm"
                  >
                    {/* Badge Diskon */}
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

                    {/* Gambar */}
                    <div className="relative h-44 w-full overflow-hidden rounded-t-xl">
                      <img
                        src={p.image ?? '/images/placeholder.png'}
                        alt={p.name ?? '-'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Info Produk */}
                    <div className="px-2.5 py-2.5 mb-3">
                      <h3 className="text-sm font-medium line-clamp-2 mb-1.5 min-h-[40px] text-gray-800">
                        {p.name ?? '-'}
                      </h3>

                      <div className="flex gap-2 mt-3">
                        {/* LEFT */}
                        <div className="flex-1">
                          {/* PRICE (IDENTIK Flash Sale & Top Product) */}
                          <div className="mb-1 flex flex-col gap-0.5">
                            {p.hasDiscount ? (
                              <div className="text-gray-400 text-[12px] line-through leading-tight">
                                {p.originalPriceFormatted}
                              </div>
                            ) : (
                              <div className="invisible text-[12px] leading-tight">placeholder</div>
                            )}
                            <div className="text-green-600 font-semibold text-[18px] leading-tight">
                              {p.finalPriceFormatted}
                            </div>
                          </div>

                          {/* Progress */}
                          <div>
                            <div className="text-[11px] text-gray-500 mb-0.5">
                              Terjual {sold} / {p.stock}
                            </div>

                            <div className="w-[100px] max-w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                                style={{
                                  width: p.stock
                                    ? `${Math.min((sold / p.stock) * 100, 100)}%`
                                    : '0%',
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="w-[80px] flex flex-col items-end justify-between">
                          <div className="pt-1 flex gap-3 px-1">
                            {/* Favorit */}
                            <button
                              type="button"
                              className="w-7.5 h-7.5 rounded-md border border-green-600/50 flex items-center justify-center hover:bg-gray-100 transition"
                              title="Favorit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#16a34a" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                              </svg>
                            </button>

                            {/* Cart */}
                            <button
                              type="button"
                              className="w-7.5 h-7.5 rounded-md border border-green-600/50 flex items-center justify-center hover:bg-gray-100 transition"
                              title="Tambah ke Keranjang"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#16a34a" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z" />
                              </svg>
                            </button>
                          </div>

                          {/* BELI */}
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              router.post('/cart/add', { product_id: p.id })
                            }}
                            disabled={p.stock <= 0}
                            className="w-full bg-green-600 disabled:bg-gray-400 text-white text-xs font-semibold py-1.5 rounded-md hover:bg-green-700 transition"
                          >
                            BELI
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {canLoadMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_LOAD)}
                  className="px-16 py-2.5 rounded-lg border border-green-600 text-green-700 font-semibold hover:bg-green-100/50 transition"
                >
                  Muat Lebih Banyak
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  )
}
