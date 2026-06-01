import { ShoppingBag, Zap, Shield, Heart, Users, Star, TrendingUp, Award } from "lucide-react";
import Image from "next/image";
import { assets } from "@/assets/assets";

export const metadata = {
    title: "About Us - Trendly.",
    description: "Learn about Trendly — your premium destination for curated fashion and lifestyle products.",
};

const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "10K+", label: "Products Listed" },
    { value: "500+", label: "Brands Partnered" },
    { value: "4.9★", label: "Average Rating" },
];

const values = [
    {
        icon: Zap,
        title: "Lightning Fast Delivery",
        description: "We partner with top logistics providers to ensure your orders arrive at your doorstep swiftly and safely.",
    },
    {
        icon: Shield,
        title: "100% Secure Payments",
        description: "Shop with confidence. Every transaction is encrypted and protected by industry-leading security standards.",
    },
    {
        icon: Heart,
        title: "Curated with Love",
        description: "Every product on Trendly is hand-picked by our expert team to guarantee quality, style, and value.",
    },
    {
        icon: Users,
        title: "Community Driven",
        description: "Our vibrant community of shoppers and reviewers helps surface the best products for everyone.",
    },
    {
        icon: TrendingUp,
        title: "Always On Trend",
        description: "We continuously update our catalog to bring you the latest in fashion, electronics, and lifestyle.",
    },
    {
        icon: Award,
        title: "Quality Guaranteed",
        description: "Not happy with a purchase? Our hassle-free return policy ensures you're always satisfied.",
    },
];

const team = [
    {
        name: "Harish MK",
        role: "Founder & CEO",
        bio: "Passionate about building seamless shopping experiences that delight customers across India.",
        initials: "HM",
        image: assets.admin_img,
    },
    {
        name: "Product Team",
        role: "Curation Specialists",
        bio: "A dedicated team that scouts and verifies the best products to keep your shopping list fresh.",
        initials: "PT",
    },
    {
        name: "Tech Team",
        role: "Engineering",
        bio: "Building and maintaining the platform that powers millions of shopping journeys every month.",
        initials: "TT",
    },
];

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">

            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), 
                                          radial-gradient(circle at 80% 20%, #22c55e 0%, transparent 40%)`,
                    }}
                />
                <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        Trusted by 50,000+ shoppers across India
                    </div>
                    <h1 className="text-5xl md:text-7xl font-semibold mb-6 leading-tight">
                        We are{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                            Trendly.
                        </span>
                    </h1>
                    <p className="text-slate-300 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
                        Your ultimate destination for curated fashion, electronics, and lifestyle
                        products — delivered to your door with love and speed.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-slate-900 border-t border-slate-700">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-4xl font-semibold text-white mb-1">{stat.value}</p>
                                <p className="text-slate-400 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-green-500 mb-3 block">Our Story</span>
                        <h2 className="text-4xl font-semibold text-slate-800 mb-6 leading-tight">
                            Born out of a passion for better shopping
                        </h2>
                        <p className="text-slate-500 leading-relaxed mb-5">
                            Trendly started with a simple idea: shopping online should feel personal, curated, and exciting — not overwhelming. 
                            We were tired of sifting through thousands of low-quality listings just to find a single great product.
                        </p>
                        <p className="text-slate-500 leading-relaxed mb-5">
                            So we built Trendly — a platform where every product is vetted, every price is competitive, 
                            and every experience is designed to delight. From fashion to electronics, 
                            we handpick the best so you don't have to.
                        </p>
                        <p className="text-slate-500 leading-relaxed">
                            Today, Trendly serves thousands of happy customers across India, with a catalog that grows 
                            every week. Our mission remains the same: <strong className="text-slate-700">shop smarter, live better.</strong>
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col justify-between aspect-square">
                            <ShoppingBag size={36} className="text-green-400" />
                            <div>
                                <p className="text-3xl font-semibold">10K+</p>
                                <p className="text-slate-400 text-sm mt-1">Products available</p>
                            </div>
                        </div>
                        <div className="bg-green-500 rounded-2xl p-8 text-white flex flex-col justify-between aspect-square">
                            <TrendingUp size={36} />
                            <div>
                                <p className="text-3xl font-semibold">2x</p>
                                <p className="text-green-100 text-sm mt-1">Growth year on year</p>
                            </div>
                        </div>
                        <div className="bg-slate-100 rounded-2xl p-8 text-slate-700 flex flex-col justify-between aspect-square">
                            <Users size={36} className="text-slate-600" />
                            <div>
                                <p className="text-3xl font-semibold text-slate-800">50K+</p>
                                <p className="text-slate-500 text-sm mt-1">Active shoppers</p>
                            </div>
                        </div>
                        <div className="bg-slate-800 rounded-2xl p-8 text-white flex flex-col justify-between aspect-square">
                            <Award size={36} className="text-yellow-400" />
                            <div>
                                <p className="text-3xl font-semibold">4.9</p>
                                <p className="text-slate-400 text-sm mt-1">Avg. customer rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="bg-slate-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="text-xs font-semibold uppercase tracking-widest text-green-500 mb-3 block">Why Choose Us</span>
                        <h2 className="text-4xl font-semibold text-slate-800">Built on values that matter</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((v, i) => {
                            const Icon = v.icon;
                            return (
                                <div key={i} className="bg-white rounded-2xl p-8 border border-slate-100 hover:border-slate-300 hover:shadow-lg transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-slate-900 group-hover:bg-green-500 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300">
                                        <Icon size={22} className="text-white" />
                                    </div>
                                    <h3 className="text-slate-800 font-semibold text-lg mb-2">{v.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{v.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-14">
                    <span className="text-xs font-semibold uppercase tracking-widest text-green-500 mb-3 block">The People</span>
                    <h2 className="text-4xl font-semibold text-slate-800">Meet the team behind Trendly</h2>
                </div>
                <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {team.map((member, i) => (
                        <div key={i} className="text-center group">
                            <div className="w-20 h-20 bg-slate-900 group-hover:bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300 overflow-hidden">
                                {member.image ? (
                                    <Image src={member.image} alt={member.name} className="w-full h-full object-cover" width={80} height={80} />
                                ) : (
                                    <span className="text-white font-semibold text-xl">{member.initials}</span>
                                )}
                            </div>
                            <h3 className="font-semibold text-slate-800 text-lg">{member.name}</h3>
                            <p className="text-green-500 text-sm font-medium mb-2">{member.role}</p>
                            <p className="text-slate-500 text-sm leading-relaxed">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                    <h2 className="text-4xl font-semibold mb-4">Ready to start shopping smarter?</h2>
                    <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                        Join thousands of customers who trust Trendly for their everyday needs.
                    </p>
                    <a
                        href="/shop"
                        className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:scale-105"
                    >
                        Explore the Shop
                    </a>
                </div>
            </section>

        </div>
    );
}
