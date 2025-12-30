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
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-amber-900 mb-2">Preserve Heritage</h3>
                      <p className="text-amber-700">Keeping traditional art forms alive for future generations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-amber-900 mb-2">Connect Communities</h3>
                      <p className="text-amber-700">Building bridges between artists and learners nationwide</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                      </svg>
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
                  <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-amber-900 mb-4 text-center">Expert Artists</h3>
                <p className="text-amber-700 text-center leading-relaxed">
                  Learn from verified master artists with years of experience in traditional and contemporary art forms
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-amber-900 mb-4 text-center">Diverse Workshops</h3>
                <p className="text-amber-700 text-center leading-relaxed">
                  Access a wide range of workshops covering dance, music, painting, pottery, and many more art forms
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
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
                <svg className="w-8 h-8 text-amber-600 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">Quality</h3>
                <p className="text-amber-700 text-sm">
                  We ensure every artist and workshop meets our high standards of excellence
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
                <svg className="w-8 h-8 text-amber-600 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">Authenticity</h3>
                <p className="text-amber-700 text-sm">
                  Preserving traditional techniques while embracing innovation
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
                <svg className="w-8 h-8 text-amber-600 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                <h3 className="text-xl font-semibold text-amber-900 mb-3">Inclusivity</h3>
                <p className="text-amber-700 text-sm">
                  Making art accessible to everyone, regardless of background
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-amber-100">
                <svg className="w-8 h-8 text-amber-600 mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
                </svg>
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
