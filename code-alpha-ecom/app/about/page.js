"use client"
import Navbar from "@/app/components/Navbar";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About SocietyHub</h1>
              <p className="text-lg text-gray-700 mb-6">
                A local marketplace built by residents, for residents — connecting neighbours,
                supporting small sellers, and making everyday shopping simple within your society.
              </p>
              <div className="flex gap-4">
                <a href="/" className="inline-block bg-blue-600 text-white px-5 py-3 rounded-md shadow">Browse Products</a>
                <a href="/contact" className="inline-block border border-blue-600 text-blue-600 px-5 py-3 rounded-md">Contact Us</a>
              </div>
            </div>
            <div className="w-full">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80"
                alt="Community marketplace"
                className="w-full rounded-lg shadow-lg object-cover h-64 w-full"
              />
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Our Story */}
          <section className="mb-12 lg:flex lg:items-center lg:gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Started by a group of neighbours who wanted easier access to local goods and
                reliable services, SocietyHub grew from simple WhatsApp groups into a focused
                marketplace for society residents. We prioritize trust, convenience, and
                supporting the micro-entrepreneurs who live and work in our communities.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today we serve hundreds of societies across the city with verified sellers,
                community-first delivery windows, and features that keep commerce local and
                transparent.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1523264766116-2c7b11d8b4c0?auto=format&fit=crop&w=1400&q=80"
                alt="Local sellers"
                className="rounded-lg shadow-md object-cover h-56 w-full"
              />
            </div>
          </section>

          {/* What We Offer (cards) */}
          <section className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">What We Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {title: 'Verified Sellers', body: 'Every seller is verified by our community moderators.'},
                {title: 'Fast Delivery', body: 'Delivery windows aligned with society timings.'},
                {title: 'Easy Checkout', body: 'Cart, secure payments, and order tracking.'},
                {title: 'Community Deals', body: 'Exclusive discounts for society members.'},
                {title: 'Ratings & Reviews', body: 'Transparent feedback from neighbours.'},
                {title: '24/7 Support', body: 'Help when you need it via chat or email.'},
              ].map((card) => (
                <div key={card.title} className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-xl font-medium text-blue-600 mb-2">{card.title}</h4>
                  <p className="text-gray-700">{card.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Meet The Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[{
                name: 'Aisha Sharma', role: 'Co-founder & CEO', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=60'
              },{
                name: 'Rohan Mehta', role: 'Head of Product', img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=400&q=60'
              },{
                name: 'Sneha Kulkarni', role: 'Community Lead', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60'
              }].map((m) => (
                <div key={m.name} className="bg-white p-6 rounded-lg text-center shadow-sm">
                  <img src={m.img} alt={m.name} className="mx-auto rounded-full h-28 w-28 object-cover mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900">{m.name}</h4>
                  <p className="text-sm text-gray-600">{m.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">What Neighbours Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{
                quote: 'Fast delivery and reliable sellers — saved me so much time!',
                name: 'Priya', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=60'
              },{
                quote: 'Love the local deals and knowing I am supporting neighbours.',
                name: 'Vikram', img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=400&q=60'
              },{
                quote: 'Customer support was quick and resolved my issue the same day.',
                name: 'Anjali', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=60'
              }].map((t, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-700 italic mb-4">“{t.quote}”</p>
                  <div className="flex items-center gap-3">
                    <img src={t.img} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-500">Verified resident</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact / CTA */}
          <section className="bg-blue-50 p-8 rounded-lg border-2 border-blue-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-700 mb-4">Have questions or suggestions? We'd love to hear from you!</p>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Email:</strong> info@societyhub.com
              </p>
              <p>
                <strong>Phone:</strong> +91 98765 43210
              </p>
              <p>
                <strong>Address:</strong> Mumbai, Maharashtra, India
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
