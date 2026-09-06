import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FadeInSection from '../components/FadeInSection';

const FEATURES = [
  { icon: '⚡', title: 'Instant Symptom Check', desc: 'Get an instant urgency reading based on your symptoms, before you even see a doctor.' },
  { icon: '🔒', title: 'Secure & Private Data', desc: 'Your health and personal data stays confidential, protected with encrypted login.' },
  { icon: '📅', title: 'Track Appointment History', desc: 'Access your past appointments, prescriptions, and doctor notes anytime.' },
  { icon: '🎙️', title: 'Voice Assistant', desc: 'Speak in Hindi, English, Hinglish, or Marathi — no typing needed.' },
];

const TOOLS = [
  { title: 'Symptom Checker', desc: 'Select your symptoms and instantly know how urgent your condition is.', cta: 'Check Symptoms', to: '/register' },
  { title: 'Find a Doctor', desc: 'Search doctors by specialization, state, and city near you.', cta: 'Find Doctors', to: '/register' },
  { title: 'Book Appointment', desc: 'Request a slot and get a permanent digital prescription record.', cta: 'Book Now', to: '/register' },
];

const FAQS = [
  { q: 'What is Rural Healthcare Connect?', a: 'A platform that helps patients in underserved areas check symptoms, find doctors, and book appointments online.' },
  { q: 'Who can use this platform?', a: 'Anyone — patients looking for care, and doctors who want to offer consultations to rural and semi-urban patients.' },
  { q: 'How do I register?', a: 'Click "Register Now", choose Patient or Doctor, fill in your details and photo, and you\'re ready to go.' },
  { q: 'Is my data safe?', a: 'Yes, all accounts are protected with encrypted passwords and secure login tokens.' },
];

