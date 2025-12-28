import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import NavMain from '@/components/nav-main';
import { NavFooter } from '@/components/nav-footer';
import { type SharedData } from '@/types';

type Product = {
    id: number;
    slug: string;
    name: string;
    price: number;
    price_formatted?: string;
    sold?: number;
    rating?: number;
    review_count?: number;
    stock?: number;
    min_order?: number;
    store?: {
        name?: string;
        rating?: number;
    };
    images?: string[];
    description?: string;
    condition?: string;
    category?: {
        name?: string;
    };
    specifications?: Array<{ key: string; value: string }>;
    features?: string[];
    discount_price?: number;
    discount_price_formatted?: string;
    discount?: number;
    important_info?: ImportantInfoType[];
    image: string;
};

type ImportantInfoType = {
    title: string;
    content: string;
};

export default function ProductView({
    auth,
    product,
    relatedProducts = [],
    viewProducts = [],
}: {
    auth: SharedData['auth'];
    product: Product;
    viewProducts: Product[];
    relatedProducts?: Product[];
}) {
    const minOrder = product.min_order ?? 1;
    const stock = product.stock ?? 0;

    const [products, setProducts] = useState<Product[]>(viewProducts);

    const [openInfoIndex, setOpenInfoIndex] = useState<number | null>(null);

    const [showInfoModal, setShowInfoModal] = useState(false);

    useEffect(() => {
        if (showInfoModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showInfoModal]);

    const [activeInfoIndex, setActiveInfoIndex] = useState(0);

    const [quantity, setQuantity] = useState<number | ''>(minOrder);
    const [activeTab, setActiveTab] = useState<'detail' | 'spec' | 'info'>('detail');
    const [selectedImage, setSelectedImage] = useState(0);

    const ITEMS_PER_LOAD = 10;
    const [displayedRelated, setDisplayedRelated] = useState(relatedProducts.slice(0, ITEMS_PER_LOAD));
    const [hasMore, setHasMore] = useState(relatedProducts.length > ITEMS_PER_LOAD);

    const loadMore = () => {
        const nextItems = relatedProducts.slice(displayedRelated.length, displayedRelated.length + ITEMS_PER_LOAD);
        setDisplayedRelated(prev => [...prev, ...nextItems]);
        if (displayedRelated.length + nextItems.length >= relatedProducts.length) setHasMore(false);
    };

    const increaseQuantity = () => {
        setQuantity(q => {
            if (q === '') return minOrder;
            if (stock && q >= stock) return q;
            return q + 1;
        });
    };

    const decreaseQuantity = () => {
        setQuantity(q => {
            if (q === '' || q <= minOrder) return minOrder;
            return q - 1;
        });
    };

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: product.category?.name || 'Kategori', href: '#' },
        { label: product.name, href: '#' },
    ];

    const images = product.images?.length ? product.images : ['/images/placeholder.png'];
    const condition = product.condition || 'Baru';
    const categoryName = product.category?.name || 'Kategori';
    const sold = product.sold ?? 0;
    const reviewCount = product.review_count ?? 0;

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

    const importantInfo = product.important_info ?? [];

    // ===============================
    // PRODUK UTAMA — PRICE VIEW
    // ===============================
    const mainProductPrice = (() => {
        const originalPrice = Number(product.price) || 0;
        const discountPriceRaw =
            product.discount_price !== null && product.discount_price !== undefined
                ? Number(product.discount_price)
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

        // qty & subtotal (anti NaN)
        const qtyNumber =
            quantity === '' || Number.isNaN(Number(quantity))
                ? 0
                : Number(quantity);

        const subtotalFormatted = formatRupiah(finalPrice * qtyNumber);

        return {
            originalPrice,
            discountPrice: discountPriceRaw,
            hasDiscount,
            discountPercent,
            finalPrice,
            originalPriceFormatted: formatRupiah(originalPrice),
            finalPriceFormatted: formatRupiah(finalPrice),
            qtyNumber,
            subtotalFormatted,
        };
    })();

    // ===============================
    // RELATED PRODUCTS — SAFE
    // ===============================
    const relatedProductsPrepared = displayedRelated.map((p) => {
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
            hasDiscount,
            discountPercent, // penting agar JSX bisa akses
            originalPriceFormatted: formatRupiah(originalPrice),
            finalPriceFormatted: formatRupiah(finalPrice),
        };
    });


    return (
        <>
            <Head title={`${product.name} - Ditoekoe`} />
            <div className="min-h-screen bg-white text-gray-900">
                <NavMain />

                {/* Breadcrumb */}
                <div className="border-b">
                    <div className="max-w-6xl mx-auto px-6 py-3 flex items-center text-[12.5px] text-green-600">
                        {breadcrumbItems.map((item, i) => (
                            <div key={i} className="flex items-center">
                                {i > 0 && <span className="mx-2">›</span>}
                                <Link
                                    href={item.href}
                                    className={i === breadcrumbItems.length - 1
                                        ? 'text-gray-900'
                                        : 'hover:text-gray-900'}
                                >
                                    {item.label}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <section className="py-6">
                    <div className="max-w-6xl mx-auto px-4 border-b">

                        {/* GRID */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-15">

                            {/* LEFT — IMAGE FIX */}
                            <div className="lg:col-span-4">
                                <div className="sticky top-24 w-[340px] mx-auto">

                                    {/* Main Image */}
                                    <div className="w-[340px] h-[320px] border rounded-xl flex items-center justify-center mb-2">
                                        <img
                                            src={images[selectedImage]}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>

                                    {/* Thumbnails — 4 per row, full width */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {images.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedImage(i)}
                                                className={`aspect-square border rounded-lg overflow-hidden
                                                ${selectedImage === i
                                                        ? 'border-green-600'
                                                        : 'border-gray-200'}`}
                                            >
                                                <img
                                                    src={img}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                        {images.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedImage(i)}
                                                className={`aspect-square border rounded-lg overflow-hidden
                                                ${selectedImage === i
                                                        ? 'border-green-600'
                                                        : 'border-gray-200'}`}
                                            >
                                                <img
                                                    src={img}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                        {images.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedImage(i)}
                                                className={`aspect-square border rounded-lg overflow-hidden
                                                ${selectedImage === i
                                                        ? 'border-green-600'
                                                        : 'border-gray-200'}`}
                                            >
                                                <img
                                                    src={img}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                        {images.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedImage(i)}
                                                className={`aspect-square border rounded-lg overflow-hidden
                                                ${selectedImage === i
                                                        ? 'border-green-600'
                                                        : 'border-gray-200'}`}
                                            >
                                                <img
                                                    src={img}
                                                    className="w-full h-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>

                                </div>
                            </div>

                            {/* MIDDLE — PRODUCT INFO */}
                            <div className="lg:col-span-5">

                                {/* Name */}
                                <h1 className="text-[14px] lg:text-[19px] font-black mt-1">
                                    {product.name}
                                </h1>

                                {/* Sold & Rating */}
                                <div className="text-sm mt-1 flex items-center gap-2">

                                    {/* Sold */}
                                    <div className="flex items-center gap-1 leading-none">
                                        <span className="text-gray-900">Terjual</span>
                                        <span className="text-gray-400">
                                            {sold.toLocaleString()}
                                        </span>

                                        {/* Info Tooltip */}
                                        <div className="relative flex items-center group ml-1 shrink-0">
                                            <svg
                                                className="block"
                                                viewBox="0 0 24 24"
                                                width="16"
                                                height="16"
                                                fill="#1E2025"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 2.24A9.75 9.75 0 1 0 21.75 12 9.76 9.76 0 0 0 12 2.24Zm0 18A8.25 8.25 0 1 1 20.25 12 8.26 8.26 0 0 1 12 20.24Zm0-13.45a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-.527 4.683A.76.76 0 0 1 12 11.25a.76.76 0 0 1 .75.75v4a.75.75 0 1 1-1.5 0v-4a.76.76 0 0 1 .223-.527Z"
                                                />
                                            </svg>

                                            {/* Tooltip Wrapper */}
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 hidden group-hover:block z-10">

                                                {/* Arrow */}
                                                <div
                                                    className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent border-b-gray-800/85"
                                                />

                                                {/* Tooltip Box */}
                                                <div
                                                    className="bg-gray-800/85 text-white text-xs px-3 py-2 rounded-sm min-w-[220px] max-w-[360px] text-center leading-snug whitespace-normal"
                                                >
                                                    Yang kamu lihat di sini adalah total penjualan produk ini di Ditoekoe
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    {/* Separator Dot */}
                                    <span className="w-1 h-1 rounded-full bg-gray-400 inline-block" />

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 text-gray-400 leading-none">
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="14"
                                            height="14"
                                            fill="#FFD45F"
                                            aria-hidden="true"
                                        >
                                            <path d="M21.57 9.14a2.37 2.37 0 0 0-1.93-1.63L15.9 7l-1.68-3.4a2.38 2.38 0 0 0-4.27 0L8.27 7l-3.75.54a2.39 2.39 0 0 0-1.32 4.04l2.71 2.64L5.27 18a2.38 2.38 0 0 0 2.35 2.79 2.42 2.42 0 0 0 1.11-.27l3.35-1.76 3.35 1.76a2.41 2.41 0 0 0 2.57-.23 2.369 2.369 0 0 0 .89-2.29l-.64-3.73L21 11.58a2.38 0 0 0 .57-2.44Z" />
                                        </svg>

                                        <span>{reviewCount.toLocaleString()} rating</span>
                                    </div>
                                </div>

                                <div className="flex-1 border-b pb-2">
                                    <div className="font-black mt-4 text-[26px] mb-1 text-gray-900">
                                        {mainProductPrice.finalPriceFormatted}
                                    </div>

                                    {mainProductPrice.hasDiscount && (
                                        <div className="flex items-center gap-1.5 mt-[-6px]">
                                            {/* Kotak diskon merah */}
                                            <div className="bg-[rgb(249,77,99)]/30 text-[rgba(242,49,75,1)] font-medium text-[10px] px-1 py-1 rounded">
                                                {mainProductPrice.discountPercent}%
                                            </div>

                                            {/* Harga coret */}
                                            <div className="text-gray-400 text-[15px] line-through">
                                                {mainProductPrice.originalPriceFormatted}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Tabs */}
                                <div className="border-b mt-8 flex gap-6 text-sm font-bold">
                                    {(['detail', 'spec', 'info'] as const).map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`pb-2 ${activeTab === tab
                                                ? 'border-b-3 border-green-600 text-green-600'
                                                : 'text-gray-500'
                                                }`}
                                        >
                                            {tab === 'detail'
                                                ? 'Detail Produk'
                                                : tab === 'spec'
                                                    ? 'Spesifikasi'
                                                    : 'Info Penting'}
                                        </button>
                                    ))}
                                </div>

                                {/* Content */}
                                <div className="py-4 text-sm">

                                    {activeTab === 'detail' && (
                                        <div className="space-y-4">

                                            {/* Basic Info */}
                                            <div className="space-y-0.5 text-sm">
                                                <div className="font-regular">
                                                    <span className="text-gray-500">Kondisi: </span>
                                                    <span className="text-gray-900">
                                                        {condition}
                                                    </span>
                                                </div>

                                                <div className="font-regular">
                                                    <span className="text-gray-500">Min. Pemesanan: </span>
                                                    <span className="text-gray-900">
                                                        {minOrder} Buah
                                                    </span>
                                                </div>

                                                <div className="font-regular">
                                                    <span className="text-gray-500">Etalase: </span>{' '}
                                                    <span className="text-green-600 font-bold">
                                                        {categoryName}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <div className="font-regular">
                                                {product.description || '-'}
                                            </div>

                                        </div>
                                    )}

                                    {activeTab === 'spec' &&
                                        (product.specifications?.length ? (
                                            product.specifications.map((s, i) => (
                                                <div key={i} className="flex border-b py-2">
                                                    <div className="w-1/3 font-medium">{s.key}</div>
                                                    <div className="w-2/3">{s.value}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-500">Belum ada spesifikasi.</div>
                                        ))}

                                    {activeTab === 'info' && (
                                        <div className="space-y-4">
                                            {(product.important_info ?? []).map((item, index) => (
                                                <div key={index} className="space-y-1">
                                                    {/* JUDUL */}
                                                    <h3 className="font-semibold text-[15px] text-gray-900">
                                                        {item.title}
                                                    </h3>

                                                    {/* DESKRIPSI SINGKAT */}
                                                    <p className="text-sm text-gray-600 line-clamp-2 mb-[-2px]">
                                                        {item.content}
                                                    </p>

                                                    {/* SELENGKAPNYA */}
                                                    <button
                                                        onClick={() => {
                                                            setActiveInfoIndex(index);
                                                            setShowInfoModal(true);
                                                        }}
                                                        className="text-green-600 text-sm font-bold hover:font-black"
                                                    >
                                                        Selengkapnya
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {showInfoModal && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                                        <div className="relative bg-white w-[65vw] max-w-5xl h-[80vh] rounded-md shadow-lg flex overflow-hidden">

                                            {/* CLOSE */}
                                            <button
                                                onClick={() => setShowInfoModal(false)}
                                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                                            >
                                                ✕
                                            </button>

                                            {/* SIDEBAR */}
                                            <div className="w-1/4 border-r bg-gray-50 p-5 space-y-0.5">
                                                <h3 className="font-bold text-[20px] px-2 mb-2">
                                                    Info Penting
                                                </h3>

                                                {(product.important_info ?? []).map((item, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setActiveInfoIndex(index)}
                                                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition
                                                            ${activeInfoIndex === index
                                                                ? 'bg-green-600 text-white border font-semibold shadow-xs'
                                                                : 'hover:bg-green-100/50'
                                                            }`}
                                                    >
                                                        {item.title}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* CONTENT */}
                                            <div className="flex-1 p-6 overflow-y-auto custom-scroll">
                                                <h2 className="text-lg pr-15 font-semibold mb-6 text-center">
                                                    {product.important_info?.[activeInfoIndex]?.title ?? ''}
                                                </h2>

                                                <div className="text-sm text-gray-700 leading-normal whitespace-pre-line mr-10 max-h-[55vh] overflow-y-auto custom-scroll pr-2" >
                                                    {product.important_info?.[activeInfoIndex]?.content}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT — BUY BOX */}
                            <div className="lg:col-span-3 sticky top-24">
                                <div className="border rounded-xl p-4 bg-white">

                                    <div className="text-[16px] font-bold mb-4">
                                        Atur jumlah dan catatan
                                    </div>

                                    {/* QTY + STOCK */}
                                    <div className="flex items-center justify-between text-sm mb-4">

                                        {/* QUANTITY */}
                                        <div className="flex items-center border rounded-sm px-1 py-0.5">

                                            {/* MINUS */}
                                            <button
                                                onClick={decreaseQuantity}
                                                disabled={quantity === '' || quantity <= 1}
                                                className={`px-1 text-xl font-medium leading-none transition ${quantity !== '' && quantity > 1
                                                    ? 'text-green-600 hover:bg-green-50'
                                                    : 'text-gray-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                −
                                            </button>

                                            {/* INPUT */}
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={quantity}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/\D/g, '');

                                                    // boleh kosong
                                                    if (raw === '') {
                                                        setQuantity('');
                                                        return;
                                                    }

                                                    let val = parseInt(raw, 10);

                                                    if (val < minOrder) val = minOrder;
                                                    if (stock && val > stock) val = stock;

                                                    setQuantity(val);
                                                }}
                                                onBlur={() => {
                                                    // saat keluar input, kosong → balik ke minOrder
                                                    if (quantity === '') {
                                                        setQuantity(minOrder);
                                                    }
                                                }}
                                                className="w-12 text-center text-[15px] font-medium outline-none bg-transparent"
                                            />

                                            {/* PLUS */}
                                            <button
                                                onClick={increaseQuantity}
                                                className="px-1 text-xl font-medium leading-none text-green-600 hover:bg-green-50 transition"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* STOCK */}
                                        <div className="text-gray-700 px-3">
                                            Stok Total:
                                            <span className="font-medium text-gray-900">
                                                {' '} {stock}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-500">
                                            Subtotal
                                        </span>

                                        <div className="font-black text-[19px] px-2 text-gray-900">
                                            {mainProductPrice.subtotalFormatted}
                                        </div>
                                    </div>

                                    {/* BUTTONS */}
                                    <button
                                        onClick={() =>
                                            router.post('/cart/add', {
                                                product_id: product.id,
                                                quantity: quantity === '' ? minOrder : quantity,
                                            })
                                        }
                                        className="w-full bg-green-600 text-white py-1.5 rounded-lg font-semibold hover:bg-green-700 mb-2 transition"
                                    >
                                        + Keranjang
                                    </button>

                                    <button
                                        onClick={() =>
                                            router.post('/checkout', {
                                                product_id: product.id,
                                                quantity: quantity === '' ? minOrder : quantity,
                                            })
                                        }
                                        className="w-full border border-green-600 text-green-600 py-1.5 rounded-lg font-semibold hover:bg-green-50 transition"
                                    >
                                        Beli Langsung
                                    </button>

                                    {/* ACTION MENU */}
                                    <div className="mt-4 flex items-center justify-between text-gray-900">

                                        {/* CHAT */}
                                        <button className="flex items-center gap-0.5">
                                            <svg
                                                className="inline-block"
                                                viewBox="0 0 24 24"
                                                width="18"
                                                height="18"
                                                fill="#080808"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M3.66 21.67a.84.84 0 0 0 .34.08.74.74 0 0 0 .45-.15l3.8-2.85H17A3.71 3.71 0 0 0 20.75 15V7A3.71 3.71 0 0 0 17 3.25H7A3.71 3.71 0 0 0 3.25 7v14a.76.76 0 0 0 .41.67ZM6.13 4.907A2.2 2.2 0 0 1 7 4.75h10A2.2 2.2 0 0 1 19.25 7v8A2.2 2.2 0 0 1 17 17.25H8a.74.74 0 0 0-.45.15l-2.8 2.1V7a2.2 2.2 0 0 1 1.38-2.093ZM16 9.74H8a.75.75 0 0 1 0-1.5h8a.75.75 0 1 1 0 1.5Zm-3 4H8a.75.75 0 1 1 0-1.5h5a.75.75 0 1 1 0 1.5Z"
                                                />
                                            </svg>

                                            <span className="text-[12px] font-bold">Chat</span>
                                        </button>

                                        {/* DIVIDER */}
                                        <span className="w-px h-4 bg-gray-300" />

                                        {/* WISHLIST */}
                                        <button className="flex items-center gap-0.5">
                                            <svg
                                                className="inline-block"
                                                viewBox="0 0 24 24"
                                                width="18"
                                                height="18"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path d="M12.11 20.81a1.61 1.61 0 0 1-.92-.28c-2.14-1.28-6-4-7.92-7.64a6.8 6.8 0 0 1 0-7.12 5.39 5.39 0 0 1 4.6-2.54A5.1 5.1 0 0 1 12 5.55a5.14 5.14 0 0 1 4.24-2.32 5.5 5.5 0 0 1 4.56 2.56 7.62 7.62 0 0 1 .15 7c-2.31 4.17-7 7.15-8 7.7a1.63 1.63 0 0 1-.84.32ZM7.87 4.73a3.89 3.89 0 0 0-3.4 1.87c-.18.27-1.6 2.45.13 5.59 1.7 3.32 5.4 5.86 7.4 7.08a.19.19 0 0 0 .2 0c.56-.34 5.29-3.25 7.43-7.1a6.11 6.11 0 0 0-.09-5.6 4 4 0 0 0-3.29-1.86 4.12 4.12 0 0 0-3.57 2.61L12 8.68l-.67-1.34c-.84-1.68-2.07-2.61-3.46-2.61Z" />
                                            </svg>
                                            <span className="text-[12px] font-bold">Wishlist</span>
                                        </button>

                                        {/* DIVIDER */}
                                        <span className="w-px h-4 bg-gray-300" />

                                        {/* SHARE */}
                                        <button className="flex items-center gap-0.5">
                                            <svg
                                                className="inline-block"
                                                viewBox="0 0 24 24"
                                                width="18"
                                                height="18"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path d="M18.28 14.85a2.89 2.89 0 0 0-2.36 1.21l-6.69-3.53a.38.38 0 0 1-.1 0A2.63 2.63 0 0 0 9.1 11h.09l7-3.2a2.85 2.85 0 0 0 2.12 1 2.95 2.95 0 1 0-3-2.88c.02.203.057.403.11.6L8.57 9.61a.83.83 0 0 0-.18.13 2.95 2.95 0 0 0-5.06 2.12 3 3 0 0 0 3 2.88 2.94 2.94 0 0 0 2.16-1c.028.026.058.05.09.07l6.84 3.61c-.01.13-.01.26 0 .39a3 3 0 0 0 3 2.88 2.949 2.949 0 0 0 2.196-5.09 2.95 2.95 0 0 0-2.196-.8l-.14.05Zm0-10.5a1.45 1.45 0 1 1 0 2.89 1.52 1.52 0 0 1-1.45-1.44 1.46 1.46 0 0 1 1.45-1.45Zm-12 8.89a1.52 1.52 0 0 1-1.45-1.44 1.45 1.45 0 1 1 1.45 1.44Zm12 6a1.52 1.52 0 0 1-1.45-1.44 1.45 1.45 0 1 1 1.45 1.44Z" />
                                            </svg>
                                            <span className="text-[12px] font-bold">Bagikan</span>
                                        </button>

                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* RELATED PRODUCTS */}
                {relatedProductsPrepared.length > 0 && (
                    <section className="bg-white py-6 mt-3">
                        <div className="max-w-6xl mx-auto px-4">
                            <h2 className="text-lg font-semibold px-2 mb-4">
                                Pilihan Lainnya Untukmu
                            </h2>

                            <div className="grid gap-2 grid-cols-3 sm:grid-cols-3 lg:grid-cols-5">
                                {relatedProductsPrepared.map((p) => (
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
                                                        -{p.discount}%
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Image */}
                                        <div className="relative h-44 w-full overflow-hidden rounded-t-xl">
                                            <img
                                                src={p.image ?? '/images/placeholder.png'}
                                                alt={p.name ?? '-'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="px-2.5 py-2.5 mb-3">
                                            <h3 className="text-sm font-medium line-clamp-2 mb-1.5 min-h-[40px] text-gray-800">
                                                {p.name ?? '-'}
                                            </h3>

                                            <div className="flex gap-2 mt-3">
                                                <div className="flex-1">
                                                    {/* Price */}
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

                                                    {/* Sold Progress */}
                                                    <div>
                                                        <div className="text-[11px] text-gray-500 mb-0.5">
                                                            Terjual {p.sold ?? 0} / {p.stock ?? 0}
                                                        </div>

                                                        <div className="w-[100px] max-w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                                                                style={{
                                                                    width: `${p.stock && p.sold
                                                                        ? Math.min(
                                                                            (p.sold / p.stock) * 100,
                                                                            100
                                                                        )
                                                                        : 0
                                                                        }%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Tombol aksi */}
                                                <div className="w-[80px] flex flex-col items-end justify-between">
                                                    <div className="pt-1 flex gap-3 px-1">
                                                        {/* Favorit */}
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

                                                        {/* Tambah ke keranjang */}
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
                                                                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {/* Tombol beli */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            router.post('/cart/add', { product_id: p.id });
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

                            {hasMore && (
                                <div className="flex justify-center mt-8">
                                    <button onClick={loadMore} className="px-16 py-2.5 rounded-lg border border-green-600 text-green-700 font-semibold hover:bg-green-100/50 hover:text-green-600 transition-colors duration-300">
                                        Muat Lebih Banyak
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                <NavFooter />
            </div>
        </>
    );
}
