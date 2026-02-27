import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white mt-8 sm:mt-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 sm:gap-8 md:gap-10">
          <div className="sm:col-span-2 md:col-span-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-3">
              Srishti News Network
            </p>
            <h3 className="text-xl sm:text-2xl font-semibold mb-3">SRISHTI NEWS</h3>
            <p className="text-sm text-white/90 leading-relaxed max-w-md font-medium">
              ଆମେ ନୁହେଁ ଆପଣ କହିବେ ଆପଣଙ୍କ କଥା।
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-3">
              Quick Links
            </h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-sm text-white/70 hover:text-white transition">
                About Us
              </Link>
              <Link href="/contact" className="block text-sm text-white/70 hover:text-white transition">
                Contact Us
              </Link>
              <Link href="/videos" className="block text-sm text-white/70 hover:text-white transition">
                Video News
              </Link>
              <Link href="/web-news" className="block text-sm text-white/70 hover:text-white transition">
                Web News
              </Link>
            </div>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-3">
              Contact
            </h4>
            <div className="space-y-2 text-sm text-white/70">
              <p>Mobile / Whatsapp / Telegram: 9668421545</p>
              <p>E-Mail: srishtinews@gmail.com</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                <a
                  href="https://www.facebook.com/share/18D4N2eNGq/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  Instagram
                </a>
                <a
                  href="https://youtube.com/@politicalkhati?si=6dITFjJEIIJKlfKS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  YouTube
                </a>
                <a
                  href="https://api.whatsapp.com/send?phone=919668421545&text=Hello%20Srishti%20News"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  WhatsApp
                </a>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  Telegram
                </a>
                <a
                  href="https://x.com/SRISHTINEWS1?t=Ic1WBlvJFkmVQsC-9OoeTw&s=09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  X
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-5 text-center text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} Srishti News। ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ।</p>
        </div>
      </div>
    </footer>
  );
}
