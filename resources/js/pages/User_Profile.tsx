import { NavFooter } from '@/components/nav-footer';
import NavMain from '@/components/nav-main';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useEffect, useRef, useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    birth_date?: string;
    gender?: string;
};

const { user } = usePage<{ user: User }>().props;
// const [isEditingName, setIsEditingName] = useState(false);
// const [isEditingPhone, setIsEditingPhone] = useState(false);

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

// const submitProfile = (e: FormEvent) => {
//     e.preventDefault();
//     profileForm.post('/user-profile', { forceFormData: true });
// };

// const submitPassword = (e: FormEvent) => {
//     e.preventDefault();
//     passwordForm.put('/user-profile/password');
// };

// const toggleEditName = () => {
//     setIsEditingName(!isEditingName);
//     if (!isEditingName) {
//         profileForm.setData('name', user.name);
//     }
// };

// const toggleEditPhone = () => {
//     setIsEditingPhone(!isEditingPhone);
//     if (!isEditingPhone) {
//         profileForm.setData('phone', user.phone || '');
//     }
// };

const [openMenu, setOpenMenu] = useState<Record<string, boolean>>({
    'Kotak Masuk': true,
    Pembelian: true,
    'Profil Saya': true,
});

const toggleMenu = (menu: string) => {
    setOpenMenu((prev) => ({
        ...prev,
        [menu]: !prev[menu],
    }));
};

