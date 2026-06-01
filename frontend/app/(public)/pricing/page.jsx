'use client'
import { useDispatch, useSelector } from "react-redux"
import { setPlan } from "@/lib/features/membership/membershipSlice"
import { Check, X, Crown, Sparkles } from "lucide-react"
import { useState } from "react"

const plans = [
    {
        id: "free",
        name: "Free",
        price: "0",
        period: "forever",
        description: "Everything you need to start shopping smart.",
        icon: Sparkles,
        color: "bg-slate-100",
        badgeColor: "bg-slate-200 text-slate-700",
        buttonStyle: "bg-slate-200 text-slate-700 hover:bg-slate-300",
        features: [
            { text: "Browse all products", included: true },
            { text: "Add to cart & wishlist", included: true },
            { text: "Standard delivery", included: true },
            { text: "Basic customer support", included: true },
            { text: "Priority shipping", included: false },
            { text: "Exclusive member discounts", included: false },
            { text: "Early access to new arrivals", included: false },
            { text: "Free returns", included: false },
        ],
    },
    {
        id: "plus",
        name: "Trendly Plus",
        price: "499",
        period: "/month",
        description: "Unlock premium perks, exclusive deals, and priority service.",
        icon: Crown,
        color: "bg-slate-900",
        badgeColor: "bg-green-500 text-white",
        buttonStyle: "bg-green-500 text-white hover:bg-green-600",
        features: [
            { text: "Browse all products", included: true },
            { text: "Add to cart & wishlist", included: true },
            { text: "Standard delivery", included: true },
            { text: "24/7 premium support", included: true },
            { text: "Priority shipping", included: true },
            { text: "Exclusive member discounts", included: true },
            { text: "Early access to new arrivals", included: true },
            { text: "Free returns on all orders", included: true },
        ],
    },
]

export default function PricingPage() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const dispatch = useDispatch()
    const currentPlan = useSelector(state => state.membership.plan)
    const [selectedPlan, setSelectedPlan] = useState(null)

    const handleSelectPlan = (planId) => {
        dispatch(setPlan(planId))
        setSelectedPlan(planId)
        setTimeout(() => setSelectedPlan(null), 2000)
    }

    return (
        <div className="bg-white min-h-screen">

            {/* Hero */}
            <section className="relative bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 30% 50%, #22c55e 0%, transparent 50%), 
                                          radial-gradient(circle at 70% 30%, #6366f1 0%, transparent 40%)`,
                    }}
                />
                <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Crown size={14} className="text-yellow-400 fill-yellow-400" />
                        Choose your plan
                    </div>
                    <h1 className="text-5xl md:text-7xl font-semibold mb-6 leading-tight">
                        Simple{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                            Pricing
                        </span>
                    </h1>
                    <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
                        Start free. Upgrade to Plus for exclusive discounts, priority shipping, and premium perks.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="max-w-5xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 gap-8">
                    {plans.map((plan) => {
                        const Icon = plan.icon
                        const isCurrentPlan = currentPlan === plan.id
                        const justSelected = selectedPlan === plan.id

                        return (
                            <div
                                key={plan.id}
                                className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:scale-[1.02] ${
                                    plan.id === "plus"
                                        ? "bg-slate-900 text-white border-2 border-green-500/30"
                                        : "bg-white text-slate-800 border-2 border-slate-200"
                                }`}
                            >
                                {/* Popular Badge for Plus */}
                                {plan.id === "plus" && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-green-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                {/* Plan Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                        plan.id === "plus" ? "bg-green-500/20" : "bg-slate-100"
                                    }`}>
                                        <Icon size={20} className={plan.id === "plus" ? "text-green-400" : "text-slate-600"} />
                                    </div>
                                    <h2 className="text-2xl font-semibold">{plan.name}</h2>
                                </div>

                                <p className={`text-sm mb-6 ${plan.id === "plus" ? "text-slate-400" : "text-slate-500"}`}>
                                    {plan.description}
                                </p>

                                {/* Price */}
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-5xl font-semibold">{currency}{plan.price}</span>
                                    <span className={`text-sm ${plan.id === "plus" ? "text-slate-400" : "text-slate-500"}`}>
                                        {plan.period}
                                    </span>
                                </div>

                                {/* Features */}
                                <div className="flex-1 space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            {feature.included ? (
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                                    plan.id === "plus" ? "bg-green-500/20" : "bg-green-100"
                                                }`}>
                                                    <Check size={12} className="text-green-500" />
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-100 shrink-0">
                                                    <X size={12} className="text-slate-400" />
                                                </div>
                                            )}
                                            <span className={`text-sm ${
                                                feature.included
                                                    ? plan.id === "plus" ? "text-slate-200" : "text-slate-700"
                                                    : "text-slate-400 line-through"
                                            }`}>
                                                {feature.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <button
                                    onClick={() => handleSelectPlan(plan.id)}
                                    disabled={isCurrentPlan}
                                    className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                                        isCurrentPlan
                                            ? "bg-slate-200 text-slate-400 cursor-default"
                                            : justSelected
                                                ? "bg-green-500 text-white scale-95"
                                                : plan.id === "plus"
                                                    ? "bg-green-500 hover:bg-green-600 text-white hover:scale-[1.02] active:scale-95"
                                                    : "bg-slate-900 hover:bg-slate-800 text-white hover:scale-[1.02] active:scale-95"
                                    }`}
                                >
                                    {isCurrentPlan
                                        ? "Current Plan"
                                        : justSelected
                                            ? "✓ Plan Activated!"
                                            : plan.id === "plus"
                                                ? "Upgrade to Plus"
                                                : "Get Started Free"
                                    }
                                </button>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* FAQ-ish Bottom Note */}
            <section className="bg-slate-50 py-16">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h3 className="text-2xl font-semibold text-slate-800 mb-3">No commitment. Cancel anytime.</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Trendly Plus can be cancelled any time from your account settings.
                        You'll continue to enjoy Plus benefits until the end of your billing cycle.
                    </p>
                </div>
            </section>
        </div>
    )
}