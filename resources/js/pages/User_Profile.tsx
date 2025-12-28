import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import NavMain from '@/components/nav-main';
import { NavFooter } from '@/components/nav-footer';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    birth_date?: string;
    gender?: string;
};

export default function UserProfile() {
    const { user } = usePage<{ user: User }>().props;
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);

    const profileForm = useForm({
        name: user.name || '',
        avatar: null as File | null,
        phone: user.phone || '',
        birth_date: user.birth_date || '',
        gender: user.gender || '',
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile = (e: FormEvent) => {
        e.preventDefault();
        profileForm.post('/user-profile', { forceFormData: true });
    };

    const submitPassword = (e: FormEvent) => {
        e.preventDefault();
        passwordForm.put('/user-profile/password');
    };

    const toggleEditName = () => {
        setIsEditingName(!isEditingName);
        if (!isEditingName) {
            profileForm.setData('name', user.name);
        }
    };

    const toggleEditPhone = () => {
        setIsEditingPhone(!isEditingPhone);
        if (!isEditingPhone) {
            profileForm.setData('phone', user.phone || '');
        }
    };

    const [openMenu, setOpenMenu] = useState<Record<string, boolean>>({
        'Kotak Masuk': true,
        'Pembelian': true,
        'Profil Saya': true,
    });

    const toggleMenu = (menu: string) => {
        setOpenMenu(prev => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    const ChevronIcon = ({ open }: { open: boolean }) => (
        <svg
            className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''
                }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    );

    const BioRow = ({
        label,
        value,
        action,
        badge,
        onClick,
    }: {
        label: string;
        value: string;
        action?: string;
        badge?: string;
        onClick?: () => void;
    }) => (
        <div className="flex justify-between items-center mb-3">
            <span className="w-40 text-gray-700">{label}</span>

            <div className="flex items-center gap-3">
                <span className="text-gray-600">{value}</span>

                {badge && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        {badge}
                    </span>
                )}

                {action && (
                    <button
                        onClick={onClick}
                        className="text-green-600 font-semibold hover:underline"
                    >
                        {action}
                    </button>
                )}
            </div>
        </div>
    );

    type SectionKey = 'profil' | 'inbox' | 'pembelian';

    const SECTION_TABS = {
        profil: [
            'Biodata Diri',
            'Daftar Alamat',
            'Pembayaran',
            'Rekening Bank',
            'Mode Tampilan',
            'Keamanan',
        ],
        inbox: ['Notifikasi', 'Chat'],
        pembelian: ['Menunggu Pembayaran', 'Daftar Transaksi'],
    } as const;

    type TabKey =
        typeof SECTION_TABS[keyof typeof SECTION_TABS][number];

    const { url } = usePage();

    const [activeSection, setActiveSection] =
        useState<SectionKey>('profil');

    const [activeTab, setActiveTab] =
        useState<TabKey>(SECTION_TABS.profil[0]);

    const changeSection = (section: SectionKey) => {
        setActiveSection(section);
        setActiveTab(SECTION_TABS[section][0]);
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const [indicator, setIndicator] = useState({
        left: 0,
        width: 0,
    });

    const isValidTab = (
        section: SectionKey,
        tab: string
    ): tab is TabKey => {
        return (SECTION_TABS[section] as readonly string[]).includes(tab);
    };

    useEffect(() => {
        const params = new URLSearchParams(url.split('?')[1]);

        const section = params.get('section') as SectionKey | null;
        const tab = params.get('tab');

        if (section && SECTION_TABS[section]) {
            setActiveSection(section);

            if (tab && isValidTab(section, tab)) {
                setActiveTab(tab);
            } else {
                setActiveTab(SECTION_TABS[section][0]);
            }
        }
    }, [url]);

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
    }, [activeTab, activeSection]);

    const TabBiodata = () => (
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5">

            {/* LEFT */}
            <div>

                {/* PHOTO CARD */}
                <div className="bg-white rounded-sm shadow-sm border p-3 space-y-2 mb-6">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Avatar className="w-full h-full">
                            <AvatarImage
                                src={user.avatar ?? "/images/login-illus.png"}
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                            <AvatarFallback
                                className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold text-3xl"
                            >
                                {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <label className="block text-center border text-sm rounded-sm py-1.5 font-semibold cursor-pointer hover:bg-gray-50">
                        Pilih Foto
                    </label>

                    <p className="text-xs text-gray-500 text-center">
                        Besar file maksimum 10 MB<br />
                        JPG, JPEG, PNG
                    </p>
                </div>

                {/* BUTTON GROUP */}
                <div className="space-y-1">
                    <button className="w-full border rounded-sm py-1.5 text-sm font-semibold hover:bg-gray-50">
                        Buat Kata Sandi
                    </button>

                    <button className="w-full border rounded-sm py-1.5 text-sm font-semibold hover:bg-gray-50">
                        PIN Ditoekoe
                    </button>

                    <button className="w-full border rounded-sm py-1.5 text-sm font-semibold hover:bg-gray-50">
                        Verifikasi Instan
                    </button>
                </div>

            </div>

            {/* RIGHT */}
            <div className="text-sm py-2 space-y-6">

                <div>
                    <h3 className="font-bold mb-4">Ubah Biodata Diri</h3>

                    <BioRow label="Nama" value={user.name} action="Ubah" />
                    <BioRow label="Tanggal Lahir" value="Tambah Tanggal Lahir" action="Tambah" />
                    <BioRow label="Jenis Kelamin" value="Tambah Jenis Kelamin" action="Tambah" />
                </div>

                <div>
                    <h3 className="font-bold mb-4">Ubah Kontak</h3>

                    <BioRow
                        label="Email"
                        value={user.email}
                        badge="Terverifikasi"
                        action="Ubah"
                    />
                    <BioRow
                        label="Nomor HP"
                        value="Tambah Nomor HP"
                        action="Tambah"
                    />
                </div>

            </div>
        </div>
    )

    const TabPembayaran = () => (
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">

            {/* LEFT MENU */}
            <div className="bg-white rounded-xl border text-sm">
                {['GoPay', 'DANA', 'Kartu Kredit / Debit', 'Kredivo Express', 'Debit Instan']
                    .map(item => (
                        <div
                            key={item}
                            className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer font-medium"
                        >
                            {item}
                        </div>
                    ))}
            </div>

            {/* RIGHT CONTENT */}
            <div className="bg-white rounded-xl border p-6 text-center">
                <h2 className="text-xl font-bold mb-2">
                    Yuk, Aktifkan GoPay!
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                    GoPay kamu belum tersambung.
                </p>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold">
                    Aktifkan
                </button>
            </div>

        </div>
    )

    const TabAlamat = () => (
        <div className="bg-white rounded-xl border p-6">
            Daftar Alamat
        </div>
    )

    const TabRekening = () => (
        <div className="bg-white rounded-xl border p-6">
            Rekening Bank
        </div>
    )

    const TabMode = () => (
        <div className="bg-white rounded-xl border p-6">
            Mode Tampilan
        </div>
    )

    const TabKeamanan = () => (
        <div className="bg-white rounded-xl border p-6">
            Keamanan
        </div>
    )

    const TabNotifikasi = () => (
        <div className="bg-white rounded-xl border p-6">
            Notifikasi
        </div>
    )

    const TabChat = () => (
        <div className="bg-white rounded-xl border p-6">
            Chat
        </div>
    )

    const TabMenungguPembayaran = () => (
        <div className="bg-white rounded-xl border p-6">
            Menunggu Pembayaran
        </div>
    )

    const TabDaftarTransaksi = () => (
        <div className="bg-white rounded-xl border p-6">
            Transaksi
        </div>
    )

    return (
        <>
            <Head title="Profil - Ditoekoe" />

            <div className="min-h-screen bg-gray-50 text-gray-900">
                {/* NAV */}
                <NavMain />

                {/* CONTENT */}
                <section className="py-8">
                    <div className="max-w-6xl mx-auto px-4 lg:px-0">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-120px)] items-stretch">
                            {/* Left Sidebar */}
                            <div className="lg:col-span-3 h-full">
                                <div className="bg-white rounded-xl border shadow-sm text-sm overflow-hidden h-full flex flex-col">

                                    {/* USER CARD */}
                                    <div className="p-4">
                                        <div className="flex items-center gap-2.5 mb-4">
                                            <Link
                                                href="/user-profile"
                                                className="flex items-center gap-2.5 min-w-0"
                                            >
                                                <Avatar className="h-10 w-10 rounded-full overflow-hidden shrink-0">
                                                    <AvatarImage
                                                        src={user.avatar ?? "/images/login-illus.png"}
                                                        alt={user.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <AvatarFallback className="flex items-center justify-center rounded-full bg-neutral-200 font-bold text-black dark:bg-neutral-700 dark:text-white">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <span className="text-lg font-bold truncate min-w-0 max-w-[140px] leading-tight">
                                                    {user.name}
                                                </span>
                                            </Link>
                                        </div>

                                        {/* DIVIDER */}
                                        <div className="border-t border-gray-300 -mx-4" />

                                        {/* PROMO */}
                                        <div className="border mt-5 rounded-lg p-3 text-sm">
                                            <span className="inline-block bg-linear-to-r from-green-500 to-green-600 text-white font-semibold italic text-xs px-1.5 rounded mb-2">
                                                PLUS <span className="font-black text-sm">+</span>
                                            </span>
                                            <p className="font-bold leading-snug">
                                                Nikmatin Gratis Ongkir tanpa batas!
                                            </p>
                                            <p className="text-gray-500 text-xs mt-1">
                                                Min. belanja Rp0, bebas biaya aplikasi
                                            </p>
                                        </div>

                                        {/* WALLET */}
                                        <div className="mt-4 px-2.5 space-y-3 text-sm mb-1">
                                            <div className="flex justify-between items-center">
                                                <span>GoPay</span>
                                                <span className="text-green-600">Aktifkan</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Ditoekoe Card</span>
                                                <span className="text-green-600">Daftar</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Saldo</span>
                                                <span>Rp0</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DIVIDER */}
                                    <div className="border-t border-gray-300" />

                                    {/* MENU */}
                                    <div className="p-2 flex flex-col flex-1">

                                        {/* Profil Saya */}
                                        <div>
                                            <button
                                                onClick={() => toggleMenu('Profil Saya')}
                                                className="w-full flex justify-between items-center px-4 py-2 font-semibold hover:bg-gray-50"
                                            >
                                                Profil Saya
                                                <ChevronIcon open={openMenu['Profil Saya']} />
                                            </button>

                                            {openMenu['Profil Saya'] && (
                                                <div className="px-6 pb-3 space-y-2">
                                                    {SECTION_TABS.profil.map(tab => (
                                                        <div
                                                            key={tab}
                                                            onClick={() => {
                                                                setActiveSection('profil');
                                                                setActiveTab(tab);
                                                            }}
                                                            className={`cursor-pointer transition
                                                                ${activeSection === 'profil' && activeTab === tab
                                                                    ? 'text-green-600 font-black'
                                                                    : 'text-gray-600 hover:text-green-500'
                                                                }`}
                                                        >
                                                            {tab}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Kotak Masuk */}
                                        <div>
                                            <button
                                                onClick={() => toggleMenu('Kotak Masuk')}
                                                className="w-full flex justify-between items-center px-4 py-2 font-semibold hover:bg-gray-50"
                                            >
                                                Kotak Masuk
                                                <ChevronIcon open={openMenu['Kotak Masuk']} />
                                            </button>

                                            {openMenu['Kotak Masuk'] && (
                                                <div className="px-6 pb-2.5 space-y-2 text-gray-600">
                                                    {SECTION_TABS.inbox.map(tab => (
                                                        <div
                                                            key={tab}
                                                            onClick={() => {
                                                                setActiveSection('inbox');
                                                                setActiveTab(tab);
                                                            }}
                                                            className={`cursor-pointer transition
                                                                ${activeSection === 'inbox' && activeTab === tab
                                                                    ? 'text-green-600 font-black'
                                                                    : 'hover:text-green-500'
                                                                }`}
                                                        >
                                                            {tab}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Pembelian */}
                                        <div>
                                            <button
                                                onClick={() => toggleMenu('Pembelian')}
                                                className="w-full flex justify-between items-center px-4 py-2 font-semibold hover:bg-gray-50"
                                            >
                                                Pembelian
                                                <ChevronIcon open={openMenu['Pembelian']} />
                                            </button>

                                            {openMenu['Pembelian'] && (
                                                <div className="px-6 pb-2.5 space-y-2 text-gray-600">
                                                    {SECTION_TABS.pembelian.map(tab => (
                                                        <div
                                                            key={tab}
                                                            onClick={() => {
                                                                setActiveSection('pembelian');
                                                                setActiveTab(tab);
                                                            }}
                                                            className={`cursor-pointer transition
                                                                ${activeSection === 'pembelian' && activeTab === tab
                                                                    ? 'text-green-600 font-black'
                                                                    : 'hover:text-green-500'
                                                                }`}
                                                        >
                                                            {tab}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* SPACER */}
                                        <div className="flex-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="lg:col-span-9">
                                <div className="bg-white rounded-xl shadow-sm border h-[calc(100vh-80px)] flex flex-col overflow-hidden">

                                    {/* TABS */}
                                    <div className="relative shrink-0 pt-3">

                                        {/* GARIS ABU-ABU */}
                                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300" />

                                        {/* WRAPPER */}
                                        <div className="relative">

                                            {/* SCROLLABLE TABS */}
                                            <div
                                                ref={containerRef}
                                                className="flex text-sm gap-5 font-semibold overflow-x-auto scrollbar-hide"
                                            >
                                                {SECTION_TABS[activeSection].map(tab => (
                                                    <button
                                                        key={tab}
                                                        ref={(el) => {
                                                            tabRefs.current[tab] = el;
                                                        }}
                                                        onClick={() => setActiveTab(tab)}
                                                        className={`px-5 pb-3 whitespace-nowrap shrink-0 transition-colors
                                                            ${activeTab === tab
                                                                ? 'text-green-600'
                                                                : 'text-gray-500 hover:text-gray-700'
                                                            }`}
                                                    >
                                                        {tab}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* SLIDING UNDERLINE */}
                                            <span
                                                className="pointer-events-none absolute bottom-0 h-0.5 bg-green-600 transition-[left,width] duration-300 ease-out"
                                                style={{
                                                    left: indicator.left,
                                                    width: indicator.width,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex-1 px-5 mt-5 pb-5">
                                        {/* PROFIL */}
                                        {activeSection === 'profil' && (
                                            <>
                                                {activeTab === 'Biodata Diri' && <TabBiodata />}
                                                {activeTab === 'Daftar Alamat' && <TabAlamat />}
                                                {activeTab === 'Pembayaran' && <TabPembayaran />}
                                                {activeTab === 'Rekening Bank' && <TabRekening />}
                                                {activeTab === 'Mode Tampilan' && <TabMode />}
                                                {activeTab === 'Keamanan' && <TabKeamanan />}
                                            </>
                                        )}

                                        {/* INBOX */}
                                        {activeSection === 'inbox' && (
                                            <>
                                                {activeTab === 'Notifikasi' && <TabNotifikasi />}
                                                {activeTab === 'Chat' && <TabChat />}
                                            </>
                                        )}

                                        {/* PEMBELIAN */}
                                        {activeSection === 'pembelian' && (
                                            <>
                                                {activeTab === 'Menunggu Pembayaran' && <TabMenungguPembayaran />}
                                                {activeTab === 'Daftar Transaksi' && <TabDaftarTransaksi />}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section >

                {/* FOOTER */}
                < NavFooter />
            </div >
        </>
    );
}