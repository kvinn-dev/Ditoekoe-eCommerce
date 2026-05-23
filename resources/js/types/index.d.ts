import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

// ===== CORE TYPES =====
export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    badge?: number | string;
    children?: NavItem[];
}

export interface SharedData {
    name: string;
    quote?: { message: string; author: string };
    auth: Auth;
    sidebarOpen?: boolean;
    flash: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
    cartCount?: number;
    [key: string]: unknown;
}

export interface PaginatedData<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

// ===== USER TYPES =====
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    is_admin?: boolean;
    two_factor_enabled?: boolean;
    phone?: string;
    address?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    country?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

// ===== E-COMMERCE TYPES =====

// Category
export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parent_id?: number;
    parent?: Category;
    children?: Category[];
    products_count?: number;
    is_active?: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

// Brand
export interface Brand {
    id: number;
    name: string;
    slug: string;
    logo?: string;
    description?: string;
    website?: string;
    is_active: boolean;
    products_count?: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

// Product
export interface Product {
    id: number;
    name: string;
    slug: string;
    description?: string;
    price: number;
    discount_price: number | null;
    stock: number;
    sku?: string;
    weight?: number;
    dimensions?: string;
    image?: string;
    images?: string[];
    category_id: number;
    category?: Category;
    brand_id?: number;
    brand?: Brand;
    is_featured: boolean;
    is_active: boolean;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    reviews_count?: number;
    average_rating?: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

// Product Variant (Opsional)
export interface ProductVariant {
    id: number;
    product_id: number;
    name: string;
    sku: string;
    price: number;
    stock: number;
    attributes: Record<string, string>; // { color: 'red', size: 'L' }
    image?: string;
    created_at: string;
    updated_at: string;
}

// Review
export interface Review {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    title?: string;
    comment?: string;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
    user?: User;
    product?: Product;
}

// Order
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
    id: number;
    order_number: string;
    user_id?: number;
    user?: User;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    customer_city: string;
    customer_province: string;
    customer_postal_code: string;
    customer_country: string;
    subtotal: number;
    tax: number;
    shipping_cost: number;
    total: number;
    status: OrderStatus;
    payment_status: PaymentStatus;
    payment_method?: string;
    payment_id?: string;
    notes?: string;
    shipping_tracking_number?: string;
    shipping_carrier?: string;
    items_count?: number;
    items?: OrderItem[];
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

// Order Item
export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    product_price: number;
    quantity: number;
    subtotal: number;
    order?: Order;
    product?: Product;
    created_at: string;
    updated_at: string;
}

// Cart
export interface CartItem {
    id: number;
    product_id: number;
    name: string;
    price: number;
    discount_price?: number;
    image?: string;
    slug: string;
    quantity: number;
    subtotal: number;
    stock: number;
    max_quantity?: number;
}

export interface CartData {
    items: CartItem[];
    total: number;
    count: number;
    subtotal: number;
    tax: number;
    shipping_cost: number;
    grand_total: number;
}

// Payment
export interface Payment {
    id: number;
    order_id: number;
    payment_method: string;
    payment_id?: string;
    payer_id?: string;
    payer_email?: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    payment_details?: Record<string, any>;
    order?: Order;
    created_at: string;
    updated_at: string;
}

// Wishlist
export interface WishlistItem {
    id: number;
    user_id: number;
    product_id: number;
    product?: Product;
    created_at: string;
    updated_at: string;
}

// Address (User Address Book)
export interface Address {
    id: number;
    user_id: number;
    name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

// ===== FORM & REQUEST TYPES =====

// Product Filters
export interface ProductFilters {
    search?: string;
    category?: number | string;
    brand?: number | string;
    min_price?: number;
    max_price?: number;
    featured?: boolean;
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'popular';
    page?: number;
    per_page?: number;
}

// Order Filters
export interface OrderFilters {
    search?: string;
    status?: OrderStatus;
    payment_status?: PaymentStatus;
    date_from?: string;
    date_to?: string;
    page?: number;
    per_page?: number;
}

// Checkout Data
export interface CheckoutData {
    shipping_address: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        province: string;
        postal_code: string;
        country: string;
    };
    billing_address_same?: boolean;
    billing_address?: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        province: string;
        postal_code: string;
        country: string;
    };
    payment_method: 'bank_transfer' | 'credit_card' | 'ewallet' | 'cod';
    notes?: string;
    cart: Array<{
        id: number;
        quantity: number;
    }>;
}

