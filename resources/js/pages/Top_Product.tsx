import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import NavMain from '@/components/nav-main';
import { NavFooter } from '@/components/nav-footer';
import { type SharedData } from '@/types';

const topProductItems = [
    {
        id: 1,
        name: 'Official Itel Smartwatch O43 Max smart watch 1.43 inch AMOLED Touch Screen IP68 water proof Jam Tangan Pria fitness tracking - Biru',
        category: 'Elektronik',
        discount: 75,
        originalPrice: 400000,
        discountPrice: 99000,
        sold: 158,
        total: 200,
        image: 'images/flash-sale/fs01.jpeg',
    },
    {
        id: 2,
        name: 'POCO Pad M1 (8GB/256GB) | Layar jernih 12.1" 2.5K | Snapdragon 7s Gen 4 [Official Store] - Grey, Pad Only',
        category: 'Kesehatan & Kecantikan',
        discount: 65,
        originalPrice: 150000,
        discountPrice: 52000,
        sold: 89,
        total: 150,
        image: 'images/flash-sale/fs07.jpeg',
    },
    {
        id: 3,
        name: 'EVERNEXT - Tas Ransel Pria Waterproof Backpack Outdoor Pria Tas Traveling Hummer',
        category: 'Elektronik',
        discount: 60,
        originalPrice: 1200000,
        discountPrice: 479000,
        sold: 45,
        total: 100,
        image: 'images/flash-sale/fs02.jpeg',
    },
    {
        id: 4,
        name: 'Dobujack Tshirt Basic Small Patch Black Tees - S',
        category: 'Elektronik',
        discount: 55,
        originalPrice: 300000,
        discountPrice: 135000,
        sold: 120,
        total: 200,
        image: 'images/flash-sale/fs03.jpeg',
    },
    {
        id: 5,
        name: 'Heion Lions Mane 60 Kapsul @500MG BPOM RESMI - Suplemen Herbal untuk Daya Ingat & Imunitas',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs04.jpeg',
    },
    {
        id: 6,
        name: 'ADVAN Smartwatch S1 AI Voice Assistant IPS Display 2.01" Touchscreen Waterproof IP68 Bluetooth Call Health Monitoring Jam Tangan Pintar Smartwatch Murah - Black',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs05.jpeg',
    },
    {
        id: 7,
        name: 'Moell Physical Sunscreen SPF 50+ PA++++ - Broad Spectrum UVA-UVB - Perlindungan Maksimal Kulit Anak - Skincare Microbiome Teknologi Formulasi Dokter - Skincare Bayi - Skincare Anak - SUNSCREEN 30gr SAJA',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs06.jpeg',
    },
    {
        id: 8,
        name: 'Official Itel Smartwatch O43 Max smart watch 1.43 inch AMOLED Touch Screen IP68 water proof Jam Tangan Pria fitness tracking - Biru',
        category: 'Elektronik',
        discount: 75,
        originalPrice: 400000,
        discountPrice: 99000,
        sold: 158,
        total: 200,
        image: 'images/flash-sale/fs01.jpeg',
    },
    {
        id: 9,
        name: 'FACE MASK Masker Duckbill',
        category: 'Kesehatan & Kecantikan',
        discount: 65,
        originalPrice: 150000,
        discountPrice: 52000,
        sold: 89,
        total: 150,
        image: 'images/flash-sale/fs01.jpeg',
    },
    {
        id: 10,
        name: 'EVERNEXT - Tas Ransel Pria Waterproof Backpack Outdoor Pria Tas Traveling Hummer',
        category: 'Elektronik',
        discount: 60,
        originalPrice: 1200000,
        discountPrice: 479000,
        sold: 45,
        total: 100,
        image: 'images/flash-sale/fs02.jpeg',
    },
    {
        id: 11,
        name: 'Dobujack Tshirt Basic Small Patch Black Tees - S',
        category: 'Elektronik',
        discount: 55,
        originalPrice: 300000,
        discountPrice: 135000,
        sold: 120,
        total: 200,
        image: 'images/flash-sale/fs03.jpeg',
    },
    {
        id: 12,
        name: 'Heion Lions Mane 60 Kapsul @500MG BPOM RESMI - Suplemen Herbal untuk Daya Ingat & Imunitas',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs04.jpeg',
    },
    {
        id: 13,
        name: 'ADVAN Smartwatch S1 AI Voice Assistant IPS Display 2.01" Touchscreen Waterproof IP68 Bluetooth Call Health Monitoring Jam Tangan Pintar Smartwatch Murah - Black',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs05.jpeg',
    },
    {
        id: 14,
        name: 'Moell Physical Sunscreen SPF 50+ PA++++ - Broad Spectrum UVA-UVB - Perlindungan Maksimal Kulit Anak - Skincare Microbiome Teknologi Formulasi Dokter - Skincare Bayi - Skincare Anak - SUNSCREEN 30gr SAJA',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs06.jpeg',
    },
    {
        id: 15,
        name: 'Official Itel Smartwatch O43 Max smart watch 1.43 inch AMOLED Touch Screen IP68 water proof Jam Tangan Pria fitness tracking - Biru',
        category: 'Elektronik',
        discount: 75,
        originalPrice: 400000,
        discountPrice: 99000,
        sold: 158,
        total: 200,
        image: 'images/flash-sale/fs01.jpeg',
    },
    {
        id: 16,
        name: 'FACE MASK Masker Duckbill',
        category: 'Kesehatan & Kecantikan',
        discount: 65,
        originalPrice: 150000,
        discountPrice: 52000,
        sold: 89,
        total: 150,
        image: 'images/flash-sale/fs01.jpeg',
    },
    {
        id: 17,
        name: 'EVERNEXT - Tas Ransel Pria Waterproof Backpack Outdoor Pria Tas Traveling Hummer',
        category: 'Elektronik',
        discount: 60,
        originalPrice: 1200000,
        discountPrice: 479000,
        sold: 45,
        total: 100,
        image: 'images/flash-sale/fs02.jpeg',
    },
    {
        id: 18,
        name: 'Dobujack Tshirt Basic Small Patch Black Tees - S',
        category: 'Elektronik',
        discount: 55,
        originalPrice: 300000,
        discountPrice: 135000,
        sold: 120,
        total: 200,
        image: 'images/flash-sale/fs03.jpeg',
    },
    {
        id: 19,
        name: 'Heion Lions Mane 60 Kapsul @500MG BPOM RESMI - Suplemen Herbal untuk Daya Ingat & Imunitas',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs04.jpeg',
    },
    {
        id: 20,
        name: 'ADVAN Smartwatch S1 AI Voice Assistant IPS Display 2.01" Touchscreen Waterproof IP68 Bluetooth Call Health Monitoring Jam Tangan Pintar Smartwatch Murah - Black',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs05.jpeg',
    },
    {
        id: 21,
        name: 'Moell Physical Sunscreen SPF 50+ PA++++ - Broad Spectrum UVA-UVB - Perlindungan Maksimal Kulit Anak - Skincare Microbiome Teknologi Formulasi Dokter - Skincare Bayi - Skincare Anak - SUNSCREEN 30gr SAJA',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs06.jpeg',
    },
    {
        id: 22,
        name: 'Official Itel Smartwatch O43 Max smart watch 1.43 inch AMOLED Touch Screen IP68 water proof Jam Tangan Pria fitness tracking - Biru',
        category: 'Elektronik',
        discount: 75,
        originalPrice: 400000,
        discountPrice: 99000,
        sold: 158,
        total: 200,
        image: 'images/flash-sale/fs01.jpeg',
    },
    {
        id: 23,
        name: 'FACE MASK Masker Duckbill',
        category: 'Kesehatan & Kecantikan',
        discount: 65,
        originalPrice: 150000,
        discountPrice: 52000,
        sold: 89,
        total: 150,
        image: 'images/flash-sale/fs01.jpeg',
    },
    {
        id: 24,
        name: 'EVERNEXT - Tas Ransel Pria Waterproof Backpack Outdoor Pria Tas Traveling Hummer',
        category: 'Elektronik',
        discount: 60,
        originalPrice: 1200000,
        discountPrice: 479000,
        sold: 45,
        total: 100,
        image: 'images/flash-sale/fs02.jpeg',
    },
    {
        id: 25,
        name: 'Dobujack Tshirt Basic Small Patch Black Tees - S',
        category: 'Elektronik',
        discount: 55,
        originalPrice: 300000,
        discountPrice: 135000,
        sold: 120,
        total: 200,
        image: 'images/flash-sale/fs03.jpeg',
    },
    {
        id: 26,
        name: 'Heion Lions Mane 60 Kapsul @500MG BPOM RESMI - Suplemen Herbal untuk Daya Ingat & Imunitas',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs04.jpeg',
    },
    {
        id: 27,
        name: 'ADVAN Smartwatch S1 AI Voice Assistant IPS Display 2.01" Touchscreen Waterproof IP68 Bluetooth Call Health Monitoring Jam Tangan Pintar Smartwatch Murah - Black',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs05.jpeg',
    },
    {
        id: 28,
        name: 'Moell Physical Sunscreen SPF 50+ PA++++ - Broad Spectrum UVA-UVB - Perlindungan Maksimal Kulit Anak - Skincare Microbiome Teknologi Formulasi Dokter - Skincare Bayi - Skincare Anak - SUNSCREEN 30gr SAJA',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs06.jpeg',
    },
    {
        id: 29,
        name: 'Official Itel Smartwatch O43 Max smart watch 1.43 inch AMOLED Touch Screen IP68 water proof Jam Tangan Pria fitness tracking - Biru',
        category: 'Elektronik',
        discount: 75,
        originalPrice: 400000,
        discountPrice: 99000,
        sold: 158,
        total: 200,
        image: 'images/flash-sale/fs01.jpeg',
    },
    {
        id: 30,
        name: 'FACE MASK Masker Duckbill',
        category: 'Kesehatan & Kecantikan',
        discount: 65,
        originalPrice: 150000,
        discountPrice: 52000,
        sold: 89,
        total: 150,
        image: 'images/flash-sale/fs01.jpeg',
    },
    {
        id: 31,
        name: 'EVERNEXT - Tas Ransel Pria Waterproof Backpack Outdoor Pria Tas Traveling Hummer',
        category: 'Elektronik',
        discount: 60,
        originalPrice: 1200000,
        discountPrice: 479000,
        sold: 45,
        total: 100,
        image: 'images/flash-sale/fs02.jpeg',
    },
    {
        id: 32,
        name: 'Dobujack Tshirt Basic Small Patch Black Tees - S',
        category: 'Elektronik',
        discount: 55,
        originalPrice: 300000,
        discountPrice: 135000,
        sold: 120,
        total: 200,
        image: 'images/flash-sale/fs03.jpeg',
    },
    {
        id: 33,
        name: 'Heion Lions Mane 60 Kapsul @500MG BPOM RESMI - Suplemen Herbal untuk Daya Ingat & Imunitas',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs04.jpeg',
    },
    {
        id: 34,
        name: 'ADVAN Smartwatch S1 AI Voice Assistant IPS Display 2.01" Touchscreen Waterproof IP68 Bluetooth Call Health Monitoring Jam Tangan Pintar Smartwatch Murah - Black',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs05.jpeg',
    },
    {
        id: 35,
        name: 'Moell Physical Sunscreen SPF 50+ PA++++ - Broad Spectrum UVA-UVB - Perlindungan Maksimal Kulit Anak - Skincare Microbiome Teknologi Formulasi Dokter - Skincare Bayi - Skincare Anak - SUNSCREEN 30gr SAJA',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs06.jpeg',
    },
    {
        id: 36,
        name: 'Official Itel Smartwatch O43 Max smart watch 1.43 inch AMOLED Touch Screen IP68 water proof Jam Tangan Pria fitness tracking - Biru',
        category: 'Elektronik',
        discount: 75,
        originalPrice: 400000,
        discountPrice: 99000,
        sold: 158,
        total: 200,
        image: 'images/flash-sale/fs01.jpeg',
    },
    {
        id: 37,
        name: 'FACE MASK Masker Duckbill',
        category: 'Kesehatan & Kecantikan',
        discount: 65,
        originalPrice: 150000,
        discountPrice: 52000,
        sold: 89,
        total: 150,
        image: 'images/flash-sale/fs01.jpeg',
    },
    {
        id: 38,
        name: 'EVERNEXT - Tas Ransel Pria Waterproof Backpack Outdoor Pria Tas Traveling Hummer',
        category: 'Elektronik',
        discount: 60,
        originalPrice: 1200000,
        discountPrice: 479000,
        sold: 45,
        total: 100,
        image: 'images/flash-sale/fs02.jpeg',
    },
    {
        id: 39,
        name: 'Dobujack Tshirt Basic Small Patch Black Tees - S',
        category: 'Elektronik',
        discount: 55,
        originalPrice: 300000,
        discountPrice: 135000,
        sold: 120,
        total: 200,
        image: 'images/flash-sale/fs03.jpeg',
    },
    {
        id: 40,
        name: 'Official Itel Smartwatch O43 Max smart watch 1.43 inch AMOLED Touch Screen IP68 water proof Jam Tangan Pria fitness tracking - Biru',
        category: 'Elektronik',
        discount: 75,
        originalPrice: 400000,
        discountPrice: 99000,
        sold: 158,
        total: 200,
        image: 'images/flash-sale/fs01.jpeg',
    },
    {
        id: 41,
        name: 'EVERNEXT - Tas Ransel Pria Waterproof Backpack Outdoor Pria Tas Traveling Hummer',
        category: 'Elektronik',
        discount: 60,
        originalPrice: 1200000,
        discountPrice: 479000,
        sold: 45,
        total: 100,
        image: 'images/flash-sale/fs02.jpeg',
    },
    {
        id: 42,
        name: 'Dobujack Tshirt Basic Small Patch Black Tees - S',
        category: 'Elektronik',
        discount: 55,
        originalPrice: 300000,
        discountPrice: 135000,
        sold: 120,
        total: 200,
        image: 'images/flash-sale/fs03.jpeg',
    },
    {
        id: 43,
        name: 'Heion Lions Mane 60 Kapsul @500MG BPOM RESMI - Suplemen Herbal untuk Daya Ingat & Imunitas',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs04.jpeg',
    },
    {
        id: 44,
        name: 'ADVAN Smartwatch S1 AI Voice Assistant IPS Display 2.01" Touchscreen Waterproof IP68 Bluetooth Call Health Monitoring Jam Tangan Pintar Smartwatch Murah - Black',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs05.jpeg',
    },
    {
        id: 45,
        name: 'Moell Physical Sunscreen SPF 50+ PA++++ - Broad Spectrum UVA-UVB - Perlindungan Maksimal Kulit Anak - Skincare Microbiome Teknologi Formulasi Dokter - Skincare Bayi - Skincare Anak - SUNSCREEN 30gr SAJA',
        category: 'Fashion Pria',
        discount: 70,
        originalPrice: 800000,
        discountPrice: 239000,
        sold: 78,
        total: 150,
        image: 'images/flash-sale/fs06.jpeg',
    },
    {
        id: 46,
        name: 'Official Itel Smartwatch O43 Max smart watch 1.43 inch AMOLED Touch Screen IP68 water proof Jam Tangan Pria fitness tracking - Biru',
        category: 'Elektronik',
        discount: 75,
        originalPrice: 400000,
        discountPrice: 99000,
        sold: 158,
        total: 200,
        image: 'images/flash-sale/fs01.jpeg',
    },
    {
        id: 47,
        name: 'FACE MASK Masker Duckbill',
        category: 'Kesehatan & Kecantikan',
        discount: 65,
        originalPrice: 150000,
        discountPrice: 52000,
        sold: 89,
        total: 150,
        image: 'images/flash-sale/fs01.jpeg',
    },
    {
        id: 48,
        name: 'EVERNEXT - Tas Ransel Pria Waterproof Backpack Outdoor Pria Tas Traveling Hummer',
        category: 'Elektronik',
        discount: 60,
        originalPrice: 1200000,
        discountPrice: 479000,
        sold: 45,
        total: 100,
        image: 'images/flash-sale/fs02.jpeg',
    },
    {
        id: 49,
        name: 'Dobujack Tshirt Basic Small Patch Black Tees - S',
        category: 'Elektronik',
        discount: 55,
        originalPrice: 300000,
        discountPrice: 135000,
        sold: 120,
        total: 200,
        image: 'images/flash-sale/fs03.jpeg',
    },
    {
        id: 50,
        name: 'Official Itel Smartwatch O43 Max smart watch 1.43 inch AMOLED Touch Screen IP68 water proof Jam Tangan Pria fitness tracking - Biru',
        category: 'Elektronik',
        discount: 75,
        originalPrice: 400000,
        discountPrice: 99000,
        sold: 158,
        total: 200,
        image: 'images/flash-sale/fs01.jpeg',
    },
];