const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg
        className={`h-4 w-4 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
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
    <div className="mb-3 flex items-center justify-between">
        <span className="w-40 text-gray-700 dark:text-gray-300">{label}</span>

        <div className="flex items-center gap-1">
            <span className="text-gray-600 dark:text-gray-400">{value}</span>

            {badge && (
                <span className="rounded bg-green-100 px-1 py-0.5 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {badge}
                </span>
            )}

            {action && (
                <button
                    onClick={onClick}
                    className="font-semibold text-green-600 hover:underline"
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

type TabKey = (typeof SECTION_TABS)[keyof typeof SECTION_TABS][number];

const { url } = usePage();

const [activeSection, setActiveSection] = useState<SectionKey>('profil');

const [activeTab, setActiveTab] = useState<TabKey>(SECTION_TABS.profil[0]);

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

const isValidTab = (section: SectionKey, tab: string): tab is TabKey => {
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
    <div className="grid grid-cols-1 gap-5 md:grid-cols-[260px_1fr]">
        {/* LEFT */}
        <div>
            {/* PHOTO CARD */}
            <div className="mb-6 space-y-2 rounded-sm border bg-white p-3 shadow-sm dark:border-[#3E3E3A] dark:bg-[#252523]">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-[#1A1A19]">
                    <Avatar className="h-full w-full">
                        <AvatarImage
                            src={user.avatar ?? '/images/login-illus.png'}
                            alt={user.name}
                            className="h-full w-full object-cover"
                        />
                        <AvatarFallback className="flex h-full w-full items-center justify-center bg-gray-200 text-3xl font-bold text-gray-500">
                            {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <label className="block cursor-pointer rounded-sm border py-1.5 text-center text-sm font-semibold hover:bg-gray-50 dark:border-[#3E3E3A] dark:hover:bg-[#1A1A19]">
                    Pilih Foto
                </label>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    Besar file maksimum 10 MB
                    <br />
                    JPG, JPEG, PNG
                </p>
            </div>

            {/* BUTTON GROUP */}
            <div className="space-y-1">
                <button className="w-full rounded-sm border py-1.5 text-sm font-semibold hover:bg-gray-50 dark:border-[#3E3E3A] dark:hover:bg-[#252523]">
                    Buat Kata Sandi
                </button>

                <button className="w-full rounded-sm border py-1.5 text-sm font-semibold hover:bg-gray-50 dark:border-[#3E3E3A] dark:hover:bg-[#252523]">
                    PIN Ditoekoe
                </button>

                <button className="w-full rounded-sm border py-1.5 text-sm font-semibold hover:bg-gray-50 dark:border-[#3E3E3A] dark:hover:bg-[#252523]">
                    Verifikasi Instan
                </button>
            </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6 py-2 text-sm">
            <div>
                <h3 className="mb-4 font-bold">Ubah Biodata Diri</h3>

                <BioRow label="Nama" value={user.name} action="Ubah" />
                <BioRow
                    label="Tanggal Lahir"
                    value="Tambah Tanggal Lahir"
                    action="Tambah"
                />
                <BioRow
                    label="Jenis Kelamin"
                    value="Tambah Jenis Kelamin"
                    action="Tambah"
                />
            </div>

            <div>
                <h3 className="mb-4 font-bold">Ubah Kontak</h3>

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
);

const TabPembayaran = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
        {/* LEFT MENU */}
        <div className="overflow-hidden rounded-xl border bg-white text-sm dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
            {[
                'GoPay',
                'DANA',
                'Kartu Kredit / Debit',
                'Kredivo Express',
                'Debit Instan',
            ].map((item) => (
                <div
                    key={item}
                    className="cursor-pointer border-b px-4 py-3 font-medium hover:bg-gray-50 dark:border-[#3E3E3A] dark:hover:bg-[#252523]"
                >
                    {item}
                </div>
            ))}
        </div>

        {/* RIGHT CONTENT */}
        <div className="rounded-xl border bg-white p-6 text-center dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
            <h2 className="mb-2 text-xl font-bold">Yuk, Aktifkan GoPay!</h2>
            <p className="mb-4 text-sm text-gray-500">
                GoPay kamu belum tersambung.
            </p>
            <button className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white">
                Aktifkan
            </button>
        </div>
    </div>
);

const TabAlamat = () => (
    <div className="rounded-xl border bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
        Daftar Alamat
    </div>
);

const TabRekening = () => (
    <div className="rounded-xl border bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
        Rekening Bank
    </div>
);

const TabMode = () => (
    <div className="rounded-xl border bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
        Mode Tampilan
    </div>
);

const TabKeamanan = () => (
    <div className="rounded-xl border bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
        Keamanan
    </div>
);

const TabNotifikasi = () => (
    <div className="rounded-xl border bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
        Notifikasi
    </div>
);

const TabChat = () => (
    <div className="rounded-xl border bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
        Chat
    </div>
);

const TabMenungguPembayaran = () => (
    <div className="rounded-xl border bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
        Menunggu Pembayaran
    </div>
);

const TabDaftarTransaksi = () => (
    <div className="rounded-xl border bg-white p-6 dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
        Transaksi
    </div>
);

export default function UserProfile() {
    return (
        <>
            <Head title="Profil - Ditoekoe" />

            <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-[#121212] dark:text-white">
                {/* NAV */}
                <NavMain />

                {/* CONTENT */}
                <section className="py-8">
                    <div className="mx-auto max-w-6xl px-4 lg:px-0">
                        <div className="grid min-h-[calc(100vh-120px)] grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
                            {/* Left Sidebar */}
                            <div className="h-full lg:col-span-3">
                                <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-white text-sm shadow-sm dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                                    {/* USER CARD */}
                                    <div className="p-4">
                                        <div className="mb-4 flex items-center gap-2.5">
                                            <Link
                                                href="/user-profile"
                                                className="flex min-w-0 items-center gap-2.5"
                                            >
                                                <Avatar className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                                    <AvatarImage
                                                        src={
                                                            user.avatar ??
                                                            '/images/login-illus.png'
                                                        }
                                                        alt={user.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <AvatarFallback className="flex items-center justify-center rounded-full bg-neutral-200 font-bold text-black dark:bg-neutral-700 dark:text-white">
                                                        {user.name
                                                            ?.charAt(0)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <span className="max-w-[140px] min-w-0 truncate text-lg leading-tight font-bold">
                                                    {user.name}
                                                </span>
                                            </Link>
                                        </div>

                                        {/* DIVIDER */}
                                        <div className="-mx-4 border-t border-gray-300 dark:border-[#3E3E3A]" />

                                        {/* PROMO */}
                                        <div className="mt-5 rounded-lg border bg-white p-3 text-sm dark:border-[#3E3E3A] dark:bg-[#252523]">
                                            <span className="mb-2 inline-block rounded bg-linear-to-r from-green-500 to-green-600 px-1.5 text-xs font-semibold text-white italic">
                                                PLUS{' '}
                                                <span className="text-sm font-black">
                                                    +
                                                </span>
                                            </span>
                                            <p className="leading-snug font-bold">
                                                Nikmatin Gratis Ongkir tanpa
                                                batas!
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                Min. belanja Rp0, bebas biaya
                                                aplikasi
                                            </p>
                                        </div>

                                        {/* WALLET */}
                                        <div className="mt-4 mb-1 space-y-3 px-2.5 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span>GoPay</span>
                                                <span className="text-green-600">
                                                    Aktifkan
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Ditoekoe Card</span>
                                                <span className="text-green-600">
                                                    Daftar
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Saldo</span>
                                                <span>Rp0</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DIVIDER */}
                                    <div className="border-t border-gray-300 dark:border-[#3E3E3A]" />

                                    {/* MENU */}
                                    <div className="flex flex-1 flex-col p-2">
                                        {/* Profil Saya */}
                                        <div>
                                            <button
                                                onClick={() =>
                                                    toggleMenu('Profil Saya')
                                                }
                                                className="flex w-full items-center justify-between px-4 py-2 font-semibold hover:bg-gray-50 dark:hover:bg-[#252523]"
                                            >
                                                Profil Saya
                                                <ChevronIcon
                                                    open={
                                                        openMenu['Profil Saya']
                                                    }
                                                />
                                            </button>

                                            {openMenu['Profil Saya'] && (
                                                <div className="space-y-2 px-6 pb-3">
                                                    {SECTION_TABS.profil.map(
                                                        (tab) => (
                                                            <div
                                                                key={tab}
                                                                onClick={() => {
                                                                    setActiveSection(
                                                                        'profil',
                                                                    );
                                                                    setActiveTab(
                                                                        tab,
                                                                    );
                                                                }}
                                                                className={`cursor-pointer transition ${
                                                                    activeSection ===
                                                                        'profil' &&
                                                                    activeTab ===
                                                                        tab
                                                                        ? 'font-black text-green-600'
                                                                        : 'text-gray-600 hover:text-green-500 dark:text-gray-400'
                                                                }`}
                                                            >
                                                                {tab}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Kotak Masuk */}
                                        <div>
                                            <button
                                                onClick={() =>
                                                    toggleMenu('Kotak Masuk')
                                                }
                                                className="flex w-full items-center justify-between px-4 py-2 font-semibold hover:bg-gray-50 dark:hover:bg-[#252523]"
                                            >
                                                Kotak Masuk
                                                <ChevronIcon
                                                    open={
                                                        openMenu['Kotak Masuk']
                                                    }
                                                />
                                            </button>

                                            {openMenu['Kotak Masuk'] && (
                                                <div className="space-y-2 px-6 pb-2.5 text-gray-600 dark:text-gray-400">
                                                    {SECTION_TABS.inbox.map(
                                                        (tab) => (
                                                            <div
                                                                key={tab}
                                                                onClick={() => {
                                                                    setActiveSection(
                                                                        'inbox',
                                                                    );
                                                                    setActiveTab(
                                                                        tab,
                                                                    );
                                                                }}
                                                                className={`cursor-pointer transition ${
                                                                    activeSection ===
                                                                        'inbox' &&
                                                                    activeTab ===
                                                                        tab
                                                                        ? 'font-black text-green-600'
                                                                        : 'hover:text-green-500'
                                                                }`}
                                                            >
                                                                {tab}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Pembelian */}
                                        <div>
                                            <button
                                                onClick={() =>
                                                    toggleMenu('Pembelian')
                                                }
                                                className="flex w-full items-center justify-between px-4 py-2 font-semibold hover:bg-gray-50 dark:hover:bg-[#252523]"
                                            >
                                                Pembelian
                                                <ChevronIcon
                                                    open={openMenu['Pembelian']}
                                                />
                                            </button>

                                            {openMenu['Pembelian'] && (
                                                <div className="space-y-2 px-6 pb-2.5 text-gray-600 dark:text-gray-400">
                                                    {SECTION_TABS.pembelian.map(
                                                        (tab) => (
                                                            <div
                                                                key={tab}
                                                                onClick={() => {
                                                                    setActiveSection(
                                                                        'pembelian',
                                                                    );
                                                                    setActiveTab(
                                                                        tab,
                                                                    );
                                                                }}
                                                                className={`cursor-pointer transition ${
                                                                    activeSection ===
                                                                        'pembelian' &&
                                                                    activeTab ===
                                                                        tab
                                                                        ? 'font-black text-green-600'
                                                                        : 'hover:text-green-500'
                                                                }`}
                                                            >
                                                                {tab}
                                                            </div>
                                                        ),
                                                    )}
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
                                <div className="flex h-[calc(100vh-80px)] flex-col overflow-hidden rounded-xl border bg-white shadow-sm dark:border-[#3E3E3A] dark:bg-[#1A1A19]">
                                    {/* TABS */}
                                    <div className="relative shrink-0 pt-3">
                                        {/* GARIS ABU-ABU */}
                                        <div className="absolute right-0 bottom-0 left-0 h-px bg-gray-300 dark:bg-[#3E3E3A]" />

                                        {/* WRAPPER */}
                                        <div className="relative">
                                            {/* SCROLLABLE TABS */}
                                            <div
                                                ref={containerRef}
                                                className="scrollbar-hide flex gap-5 overflow-x-auto text-sm font-semibold"
                                            >
                                                {SECTION_TABS[
                                                    activeSection
                                                ].map((tab) => (
                                                    <button
                                                        key={tab}
                                                        ref={(el) => {
                                                            tabRefs.current[
                                                                tab
                                                            ] = el;
                                                        }}
                                                        onClick={() =>
                                                            setActiveTab(tab)
                                                        }
                                                        className={`shrink-0 px-5 pb-3 whitespace-nowrap transition-colors ${
                                                            activeTab === tab
                                                                ? 'text-green-600'
                                                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
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
                                    <div className="mt-5 flex-1 px-5 pb-5">
                                        {/* PROFIL */}
                                        {activeSection === 'profil' && (
                                            <>
                                                {activeTab ===
                                                    'Biodata Diri' && (
                                                    <TabBiodata />
                                                )}
                                                {activeTab ===
                                                    'Daftar Alamat' && (
                                                    <TabAlamat />
                                                )}
                                                {activeTab === 'Pembayaran' && (
                                                    <TabPembayaran />
                                                )}
                                                {activeTab ===
                                                    'Rekening Bank' && (
                                                    <TabRekening />
                                                )}
                                                {activeTab ===
                                                    'Mode Tampilan' && (
                                                    <TabMode />
                                                )}
                                                {activeTab === 'Keamanan' && (
                                                    <TabKeamanan />
                                                )}
                                            </>
                                        )}

                                        {/* INBOX */}
                                        {activeSection === 'inbox' && (
                                            <>
                                                {activeTab === 'Notifikasi' && (
                                                    <TabNotifikasi />
                                                )}
                                                {activeTab === 'Chat' && (
                                                    <TabChat />
                                                )}
                                            </>
                                        )}

                                        {/* PEMBELIAN */}
                                        {activeSection === 'pembelian' && (
                                            <>
                                                {activeTab ===
                                                    'Menunggu Pembayaran' && (
                                                    <TabMenungguPembayaran />
                                                )}
                                                {activeTab ===
                                                    'Daftar Transaksi' && (
                                                    <TabDaftarTransaksi />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <NavFooter />
            </div>
        </>
    );
}