// ===== RESPONSE TYPES =====

// API Response
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data: T;
    errors?: Record<string, string[]>;
}

// Home Page Data
export interface HomePageData {
    featuredProducts: Product[];
    newProducts: Product[];
    categories: Category[];
    banners?: Array<{
        id: number;
        title: string;
        description: string;
        image: string;
        link: string;
        button_text: string;
    }>;
    testimonials?: Array<{
        id: number;
        name: string;
        rating: number;
        comment: string;
        avatar?: string;
        product_name?: string;
    }>;
}

// Dashboard Stats
export interface DashboardStats {
    total_orders: number;
    total_revenue: number;
    total_products: number;
    total_customers: number;
    recent_orders: Order[];
    top_products: Product[];
    monthly_revenue: Array<{
        month: string;
        revenue: number;
    }>;
}

// ===== COMPONENT PROPS TYPES =====

// Page Props
export interface PageProps<T = Record<string, any>> {
    auth: Auth;
    flash: SharedData['flash'];
    [key: string]: T | unknown;
}

// Product Page Props
export interface ProductsPageProps extends PageProps {
    products: PaginatedData<Product>;
    categories: Category[];
    brands: Brand[];
    filters: ProductFilters;
}

export interface ProductShowPageProps extends PageProps {
    product: Product;
    relatedProducts: Product[];
    reviews: PaginatedData<Review>;
}

// Category Page Props
export interface CategoriesPageProps extends PageProps {
    categories: PaginatedData<Category>;
}

export interface CategoryShowPageProps extends PageProps {
    category: Category;
    products: PaginatedData<Product>;
    subcategories: Category[];
}

// Order Page Props
export interface OrdersPageProps extends PageProps {
    orders: PaginatedData<Order>;
    filters: OrderFilters;
    statusOptions: Record<OrderStatus, string>;
    paymentStatusOptions: Record<PaymentStatus, string>;
}

// Cart Page Props
export interface CartPageProps extends PageProps {
    cart: CartData;
    suggestedProducts: Product[];
}

// Checkout Page Props
export interface CheckoutPageProps extends PageProps {
    cart: CartData;
    addresses: Address[];
    shippingMethods: Array<{
        id: string;
        name: string;
        cost: number;
        estimated_days: number;
    }>;
}

// Admin Dashboard Props
export interface AdminDashboardProps extends PageProps {
    stats: DashboardStats;
}

// ===== UTILITY TYPES =====

// Form Errors
export type FormErrors<T> = Partial<Record<keyof T, string>>;

// Select Option
export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

// Tab
export interface Tab {
    id: string;
    label: string;
    icon?: LucideIcon;
    count?: number;
    disabled?: boolean;
}

// Modal
export interface ModalConfig {
    id: string;
    title: string;
    content: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

// Toast
export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
}

// ===== REACT COMPONENT PROPS =====

export interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: React.ReactNode;
}

export interface ProductCardProps {
    product: Product;
    variant?: 'grid' | 'list' | 'compact';
    showCategory?: boolean;
    showActions?: boolean;
    onAddToCart?: (product: Product) => void;
    onAddToWishlist?: (product: Product) => void;
}

export interface CategoryCardProps {
    category: Category;
    variant?: 'grid' | 'list';
    showCount?: boolean;
}

export interface ReviewCardProps {
    review: Review;
    showProduct?: boolean;
    canDelete?: boolean;
    onDelete?: (id: number) => void;
}

export interface OrderCardProps {
    order: Order;
    variant?: 'detailed' | 'compact';
    showActions?: boolean;
}