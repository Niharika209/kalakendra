import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-br from-amber-50 via-yellow-50 to-orange-50">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-linear-to-br from-amber-700 to-yellow-600 bg-clip-text text-transparent text-center">
              About Kalakendra
            </h1>
            <p className="text-xl text-amber-800 text-center max-w-3xl mx-auto mb-12">
              Your gateway to traditional and contemporary arts. Connecting learners with master artists to preserve and celebrate India's rich cultural heritage.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-amber-900 mb-6">Our Mission</h2>
                <p className="text-lg text-amber-700 mb-4 leading-relaxed">
                  Kalakendra is dedicated to preserving and promoting India's rich artistic heritage by creating a vibrant platform that connects passionate learners with master artists.
                </p>
                <p className="text-lg text-amber-700 mb-4 leading-relaxed">
                  We believe that every individual has an inner artist waiting to be discovered. Through our platform, we make traditional and contemporary arts accessible to everyone, regardless of their location or experience level.
                </p>
                <p className="text-lg text-amber-700 leading-relaxed">
                  Our mission is to create a thriving community where art forms like classical dance, music, painting, pottery, and more can flourish and be passed down to future generations.
                </p>
              </div>
              <div className="bg-linear-to-br from-amber-100 to-yellow-100 p-8 rounded-2xl shadow-lg">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center shrink-0">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-amber-900 mb-2">Preserve Heritage</h3>
                      <p className="text-amber-700">Keeping traditional art forms alive for future generations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center shrink-0">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-amber-900 mb-2">Connect Communities</h3>
                      <p className="text-amber-700">Building bridges between artists and learners nationwide</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center shrink-0">
                      <span className="text-2xl">📚</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-amber-900 mb-2">Empower Learning</h3>
                      <p className="text-amber-700">Making quality art education accessible to everyone</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-amber-900 mb-12 text-center">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-4xl">👨‍🏫</span>
                </div>
                <h3 className="text-2xl font-semibold text-amber-900 mb-4 text-center">Expert Artists</h3>
                <p className="text-amber-700 text-center leading-relaxed">
                  Learn from verified master artists with years of experience in traditional and contemporary art forms
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-4xl">🎭</span>
                </div>
                <h3 className="text-2xl font-semibold text-amber-900 mb-4 text-center">Diverse Workshops</h3>
                <p className="text-amber-700 text-center leading-relaxed">
                  Access a wide range of workshops covering dance, music, painting, pottery, and many more art forms
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6 mx-auto">
                  <span className="text-4xl">💻</span>
                </div>
                <h3 className="text-2xl font-semibold text-amber-900 mb-4 text-center">Flexible Learning</h3>
                <p className="text-amber-700 text-center leading-relaxed">
                  Choose between online and in-person sessions that fit your schedule and learning preferences
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-amber-600 mb-2">500+</div>
                <div className="text-amber-700 font-medium">Master Artists</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-amber-600 mb-2">10k+</div>
                <div className="text-amber-700 font-medium">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-amber-600 mb-2">50+</div>
                <div className="text-amber-700 font-medium">Art Forms</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-amber-600 mb-2">1000+</div>
                <div className="text-amber-700 font-medium">Workshops</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-amber-900 mb-12 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">Quality</h3>
                <p className="text-amber-700 text-sm">
                  We ensure every artist and workshop meets our high standards of excellence
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
                <div className="text-3xl mb-4">🌟</div>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">Authenticity</h3>
                <p className="text-amber-700 text-sm">
                  Preserving traditional techniques while embracing innovation
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
                <div className="text-3xl mb-4">🤲</div>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">Inclusivity</h3>
                <p className="text-amber-700 text-sm">
                  Making art accessible to everyone, regardless of background
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
                <div className="text-3xl mb-4">💡</div>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">Innovation</h3>
                <p className="text-amber-700 text-sm">
                  Using technology to enhance traditional learning experiences
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-linear-to-r from-amber-600 to-yellow-500">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Artistic Journey?
            </h2>
            <p className="text-xl text-amber-50 mb-8">
              Join thousands of learners discovering their creative potential with master artists
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/workshops">
                <button className="px-8 py-4 bg-white text-amber-700 rounded-full font-semibold text-lg hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  Browse Workshops
                </button>
              </a>
              <a href="/artists">
                <button className="px-8 py-4 bg-amber-800 text-white rounded-full font-semibold text-lg hover:bg-amber-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  Find Artists
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default AboutPage