const categories = [
    { id: 1, name: 'Jam Imo', slug: 'jam-imo' },
    { id: 2, name: 'Smartwatch Original', slug: 'smartwatch-ori' },
    { id: 3, name: 'Matte MS Glow', slug: 'matte-msglow' },
    { id: 4, name: 'Hijab Paris Premium', slug: 'hijab-paris-premium' },
    { id: 5, name: 'Jam Tangan Wanita Analog', slug: 'jam-tangan-wanita-analog' },
    { id: 6, name: 'Kerudung', slug: 'kerudung' },
    { id: 7, name: 'Lainnya', slug: 'lainnya' },
]

const moreCategories = [
    { id: 8, name: 'Hobi', slug: 'hobi' },
    { id: 9, name: 'Otomotif', slug: 'otomotif' },
    { id: 10, name: 'Perlengkapan Rumah', slug: 'rumah' },
    { id: 11, name: 'Pulsa & E-Voucher', slug: 'pulsa-evoucher' },
    { id: 12, name: 'Handphone & Aksesoris', slug: 'handphone-aksesoris' },
]

export default function TopProduct({
    auth,
}: {
    auth: SharedData['auth']
}) {

    const [openMore, setOpenMore] = useState(false)
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })

    const [activeCategory, setActiveCategory] = useState('jam-imo')

    useEffect(() => {
        setActiveCategory('jam-imo')
    }, [])

    const filteredProducts =
        activeCategory === 'jam-imo'
            ? topProductItems
            : topProductItems.filter(
                (item) =>
                    item.category.toLowerCase() ===
                    activeCategory.replace('-', ' ').toLowerCase()
            )

    const ITEMS_PER_LOAD = 30
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD)

    const visibleProducts = filteredProducts.slice(0, visibleCount)
    const canLoadMore = visibleCount < filteredProducts.length

    useEffect(() => {
        setVisibleCount(ITEMS_PER_LOAD)
    }, [activeCategory])

    return (
        <>
            <Head title="Produk Terlaris - Ditoekoe" />

            <div className="min-h-screen text-gray-900">
                <NavMain />

                <section className="bg-white">
                    <div className="container mx-auto max-w-6xl">

                        {/* HEADER */}
                        <div className="text-center mb-8 mt-8">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                                Produk Terlaris
                            </h2>
                        </div>

                        {/* CATEGORY FILTER - Toggle Style */}
                        <div className="mb-6">
                            <div className="bg-white border border-gray-200 h-15 rounded-t-lg shadow-sm relative">
                                <div className="flex h-full w-full">
                                    {categories.map((c, index) =>
                                        c.slug !== 'lainnya' ? (
                                            <button
                                                key={c.id}
                                                onClick={() => {
                                                    setActiveCategory(c.slug)
                                                    setOpenMore(false)
                                                }}
                                                className={`relative flex-1 h-full flex items-center justify-center text-[13px] font-medium transition-colors duration-300 z-10 ${activeCategory === c.slug
                                                        ? 'text-gray-900 font-semibold'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                                data-index={index}
                                            >
                                                {c.name}
                                            </button>
                                        ) : (
                                            <button
                                                key={c.id}
                                                onClick={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect()
                                                    setDropdownPos({
                                                        top: rect.bottom + 8,
                                                        left: rect.left,
                                                    })
                                                    setOpenMore((prev) => !prev)
                                                }}
                                                className={`relative flex-1 h-full flex items-center justify-center gap-1.5 text-[13px] font-medium transition-colors duration-300 z-10 ${openMore
                                                        ? 'text-gray-900 font-semibold'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                                data-index={index}
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
                                        )
                                    )}

                                    {/* SINGLE SLIDING UNDERLINE */}
                                    <div
                                        className="absolute bottom-0 h-1 bg-green-600 transition-all duration-300 ease-out"
                                        style={{
                                            width: `calc(100% / ${categories.length})`,
                                            transform: `translateX(${activeCategory === 'lainnya' || openMore
                                                    ? (categories.length - 1) * 100
                                                    : categories.findIndex(c => c.slug === activeCategory) * 100
                                                }%)`
                                        }}
                                    />
                                </div>
                            </div>

                            {/* DROPDOWN LAINNYA */}
                            {openMore && (
                                <div
                                    style={{
                                        top: dropdownPos.top,
                                        left: dropdownPos.left,
                                    }}
                                    className="fixed w-44 bg-white border border-gray-200 rounded-md shadow-xl z-[9999]"
                                >
                                    {moreCategories.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setActiveCategory(item.slug)
                                                setOpenMore(false)
                                            }}
                                            className={`block w-full text-left px-4 py-2.5 text-sm transition ${activeCategory === item.slug
                                                    ? 'text-gray-900 font-semibold bg-green-50'
                                                    : 'text-gray-700 hover:bg-gray-100'
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
                                {visibleProducts.map((p) => (
                                    <Link
                                        key={p.id}
                                        href={`/products/${p.id}`}
                                        className="relative bg-white rounded-xl border border-gray-200 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-sm"
                                    >
                                        {/* DISCOUNT BADGE — DI ATAS CARD */}
                                        <div className="absolute top-3 left-3 z-20">
                                            <div className="discount-wrapper-fs">
                                                <span className="discount-dark-fs"></span>
                                                <span className="discount-light-fs">-{p.discount}%</span>
                                            </div>
                                        </div>

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
                                            <h3 className="text-sm font-medium line-clamp-2 mb-1.5 min-h-[40px] text-gray-800">
                                                {p.name}
                                            </h3>

                                            {/* BOTTOM SECTION */}
                                            <div className="flex gap-2 mt-3">
                                                {/* LEFT : PRICE + PROGRESS */}
                                                <div className="flex-1">
                                                    {/* PRICE */}
                                                    <div className="mb-1">
                                                        <div className="text-gray-400 text-[12px] line-through leading-tight">
                                                            Rp {p.originalPrice.toLocaleString('id-ID')}
                                                        </div>
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
                                                                style={{ width: `${(p.sold / p.total) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* RIGHT : ACTIONS */}
                                                <div className="w-[80px] flex flex-col items-end justify-between">
                                                    {/* ICON BUTTONS */}
                                                    <div className="pt-1 flex gap-3 px-1">
                                                        <button
                                                            className="w-7.5 h-7.5 rounded-md border border-green-600/50 flex items-center justify-center hover:bg-gray-100 transition"
                                                            title="Favorit"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#16a34a" className="size-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                                            </svg>
                                                        </button>

                                                        {/* CART */}
                                                        <button
                                                            className="w-7.5 h-7.5 rounded-md border border-green-600/50 flex items-center justify-center hover:bg-gray-100 transition"
                                                            title="Tambah ke Keranjang"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#16a34a" className="size-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                            </svg>

                                                        </button>
                                                    </div>

                                                    {/* BUY BUTTON */}
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