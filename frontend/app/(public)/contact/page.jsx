import { Mail, Phone, MapPin, Clock, MessageSquare, Instagram, Twitter, Facebook } from "lucide-react";

export const metadata = {
    title: "Contact Us - Trendly.",
    description: "Get in touch with the Trendly team. We're here to help with orders, questions, and feedback.",
};

const contactCards = [
    {
        icon: Mail,
        title: "Email Us",
        subtitle: "We reply within 24 hours",
        detail: "harishmkdev@gmail.com",
        href: "mailto:harishmkdev@gmail.com",
        color: "bg-slate-900",
    },
    {
        icon: Phone,
        title: "Call Us",
        subtitle: "Mon–Sat, 9 AM – 6 PM IST",
        detail: "+91 9025946625",
        href: "tel:+919025946625",
        color: "bg-green-500",
    },
    {
        icon: MapPin,
        title: "Our Location",
        subtitle: "Headquarters",
        detail: "Tamil Nadu, India",
        href: "#",
        color: "bg-slate-700",
    },
];

const faqs = [
    {
        q: "How do I track my order?",
        a: "Once your order is shipped, you'll receive a tracking link via email. You can also check your order status from the 'Orders' section in your account.",
    },
    {
        q: "What is your return policy?",
        a: "We offer a 7-day hassle-free return policy on all products. Simply contact us via email or phone and we'll arrange a pickup.",
    },
    {
        q: "Are payments on Trendly secure?",
        a: "Absolutely. We use industry-standard SSL encryption and our payment gateway is PCI-DSS compliant to keep your data safe.",
    },
    {
        q: "Do you ship across India?",
        a: "Yes! We ship to 500+ cities and towns across India. Delivery times vary from 2–7 business days depending on your location.",
    },
    {
        q: "Can I cancel my order?",
        a: "Orders can be cancelled within 12 hours of placement. After that, please wait for the delivery and initiate a return.",
    },
];

const socials = [
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Twitter, label: "Twitter / X", href: "#" },
    { icon: Facebook, label: "Facebook", href: "#" },
];

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen">

            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 75% 50%, #22c55e 0%, transparent 50%), 
                                          radial-gradient(circle at 20% 30%, #6366f1 0%, transparent 40%)`,
                    }}
                />
                <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <MessageSquare size={14} className="text-green-400" />
                        We're always here to help
                    </div>
                    <h1 className="text-5xl md:text-7xl font-semibold mb-6 leading-tight">
                        Get in{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                            Touch
                        </span>
                    </h1>
                    <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
                        Have a question, feedback, or need support? Reach out to us — 
                        we'd love to hear from you and will get back to you shortly.
                    </p>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid sm:grid-cols-3 gap-6">
                    {contactCards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <a
                                key={i}
                                href={card.href}
                                className={`${card.color} rounded-2xl p-8 text-white group hover:scale-105 transition-transform duration-300 cursor-pointer`}
                            >
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                                    <Icon size={22} />
                                </div>
                                <h3 className="font-semibold text-xl mb-1">{card.title}</h3>
                                <p className="text-white/60 text-sm mb-4">{card.subtitle}</p>
                                <p className="font-medium text-lg group-hover:underline">{card.detail}</p>
                            </a>
                        );
                    })}
                </div>
            </section>

            {/* Business Hours + Social */}
            <section className="bg-slate-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">

                        {/* Business Hours */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                                    <Clock size={18} className="text-white" />
                                </div>
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-widest text-green-500 block">Support Hours</span>
                                    <h2 className="text-2xl font-semibold text-slate-800">When can you reach us?</h2>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { day: "Monday – Friday", time: "9:00 AM – 6:00 PM IST" },
                                    { day: "Saturday", time: "10:00 AM – 4:00 PM IST" },
                                    { day: "Sunday", time: "Closed" },
                                ].map((row, i) => (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center bg-white rounded-xl px-6 py-4 border border-slate-100"
                                    >
                                        <span className="text-slate-600 font-medium">{row.day}</span>
                                        <span className={`font-semibold ${row.time === "Closed" ? "text-red-400" : "text-slate-800"}`}>
                                            {row.time}
                                        </span>
                                    </div>
                                ))}
                                <div className="bg-slate-900 rounded-xl px-6 py-4 flex items-center gap-3">
                                    <Mail size={18} className="text-green-400 shrink-0" />
                                    <div>
                                        <p className="text-white font-medium text-sm">Email support (24/7)</p>
                                        <p className="text-slate-400 text-sm">harishmkdev@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                                    <MessageSquare size={18} className="text-white" />
                                </div>
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-widest text-green-500 block">Social Media</span>
                                    <h2 className="text-2xl font-semibold text-slate-800">Follow us online</h2>
                                </div>
                            </div>
                            <p className="text-slate-500 mb-6 leading-relaxed">
                                Stay updated with the latest products, offers, and style inspiration by following Trendly on social media.
                                DMs are open — we love chatting with our community!
                            </p>
                            <div className="space-y-3">
                                {socials.map((s, i) => {
                                    const Icon = s.icon;
                                    return (
                                        <a
                                            key={i}
                                            href={s.href}
                                            className="flex items-center gap-4 bg-white border border-slate-100 hover:border-slate-300 hover:shadow-md rounded-xl px-6 py-4 transition-all duration-300 group"
                                        >
                                            <div className="w-10 h-10 bg-slate-900 group-hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors duration-300">
                                                <Icon size={18} className="text-white" />
                                            </div>
                                            <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">{s.label}</span>
                                            <span className="ml-auto text-slate-400 text-sm">@trendlyplus</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-14">
                    <span className="text-xs font-semibold uppercase tracking-widest text-green-500 mb-3 block">FAQs</span>
                    <h2 className="text-4xl font-semibold text-slate-800">Frequently Asked Questions</h2>
                    <p className="text-slate-500 mt-3 max-w-xl mx-auto">
                        Can't find what you're looking for? Feel free to reach out to us directly.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:border-slate-300 transition-colors duration-300">
                            <h3 className="font-semibold text-slate-800 mb-2 flex items-start gap-2">
                                <span className="text-green-500 font-bold text-lg leading-none mt-0.5">Q.</span>
                                {faq.q}
                            </h3>
                            <p className="text-slate-500 leading-relaxed pl-5">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                    <h2 className="text-3xl font-semibold mb-3">Still have questions?</h2>
                    <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                        Our support team is happy to help. Drop us an email or give us a call anytime during business hours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:harishmkdev@gmail.com"
                            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
                        >
                            <Mail size={18} />
                            Email Us
                        </a>
                        <a
                            href="tel:+919025946625"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300"
                        >
                            <Phone size={18} />
                            +91 9025946625
                        </a>
                    </div>
                </div>
            </section>

        </div>
    );
}
