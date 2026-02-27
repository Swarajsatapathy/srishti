type SocialPlatform = {
  name: string;
  href: string;
};

const socialPlatforms: SocialPlatform[] = [
  { name: "Facebook", href: "https://www.facebook.com/share/18D4N2eNGq/" },
  { name: "YouTube", href: "https://youtube.com/@politicalkhati?si=6dITFjJEIIJKlfKS" },
  { name: "Instagram", href: "https://www.instagram.com" },
  { name: "WhatsApp", href: "https://api.whatsapp.com/send?phone=919668421545&text=Hello%20Srishti%20News" },
  { name: "Telegram", href: "https://t.me" },
  { name: "X", href: "https://x.com/SRISHTINEWS1?t=Ic1WBlvJFkmVQsC-9OoeTw&s=09" },
];

function SocialLogo({ name }: { name: string }) {
  if (name === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.026 4.388 11.021 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.017 1.792-4.686 4.533-4.686 1.313 0 2.686.235 2.686.235v2.962h-1.514c-1.491 0-1.956.93-1.956 1.885v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.099 24 12.073z"
        />
      </svg>
    );
  }

  if (name === "YouTube") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M23.5 6.2a3.01 3.01 0 0 0-2.12-2.13C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.57A3.01 3.01 0 0 0 .5 6.2 31.8 31.8 0 0 0 0 12a31.8 31.8 0 0 0 .5 5.8 3.01 3.01 0 0 0 2.12 2.13c1.88.57 9.38.57 9.38.57s7.5 0 9.38-.57a3.01 3.01 0 0 0 2.12-2.13A31.8 31.8 0 0 0 24 12a31.8 31.8 0 0 0-.5-5.8zM9.6 15.5v-7L16 12l-6.4 3.5z"
        />
      </svg>
    );
  }

  if (name === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm10.5 1.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
        />
      </svg>
    );
  }

  if (name === "WhatsApp") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20.52 3.48A11.8 11.8 0 0 0 12.06 0C5.53 0 .22 5.31.22 11.84c0 2.09.55 4.14 1.6 5.94L0 24l6.4-1.78a11.8 11.8 0 0 0 5.66 1.44h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.17-1.24-6.14-3.49-8.34zM12.07 21.7h-.01a9.8 9.8 0 0 1-4.99-1.36l-.36-.21-3.8 1.06 1.01-3.91-.24-.4a9.8 9.8 0 0 1-1.5-5.1c0-5.42 4.41-9.83 9.84-9.83 2.63 0 5.11 1.02 6.97 2.89a9.77 9.77 0 0 1 2.86 6.95c0 5.42-4.41 9.84-9.83 9.84zm5.39-7.38c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.35.22-.65.08-.3-.15-1.25-.46-2.38-1.48-.88-.79-1.47-1.77-1.65-2.07-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.08-.8.37-.27.3-1.05 1.03-1.05 2.51 0 1.48 1.08 2.92 1.23 3.12.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.34z"
        />
      </svg>
    );
  }

  if (name === "Telegram") {
    return (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
        <path
          fill="currentColor"
          d="M9.04 15.57 8.66 20.9c.54 0 .77-.23 1.05-.5l2.52-2.41 5.22 3.82c.96.53 1.64.25 1.9-.88l3.44-16.1.01-.01c.31-1.45-.52-2.01-1.45-1.66L1.2 10.86c-1.37.53-1.35 1.3-.23 1.65l5.15 1.6L18.08 6.6c.56-.34 1.07-.15.65.23"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.9 2H22l-6.76 7.73L23.2 22h-6.24l-4.89-6.4L6.47 22H3.35l7.23-8.27L.8 2h6.4l4.42 5.83L18.9 2zm-1.1 18h1.72L6.29 3.89H4.45L17.8 20z"
      />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-4">
        <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-primary px-6 py-8 text-white text-center">
            <p className="text-xs md:text-sm uppercase tracking-widest text-white/80 mb-2">
              Contact Desk
            </p>
            <h1 className="text-2xl md:text-3xl font-bold">Contact Us</h1>
            <p className="text-sm md:text-base text-white/90 mt-3 max-w-2xl mx-auto leading-relaxed">
              ଆପଣଙ୍କ ମତାମତ, ପ୍ରସ୍ତାବ ଓ ଯୋଗାଯୋଗ ପାଇଁ ଆମର ଅଧିକୃତ ସଂପର୍କ ସୂଚନା
            </p>
          </div>

          <div className="px-6 md:px-8 py-8 md:py-10 space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">Srishti News</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">Mobile / Whatsapp / Telegram</p>
                <a
                  href="tel:+919668421545"
                  className="text-lg md:text-xl font-semibold text-gray-900 hover:text-primary transition"
                >
                  9668421545
                </a>
              </div>

              <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">E-Mail</p>
                <a
                  href="mailto:srishtinews@gmail.com"
                  className="text-lg md:text-xl font-semibold text-gray-900 break-all hover:text-primary transition"
                >
                  srishtinews@gmail.com
                </a>
              </div>
            </div>

            <div className="border border-primary/20 rounded-lg p-5 md:p-6 bg-primary/5">
              <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Social Presence
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {socialPlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform.name}
                    className="h-12 w-12 rounded-full border border-primary/30 bg-white text-secondary flex items-center justify-center transition hover:bg-primary hover:text-white hover:border-primary"
                  >
                    <SocialLogo name={platform.name} />
                    <span className="sr-only">{platform.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
