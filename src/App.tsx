import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Star, Shield, Clock, Brain, Zap, Heart, Users, Calendar, Mail, Car, ShoppingBag, Dumbbell, Gift, ArrowRight, Play, Menu, X, Instagram, Twitter, Linkedin } from 'lucide-react';

function App() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "How smart is Rajni, really?",
      answer: "Rajni understands your intent, not just your words. It learns from your habits, preferences, and routines — and improves over time. No micromanagement needed."
    },
    {
      question: "Will Rajni read my private chats, photos, or files?",
      answer: "Nope. Never. Rajni only uses the information you explicitly share to help with tasks. Your messages, files, and photos stay 100% private."
    },
    {
      question: "What apps and services does Rajni integrate with?",
      answer: "Calendar, email, maps, cab services, food delivery, fitness apps, and more. We're constantly adding new integrations — and Rajni will suggest them when it makes sense for your life."
    },
    {
      question: "Can I customize how Rajni talks to me?",
      answer: "Yes! You can set the tone (professional, casual, cheeky), preferred timings, even blackout hours. Rajni respects your vibe."
    },
    {
      question: "Is Rajni safe to trust with sensitive data?",
      answer: "Yes — privacy-first, encryption-backed, and fully compliant with Indian data laws. And you can delete your data anytime, no questions asked."
    }
  ];

  return (
    <div className="min-h-screen bg-[#101010] font-body particle-field">
      {/* Navigation */}
      <nav className="fixed top-0 w-full glass-panel z-50 border-b border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-lg flex items-center justify-center voice-calm">
                <Brain className="w-5 h-5 text-[#101010] icon-hover" strokeWidth={1.5} />
              </div>
              <span className="text-xl font-header font-bold text-[#F2F2F2]">RajniAI</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-[#F2F2F2]/70 hover:text-[#00FFAB] font-body icon-hover">Features</a>
              <a href="#pricing" className="text-[#F2F2F2]/70 hover:text-[#00FFAB] font-body icon-hover">Pricing</a>
              <a href="#privacy" className="text-[#F2F2F2]/70 hover:text-[#00FFAB] font-body icon-hover">Privacy</a>
              <button className="bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] text-[#101010] px-6 py-2 rounded-full font-header font-semibold btn-lift btn-ripple soft-glow">
                Try Free
              </button>
            </div>

            <button 
              className="md:hidden text-[#F2F2F2] icon-hover"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-t border-[#2A2A2A]">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block text-[#F2F2F2]/70 hover:text-[#00FFAB] font-body">Features</a>
              <a href="#pricing" className="block text-[#F2F2F2]/70 hover:text-[#00FFAB] font-body">Pricing</a>
              <a href="#privacy" className="block text-[#F2F2F2]/70 hover:text-[#00FFAB] font-body">Privacy</a>
              <button className="w-full bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] text-[#101010] px-6 py-2 rounded-full font-header font-semibold btn-ripple">
                Try Free
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Section 1: Hero Banner */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#101010] via-[#2A2A2A]/20 to-[#101010]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[#F2F2F2] mb-6 leading-tight neon-glow">
            YOUR PERSONAL AI.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFAB] to-[#1F51FF]">
              ALWAYS ON. ALWAYS ONE STEP AHEAD.
            </span>
          </h1>
          <p className="font-body text-xl md:text-2xl text-[#F2F2F2]/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            From booking cabs to planning weekends to replying to emails—RajniAI handles your busy life, so you can live like a superstar.
          </p>
          <button className="bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] text-[#101010] px-12 py-4 rounded-full text-lg font-header font-bold btn-lift btn-ripple soft-glow inline-flex items-center space-x-2">
            <span>Try RajniAI Free</span>
            <ArrowRight className="w-5 h-5 icon-hover" strokeWidth={1.5} />
          </button>
        </div>
      </section>

      {/* Section 2: Not Just Smart. Superstar Smart */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#101010]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-header text-3xl md:text-5xl font-bold text-[#F2F2F2] mb-6">
              Not Just Smart. <span className="text-[#FF6B35] neon-glow">SUPERSTAR SMART</span>
            </h2>
            <p className="font-body text-xl text-[#F2F2F2]/80 max-w-3xl mx-auto">
              You're ambitious, always on the move, and juggling more than most. RajniAI doesn't just catch up — it runs ahead, clearing the path before you even ask.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Brain, title: "Thinks Ahead", desc: "Rajni plans your day, sends timely nudges, and auto-adjusts when life changes — so nothing falls through the cracks.", color: "from-[#00FFAB] to-[#1F51FF]" },
              { icon: Zap, title: "Acts Instantly", desc: "From ordering lunch to scheduling workouts, booking a cab to drafting emails — one tap, done.", color: "from-[#1F51FF] to-[#00FFAB]" },
              { icon: Clock, title: "Simplifies Your Headspace", desc: "Rajni declutters your to-dos, organizes errands, even blocks time to help you breathe between Zoom calls.", color: "from-[#FF6B35] to-[#00FFAB]" },
              { icon: Shield, title: "Built with Respect", desc: "Rajni keeps your data private and secure — no ads, no leaks, no creepy tracking. You're always in control.", color: "from-[#00FFAB] to-[#FF6B35]" },
              { icon: Heart, title: "Feels Personal", desc: "Knows how you like your weekends, who to send birthday gifts to, and when you need chai — learns your vibe, your pace, your flow.", color: "from-[#1F51FF] to-[#FF6B35]" }
            ].map((feature, index) => (
              <div key={index} className="glass-panel p-8 rounded-2xl btn-lift border border-[#2A2A2A]/50">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 voice-calm`}>
                  <feature.icon className="w-6 h-6 text-[#101010] icon-hover" strokeWidth={1.5} />
                </div>
                <h3 className="font-header text-xl font-semibold text-[#F2F2F2] mb-3">{feature.title}</h3>
                <p className="font-body text-[#F2F2F2]/70">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="font-body text-lg text-[#F2F2F2]/80 mb-8">Ready to see Rajni in action?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="glass-panel text-[#F2F2F2] px-8 py-3 rounded-full btn-lift btn-ripple border border-[#2A2A2A] font-header inline-flex items-center space-x-2">
                <span>👇 Scroll to Features</span>
              </button>
              <button className="bg-[#FF6B35] text-[#F2F2F2] px-8 py-3 rounded-full btn-lift btn-ripple hero-glow font-header inline-flex items-center space-x-2">
                <span>🔥 Try Rajni Now</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: What RajniAI Can Do */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#2A2A2A]/30 to-[#101010]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-header text-3xl md:text-5xl font-bold text-[#F2F2F2] mb-6">
              What RajniAI Can Do <span className="text-[#1F51FF] neon-glow">(So You Don't Have To)</span>
            </h2>
            <p className="font-body text-xl text-[#F2F2F2]/80 max-w-3xl mx-auto">
              Rajni doesn't just listen — it executes. Here's what your daily life looks like with a personal AI that handles the grind behind the glam.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {[
              {
                title: "Workday Simplified",
                icon: Calendar,
                color: "from-[#1F51FF] to-[#00FFAB]",
                features: [
                  "Plans your day and blocks deep work",
                  "Drafts emails, filters the fluff",
                  "Summarizes meetings and sets follow-ups"
                ]
              },
              {
                title: "Life Admin? Done.",
                icon: Car,
                color: "from-[#00FFAB] to-[#1F51FF]",
                features: [
                  "Books cabs and tracks ETAs",
                  "Handles groceries and meal reorders",
                  "Reminds you about bills, pickups, renewals"
                ]
              },
              {
                title: "Wellness on Autopilot",
                icon: Dumbbell,
                color: "from-[#FF6B35] to-[#00FFAB]",
                features: [
                  "Schedules workouts and stretch breaks",
                  "Books health checks, stores prescriptions",
                  "Suggests calm breaks when it senses overload"
                ]
              },
              {
                title: "Fun Made Effortless",
                icon: Gift,
                color: "from-[#00FFAB] to-[#FF6B35]",
                features: [
                  "Finds gifts, orders, tracks",
                  "Plans movie nights, snacks included",
                  "Books tables based on your vibe"
                ]
              }
            ].map((category, index) => (
              <div key={index} className="glass-panel p-8 rounded-2xl btn-lift border border-[#2A2A2A]/50">
                <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mb-6 voice-thinking`}>
                  <category.icon className="w-8 h-8 text-[#101010] icon-hover" strokeWidth={1.5} />
                </div>
                <h3 className="font-header text-2xl font-bold text-[#F2F2F2] mb-6">{category.title}</h3>
                <ul className="space-y-4">
                  {category.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-[#00FFAB] mt-0.5 flex-shrink-0 icon-pulse" strokeWidth={1.5} />
                      <span className="font-body text-[#F2F2F2]/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 p-8 bg-gradient-to-r from-[#1F51FF] to-[#00FFAB] rounded-2xl">
            <h3 className="font-header text-2xl font-bold mb-4 text-[#101010]">Bonus? Rajni Learns You.</h3>
            <p className="font-body text-lg text-[#101010]/80">The more you use it, the better it fits. It's like life-on-easy-mode — with style.</p>
          </div>
        </div>
      </section>

      {/* Section 4: How RajniAI Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#101010]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-header text-3xl md:text-5xl font-bold text-[#F2F2F2] mb-6">
              How RajniAI Works <span className="text-[#00FFAB] neon-glow">(It's Easier Than You Think)</span>
            </h2>
            <p className="font-body text-xl text-[#F2F2F2]/80 max-w-3xl mx-auto">
              You don't need 10 apps or a 20-step workflow. Just one message to Rajni—and life starts running smoother.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                step: "Step 1",
                title: "Say Hello",
                desc: "Set up once, and tell Rajni how you like your life.",
                detail: "From calendar preferences to favorite chai time, Rajni gets to know your flow.",
                icon: Users,
                color: "from-[#00FFAB] to-[#1F51FF]"
              },
              {
                step: "Step 2",
                title: "Ask Anything",
                desc: "Chat with Rajni like you would with a real assistant.",
                detail: '"Plan my day." "Order groceries." "Block me 30 minutes to breathe." Rajni gets it, acts instantly.',
                icon: Mail,
                color: "from-[#1F51FF] to-[#FF6B35]"
              },
              {
                step: "Step 3",
                title: "Rajni Delivers",
                desc: "Schedules it. Orders it. Reminds you. Follows up.",
                detail: "You get more done—with zero mental overload.",
                icon: Check,
                color: "from-[#FF6B35] to-[#00FFAB]"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mb-6 mx-auto btn-lift voice-excited shadow-lg`}>
                  <step.icon className="w-10 h-10 text-[#101010] icon-hover" strokeWidth={1.5} />
                </div>
                <div className="bg-[#1F51FF] text-[#F2F2F2] px-4 py-1 rounded-full text-sm font-header font-semibold mb-4 inline-block">
                  {step.step}
                </div>
                <h3 className="font-header text-2xl font-bold text-[#F2F2F2] mb-4">{step.title}</h3>
                <p className="font-body text-lg text-[#F2F2F2]/80 mb-4">{step.desc}</p>
                <p className="font-body text-[#F2F2F2]/60">{step.detail}</p>
              </div>
            ))}
          </div>

          <div className="text-center glass-panel p-8 rounded-2xl border border-[#2A2A2A]/50">
            <h3 className="font-header text-2xl font-bold text-[#F2F2F2] mb-4">And the More You Use It…</h3>
            <p className="font-body text-lg text-[#F2F2F2]/80">
              Rajni becomes smarter, faster, and more you—like the real-world PA you never had.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#2A2A2A]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-header text-3xl md:text-5xl font-bold text-[#F2F2F2] mb-6">
              Who's Already <span className="text-[#FF6B35] neon-glow">ROLLING WITH RAJNI?</span>
            </h2>
            <p className="font-body text-xl text-[#F2F2F2]/80 max-w-3xl mx-auto">
              Thousands of urban professionals are making RajniAI part of their daily flow. Here's how real users use it—and what they love.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "Neha, 29",
                role: "Consultant, Mumbai",
                quote: "Rajni clears my inbox and plans my week better than I ever did.",
                features: ["Daily planner", "Weekly meal prep & grocery", "Birthday reminders auto-handled"],
                avatar: "N",
                color: "from-[#00FFAB] to-[#1F51FF]"
              },
              {
                name: "Rahul, 33",
                role: "Product Manager, Delhi",
                quote: "Feels like I have a chief of staff, minus the office politics.",
                features: ["Summarizes meetings", "Schedules workouts", "Books weekend getaways"],
                avatar: "R",
                color: "from-[#1F51FF] to-[#FF6B35]"
              },
              {
                name: "Ananya, 30",
                role: "Freelance Designer, Bangalore",
                quote: "No more scattered apps. Just one Rajni to run it all.",
                features: ["Tracks freelance gigs", "Auto-organizes projects + calendar", "Manages subscriptions"],
                avatar: "A",
                color: "from-[#FF6B35] to-[#00FFAB]"
              }
            ].map((testimonial, index) => (
              <div key={index} className="glass-panel p-8 rounded-2xl btn-lift border border-[#2A2A2A]/50">
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-[#101010] font-header font-bold text-lg mr-4 voice-calm`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-header font-semibold text-[#F2F2F2]">{testimonial.name}</h4>
                    <p className="font-body text-[#F2F2F2]/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="font-body text-lg text-[#F2F2F2]/80 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <ul className="space-y-2">
                  {testimonial.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-[#00FFAB] icon-pulse" strokeWidth={1.5} />
                      <span className="font-body text-[#F2F2F2]/70 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { metric: "8+ hours", label: "saved per week", color: "from-[#00FFAB] to-[#1F51FF]" },
              { metric: "90%", label: "say they feel more in control of life", color: "from-[#1F51FF] to-[#FF6B35]" },
              { metric: "100%", label: "data remains private—always", color: "from-[#FF6B35] to-[#00FFAB]" }
            ].map((stat, index) => (
              <div key={index} className="glass-panel p-6 rounded-xl border border-[#2A2A2A]/50 btn-lift">
                <div className={`font-display text-3xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 neon-glow`}>{stat.metric}</div>
                <div className="font-body text-[#F2F2F2]/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#101010]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-header text-3xl md:text-5xl font-bold text-[#F2F2F2] mb-6">
              Plans That <span className="text-[#1F51FF] neon-glow">WORK LIKE YOU DO</span>
            </h2>
            <p className="font-body text-xl text-[#F2F2F2]/80 max-w-3xl mx-auto">
              Whether you just want to lighten your daily load or unlock full-on concierge mode, Rajni's got a plan that fits.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "Starter",
                price: "₹0",
                period: "14-day Free Trial",
                color: "border-[#00FFAB]/30 glass-panel",
                buttonColor: "bg-[#00FFAB] hover:bg-[#00FFAB]/90 text-[#101010] soft-glow",
                description: "Try Rajni, risk-free. You'll wonder how you ever lived without it.",
                features: ["Daily planner", "Calendar sync", "Task manager", "Basic chat interface"]
              },
              {
                name: "Pro",
                price: "₹299",
                period: "/month",
                color: "border-[#1F51FF]/30 glass-panel",
                buttonColor: "bg-[#1F51FF] hover:bg-[#1F51FF]/90 text-[#F2F2F2] cyber-glow",
                description: "For those who want more structure, less chaos.",
                features: [
                  "Everything in Starter, plus:",
                  "Smart email drafts + filters",
                  "Meal + grocery planning",
                  "Travel and cab bookings",
                  "Workout + wellness nudges"
                ]
              },
              {
                name: "Superstar",
                price: "₹499",
                period: "/month",
                color: "border-[#FF6B35]/50 bg-gradient-to-br from-[#2A2A2A] to-[#2A2A2A]/80",
                buttonColor: "bg-gradient-to-r from-[#FF6B35] to-[#00FFAB] hover:from-[#FF6B35]/90 hover:to-[#00FFAB]/90 text-[#101010] hero-glow",
                description: "The full Rajni experience. A personal assistant in your pocket.",
                popular: true,
                features: [
                  "Everything in Pro, plus:",
                  "Gifting concierge + event planner",
                  "Custom automations",
                  "Personalized insights & life reviews",
                  "Early access to new features",
                  "VIP Support"
                ]
              }
            ].map((plan, index) => (
              <div key={index} className={`relative border-2 ${plan.color} rounded-2xl p-8 btn-lift ${plan.popular ? 'transform scale-105 voice-excited' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#FF6B35] to-[#00FFAB] text-[#101010] px-4 py-1 rounded-full text-sm font-header font-semibold success-sparkle">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="font-header text-2xl font-bold text-[#F2F2F2] mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="font-display text-4xl text-[#F2F2F2]">{plan.price}</span>
                    <span className="font-body text-[#F2F2F2]/60 ml-1">{plan.period}</span>
                  </div>
                  <p className="font-body text-[#F2F2F2]/70">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-[#00FFAB] mt-0.5 flex-shrink-0 icon-pulse" strokeWidth={1.5} />
                      <span className={`font-body text-[#F2F2F2]/80 ${feature.includes('Everything') ? 'font-semibold' : ''}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full ${plan.buttonColor} py-3 rounded-full font-header font-semibold btn-lift btn-ripple`}>
                  {plan.name === 'Starter' ? 'Start Free Trial' : `Choose ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center glass-panel p-8 rounded-2xl border border-[#2A2A2A]/50">
            <p className="font-body text-lg text-[#F2F2F2]/80 mb-4">
              Start with the free trial. Upgrade when you're ready to Rajni like a boss.
            </p>
            <button className="bg-gradient-to-r from-[#00FFAB] to-[#1F51FF] text-[#101010] px-8 py-3 rounded-full font-header font-semibold btn-lift btn-ripple soft-glow inline-flex items-center space-x-2">
              <span>🚀 Start Free for 14 Days</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 7: Privacy */}
      <section id="privacy" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#2A2A2A]/30 to-[#101010]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-header text-3xl md:text-5xl font-bold text-[#F2F2F2] mb-6">
              Rajni Keeps It <span className="text-[#00FFAB] neon-glow">PRIVATE. ALWAYS.</span>
            </h2>
            <p className="font-body text-xl text-[#F2F2F2]/80 max-w-3xl mx-auto">
              You're trusting Rajni with your calendar, habits, and decisions — that's not a small thing. So here's our deal:
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div className="glass-panel p-8 rounded-2xl border border-[#2A2A2A]/50">
              <h3 className="font-header text-2xl font-bold text-[#FF6B35] mb-6 flex items-center neon-glow">
                <Shield className="w-8 h-8 mr-3 icon-hover" strokeWidth={1.5} />
                What Rajni Never Does
              </h3>
              <ul className="space-y-4">
                {[
                  "Never sells your data",
                  "Never listens when it shouldn't",
                  "Never shares info with third parties",
                  "Never stores personal content beyond what's needed"
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <X className="w-5 h-5 text-[#FF6B35] icon-hover" strokeWidth={1.5} />
                    <span className="font-body text-[#F2F2F2]/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-[#2A2A2A]/50">
              <h3 className="font-header text-2xl font-bold text-[#00FFAB] mb-6 flex items-center neon-glow">
                <Check className="w-8 h-8 mr-3 icon-pulse" strokeWidth={1.5} />
                What Rajni Always Does
              </h3>
              <ul className="space-y-4">
                {[
                  "Encrypts all your data — in transit and at rest",
                  "Gives you control over what's stored",
                  "Lets you delete your entire profile anytime",
                  "Hosts data on India-based servers (for full compliance)"
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-[#00FFAB] icon-pulse" strokeWidth={1.5} />
                    <span className="font-body text-[#F2F2F2]/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl text-center border border-[#2A2A2A]/50">
            <h3 className="font-header text-2xl font-bold text-[#F2F2F2] mb-6">We Follow the Rules</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-[#1F51FF] icon-hover" strokeWidth={1.5} />
                <span className="font-body text-[#F2F2F2]/80">Fully compliant with India's Digital Personal Data Protection Act</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-[#1F51FF] icon-hover" strokeWidth={1.5} />
                <span className="font-body text-[#F2F2F2]/80">Optional local storage if you prefer not to use cloud</span>
              </div>
            </div>
            <div className="mt-6">
              <a href="#" className="font-body text-[#00FFAB] hover:text-[#00FFAB]/80 underline icon-hover">
                Full transparency — our Privacy Policy lays it all out
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1F51FF] to-[#00FFAB]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl mb-6 text-[#101010] neon-glow">
            READY FOR YOUR PERSONAL AI — <span className="text-[#FF6B35]">SUPERSTAR STYLE?</span>
          </h2>
          <p className="font-body text-xl mb-8 max-w-3xl mx-auto text-[#101010]/80">
            You've seen what Rajni can do. Now it's your turn to live smarter, move faster, and delegate like a boss.
          </p>
          <p className="font-body text-lg mb-12 text-[#101010]/70">
            No stress. No noise. Just Rajni, at your command.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="bg-[#101010] text-[#00FFAB] px-10 py-4 rounded-full text-lg font-header font-bold btn-lift btn-ripple inline-flex items-center space-x-2">
              <span>🔥 Get RajniAI Today – Start Free</span>
            </button>
          </div>
          
          <p className="font-body text-sm mt-6 text-[#101010]/60">
            14-day free trial. No card needed. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Section 9: FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#101010]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-header text-3xl md:text-5xl font-bold text-[#F2F2F2] mb-6">
              Frequently Asked <span className="text-[#1F51FF] neon-glow">QUESTIONS</span>
            </h2>
            <p className="font-body text-xl text-[#F2F2F2]/80">
              Even superstars ask questions. Here are answers to the ones we get the most.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border border-[#2A2A2A] rounded-xl overflow-hidden glass-panel">
                <button
                  className="w-full px-6 py-4 text-left bg-[#2A2A2A] hover:bg-[#2A2A2A]/80 btn-lift flex items-center justify-between"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-header font-semibold text-[#F2F2F2]">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-[#00FFAB] icon-hover" strokeWidth={1.5} />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#00FFAB] icon-hover" strokeWidth={1.5} />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 py-4 bg-[#101010]">
                    <p className="font-body text-[#F2F2F2]/80">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 11: The Rajni Club */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#2A2A2A]/30 to-[#101010]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#F2F2F2] mb-6 neon-glow">
              🌟 THE <span className="text-[#FF6B35]">RAJNI CLUB</span>
            </h2>
            <p className="font-body text-xl text-[#F2F2F2]/80 max-w-3xl mx-auto">
              You're Not Just Using Rajni — You're Joining a Smarter Tribe. RajniAI isn't just a tool. It's a movement of modern professionals simplifying life, saving time, and living better.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-2xl text-center border border-[#2A2A2A]/50 btn-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1F51FF] to-[#00FFAB] rounded-full flex items-center justify-center mx-auto mb-6 voice-calm">
                <Star className="w-8 h-8 text-[#101010] icon-hover" strokeWidth={1.5} />
              </div>
              <h3 className="font-header text-xl font-bold text-[#F2F2F2] mb-4">Your Story, Your Style</h3>
              <p className="font-body text-[#F2F2F2]/70 mb-6">
                Tell us how Rajni simplified your day. From inbox cleanups to weekend plans — we'd love to hear your Rajni win.
              </p>
              <button className="bg-[#1F51FF] text-[#F2F2F2] px-6 py-2 rounded-full btn-lift btn-ripple cyber-glow font-header">
                📩 Share Your Story
              </button>
            </div>

            <div className="glass-panel p-8 rounded-2xl text-center border border-[#2A2A2A]/50 btn-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-full flex items-center justify-center mx-auto mb-6 voice-thinking">
                <Gift className="w-8 h-8 text-[#101010] icon-hover" strokeWidth={1.5} />
              </div>
              <h3 className="font-header text-xl font-bold text-[#F2F2F2] mb-4">Refer & Earn: 1 Month Free for Both</h3>
              <p className="font-body text-[#F2F2F2]/70 mb-6">
                Love Rajni? Tell a friend. They get a free month. You get a free month. Superstar stuff.
              </p>
              <button className="bg-[#00FFAB] text-[#101010] px-6 py-2 rounded-full btn-lift btn-ripple soft-glow font-header">
                🔗 Invite Now
              </button>
            </div>

            <div className="glass-panel p-8 rounded-2xl text-center border border-[#2A2A2A]/50 btn-lift">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#00FFAB] rounded-full flex items-center justify-center mx-auto mb-6 voice-excited">
                <Users className="w-8 h-8 text-[#101010] icon-hover" strokeWidth={1.5} />
              </div>
              <h3 className="font-header text-xl font-bold text-[#F2F2F2] mb-4">Join the Rajni Circle</h3>
              <p className="font-body text-[#F2F2F2]/70 mb-6">
                Get tips, feature drops, and community wisdom from other Rajni users.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-[#FF6B35] text-[#F2F2F2] px-6 py-2 rounded-full btn-lift btn-ripple hero-glow font-header">
                  💬 Join on Slack
                </button>
                <button className="w-full bg-[#1F51FF] text-[#F2F2F2] px-6 py-2 rounded-full btn-lift btn-ripple cyber-glow font-header">
                  📱 Hop into our Telegram
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101010] text-[#F2F2F2] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-[#00FFAB] to-[#1F51FF] rounded-lg flex items-center justify-center voice-calm">
                  <Brain className="w-5 h-5 text-[#101010] icon-hover" strokeWidth={1.5} />
                </div>
                <span className="font-header text-2xl font-bold">RajniAI</span>
              </div>
              <p className="font-body text-lg text-[#F2F2F2]/70 mb-6 max-w-md">
                Work smart. Live smart. The Rajni Way.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 glass-panel rounded-full flex items-center justify-center btn-lift group">
                  <Instagram className="w-5 h-5 group-hover:text-[#FF6B35] icon-hover" strokeWidth={1.5} />
                </a>
                <a href="#" className="w-10 h-10 glass-panel rounded-full flex items-center justify-center btn-lift group">
                  <Twitter className="w-5 h-5 group-hover:text-[#1F51FF] icon-hover" strokeWidth={1.5} />
                </a>
                <a href="#" className="w-10 h-10 glass-panel rounded-full flex items-center justify-center btn-lift group">
                  <Linkedin className="w-5 h-5 group-hover:text-[#00FFAB] icon-hover" strokeWidth={1.5} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-header text-lg font-semibold mb-6 flex items-center">
                <span className="mr-2">🔗</span>
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="font-body text-[#F2F2F2]/70 hover:text-[#00FFAB] icon-hover">About</a></li>
                <li><a href="#" className="font-body text-[#F2F2F2]/70 hover:text-[#00FFAB] icon-hover">Privacy Policy</a></li>
                <li><a href="#" className="font-body text-[#F2F2F2]/70 hover:text-[#00FFAB] icon-hover">Terms of Use</a></li>
                <li><a href="#" className="font-body text-[#F2F2F2]/70 hover:text-[#00FFAB] icon-hover">Contact Us</a></li>
              </ul>
            </div>

            {/* Explore */}
            <div>
              <h4 className="font-header text-lg font-semibold mb-6 flex items-center">
                <span className="mr-2">🚀</span>
                Explore
              </h4>
              <ul className="space-y-3">
                <li><a href="#features" className="font-body text-[#F2F2F2]/70 hover:text-[#00FFAB] icon-hover">Features</a></li>
                <li><a href="#pricing" className="font-body text-[#F2F2F2]/70 hover:text-[#00FFAB] icon-hover">Pricing</a></li>
                <li><a href="#" className="font-body text-[#F2F2F2]/70 hover:text-[#00FFAB] icon-hover">FAQ</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-[#2A2A2A] text-center">
            <p className="font-body text-[#F2F2F2]/60">
              © 2025 RajniAI. Made with ❤️ in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;