function Home() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="bg-white dark:bg-slate-950 text-gray-800 dark:text-white transition-colors">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-gray-200 dark:border-slate-800">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-6 py-24 relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <FadeInSection>
            <span className="inline-block bg-gradient-to-r from-orange-500 to-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              HEALTHCARE FOR EVERY VILLAGE
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Quality healthcare,{' '}
              <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                just a tap away
              </span>
            </h1>
            <p className="text-gray-600 dark:text-slate-400 text-lg mb-8">
              Check symptoms, find the right doctor, and book appointments —
              all from your phone, in your own language.
            </p>

            {!user && (
              <div className="flex gap-4">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 hover:scale-105 transition-transform"
                >
                  Register Now
                </Link>
                <Link
                  to="/login"
                  className="border border-gray-300 dark:border-slate-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-slate-800 hover:scale-105 transition-transform"
                >
                  Login
                </Link>
              </div>
            )}

            {user && (
              <Link
                to={user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard'}
                className="inline-block bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 hover:scale-105 transition-transform"
              >
                Go to Dashboard
              </Link>
            )}
          </FadeInSection>

          <FadeInSection delay={150}>
            <div className="hidden md:grid grid-cols-2 gap-3 h-80">
              <img
                src="https://images.unsplash.com/photo-1758691463620-188ca7c1a04f?fm=jpg&q=60&w=600&auto=format&fit=crop"
                alt="Doctor consulting patient via video call"
                className="rounded-xl shadow-xl border border-gray-200 dark:border-slate-800 w-full h-full object-cover row-span-2 hover:scale-[1.03] transition-transform duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1758691462430-81160850496c?fm=jpg&q=60&w=600&auto=format&fit=crop"
                alt="Doctor consulting elderly patient and child"
                className="rounded-xl shadow-xl border border-gray-200 dark:border-slate-800 w-full h-full object-cover hover:scale-[1.03] transition-transform duration-300"
              />
              <div className="grid grid-cols-2 gap-3">
                <img
                  src="https://images.unsplash.com/photo-1631980839324-fdfabbf1a573?fm=jpg&q=60&w=400&auto=format&fit=crop"
                  alt="Medicine and tablets"
                  className="rounded-xl shadow-xl border border-gray-200 dark:border-slate-800 w-full h-full object-cover hover:scale-[1.03] transition-transform duration-300"
                />
                <img
                  src="https://images.unsplash.com/photo-1648224395277-052c8108efa3?fm=jpg&q=60&w=400&auto=format&fit=crop"
                  alt="Hospital medical equipment"
                  className="rounded-xl shadow-xl border border-gray-200 dark:border-slate-800 w-full h-full object-cover hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>

      {/* Why patients love us */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <FadeInSection>
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Patients <span className="text-orange-500 dark:text-orange-400">Love Us</span>
          </h2>
        </FadeInSection>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <FadeInSection key={f.title} delay={i * 100}>
              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 hover:border-orange-400 dark:hover:border-orange-500/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm">{f.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-50 dark:bg-slate-900/50 border-y border-gray-200 dark:border-slate-800 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInSection>
            <h2 className="text-3xl font-bold text-center mb-16">
              Your Care <span className="text-orange-500 dark:text-orange-400">Journey</span>
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {[
              { icon: '📝', title: 'Sign Up & Get Started', desc: 'Register as a patient or doctor and set up your profile.' },
              { icon: '🩺', title: 'Check Symptoms & Search', desc: 'Use the symptom checker and find doctors near you.' },
              { icon: '✅', title: 'Get Treated', desc: 'Book an appointment and receive a digital prescription.' },
            ].map((step, i) => (
              <FadeInSection key={step.title} delay={i * 150}>
                <div className="text-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-4xl mb-3">{step.icon}</div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-slate-400 text-sm">{step.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection delay={300}>
            <div className="h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
              <div className="h-full w-2/3 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full" />
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-500">
              <span>1. Sign Up</span>
              <span>2. Find Doctor</span>
              <span>3. Get Treated</span>
            </div>
          </FadeInSection>
        </div>
      </div>

      {/* Tools */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <FadeInSection>
          <h2 className="text-3xl font-bold text-center mb-12">
            Explore Our <span className="text-orange-500 dark:text-orange-400">Tools</span>
          </h2>
        </FadeInSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOOLS.map((tool, i) => (
            <FadeInSection key={tool.title} delay={i * 120}>
              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 flex flex-col h-full hover:border-blue-400 dark:hover:border-blue-500/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-6 flex-1">{tool.desc}</p>
                <Link
                  to={tool.to}
                  className="bg-gradient-to-r from-orange-500 to-blue-500 text-white text-center py-2.5 rounded-lg font-medium hover:opacity-90 hover:scale-[1.03] transition-all"
                >
                  {tool.cta} →
                </Link>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className="bg-gray-50 dark:bg-slate-900/50 border-y border-gray-200 dark:border-slate-800 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeInSection>
            <h2 className="text-orange-500 dark:text-orange-400 font-bold text-xl mb-8">What Our Users Say</h2>
            <div className="bg-white text-slate-800 rounded-xl p-6 text-left shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-lg">👤</div>
                <div>
                  <p className="font-semibold">Abhishek Yadav</p>
                  <p className="text-orange-500 text-sm">★★★★★</p>
                </div>
              </div>
              <p className="italic text-slate-600">
                "Mujhe apne gaon mein doctor dhoondhna mushkil tha. Is platform se
                5 minute mein appointment book ho gayi."
              </p>
            </div>
          </FadeInSection>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 py-20">
        <FadeInSection>
          <h2 className="text-3xl font-bold text-center mb-2">
            Frequently Asked <span className="text-orange-500 dark:text-orange-400">Questions</span>
          </h2>
          <p className="text-center text-gray-600 dark:text-slate-400 mb-10">
            Find answers to common questions about our platform.
          </p>
        </FadeInSection>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <FadeInSection key={i} delay={i * 80}>
              <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden hover:border-gray-300 dark:hover:border-slate-700 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left font-medium"
                >
                  {faq.q}
                  <span className="text-orange-500 dark:text-orange-400 text-xl">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-4 text-gray-600 dark:text-slate-400 text-sm">{faq.a}</p>
                )}
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>

      {/* CTA + Footer */}
      {!user && (
        <div className="max-w-6xl mx-auto px-6 pb-10">
          <FadeInSection>
            <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-8 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-orange-300 dark:hover:border-orange-500/30 transition-colors">
              <div>
                <h3 className="font-bold text-lg">Ready to take control of your health?</h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm">Join patients and doctors already using the platform.</p>
              </div>
              <Link
                to="/register"
                className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 hover:scale-105 transition-transform whitespace-nowrap"
              >
                Join Now
              </Link>
            </div>
          </FadeInSection>
        </div>
      )}

      <footer className="border-t border-gray-200 dark:border-slate-800 py-8 text-center text-gray-500 dark:text-slate-500 text-sm">
        © 2026 Rural Healthcare Connect. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;