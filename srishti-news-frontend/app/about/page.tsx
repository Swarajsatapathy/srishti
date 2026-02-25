const aboutParagraphs = [
  'ଦୁଇ ହଜାର ଏଗାର ମସିହାରେ ଜନ୍ମ ନେଇଥିବା ଓଡ଼ିଆ ଖବରକାଗଜ "ସ୍ରୀଷ୍ଟି" ଆପଣମାନଙ୍କର ଆକୁଣ୍ଠ ସାହାଯ୍ୟ, ସହଯୋଗ ଓ ଭଲପାଇବାକୁ ପାଥେୟ କରି ଦୁଇ ହଜାର କୋଡିଏ ମସିହାରେ ଡିଜିଟାଲ ମିଡିଆରେ ପାଦ ଦେଲା।',
  'ମାଲକାନଗିରିର ମାଳଭୂମି ଠାରୁ ଆରମ୍ଭ କରି ବଣ, ପାହାଡ଼, କୂଳୁକୂଳୁ ନିନାଦିତ ଝରଣା ଓ ପ୍ରଚୁର ଖଣିଜ ସମ୍ପଦ ଭରା ସୁନ୍ଦରଗଡ଼, ତଥା ସମୁଦ୍ର ତଟବର୍ତ୍ତୀ ସାତପଡ଼ା ଠାରୁ ସାତଭାୟା ଯାଏଁ, ସବୁଠି ଖୁବ ଅଳ୍ପ ଦିନ ଭିତରେ ପହଞ୍ଚି ପାରିଲା "ସ୍ରୀଷ୍ଟି"।',
  'ଏହା ସମ୍ଭବ ହୋଇପାରିଛି କେବଳ ଆପଣମାନଙ୍କର ସହଯୋଗ ଓ ଆମ ଦ୍ୱାରା ପ୍ରକାଶିତ ଏବଂ ପ୍ରଦର୍ଶିତ ସତ୍ୟ ଓ ତଥ୍ୟ ଆଧାରିତ ଖବର ଯୋଗୁ।',
  'ସତ୍ୟ ଓ ତଥ୍ୟ ଆଧାରିତ ଖବର ପ୍ରସାରଣ କରିବା, କୌଣସି ସରକାରୀ ବା ବେସରକାରୀ ଅନୁଷ୍ଠାନ ଅବା ବ୍ୟକ୍ତି ବିଶେଷଙ୍କ ବିରୁଦ୍ଧରେ କପୋଳକଳ୍ପିତ, ମନଗଢା ଓ ଅସୂୟା ମନୋବୃତି ନେଇ ଖବର ପ୍ରକାଶନ ନକରିବା, କେବଳ ଖବର ନୁହେଁ ବରଂ ଭଲ ଲୋକଙ୍କ ଭଲ କଥାକୁ ପ୍ରଚାର ପ୍ରସାର କରିବା, ଲୁକାୟିତ ପ୍ରତିଭାମାନଙ୍କୁ ପ୍ରୋତ୍ସାହନ ଯୋଗାଇଦେବା, ଏବଂ କଳା, ସାହିତ୍ୟ, ସଂସ୍କୃତି, ପର୍ଯ୍ୟଟନ ଆଦିର ପୃଷ୍ଠପୋଷକତା କରିବାର ଲକ୍ଷ୍ୟ ନେଇ ଆଗେଇ ଚାଲିଛୁ ଆମେ।',
  'ଏହି ଦାୟିତ୍ୱ ଓ କର୍ତ୍ତବ୍ୟରୁ କେବେବି ହଟିନୁ ଆମେ। ଆମର ସାଧ୍ୟ ମତେ ଓ ପରିସର ମଧ୍ୟରେ ଏହା ଚାଲୁ ରଖିଛୁ। ରାଜ୍ୟ ଓ ରାଜ୍ୟ ବାହାରୁ ଶତାଧିକ ବ୍ୟକ୍ତିବିଶେଷଙ୍କ ଅକପଟ ଶ୍ରଦ୍ଧା ଓ ଭଲପାଇବା ଏହି ସଫଳତାର ମୂଳଦୁଆ।',
];

export default function AboutPage() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-4">
        <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-primary px-6 py-8 text-white text-center">
            <p className="text-xs md:text-sm uppercase tracking-widest text-white/80 mb-2">
              About Srishti News
            </p>
            <h1 className="text-2xl md:text-3xl font-bold">ଆମ ବିଷୟରେ</h1>
            <p className="text-sm md:text-base text-white/90 mt-3 max-w-2xl mx-auto leading-relaxed">
              ସତ୍ୟ, ତଥ୍ୟ ଓ ସମାଜହିତକୁ କେନ୍ଦ୍ର କରି ଆଗେଇ ଚାଲୁଥିବା ଆମ ଯାତ୍ରାର ସଂକ୍ଷିପ୍ତ ପରିଚୟ
            </p>
          </div>

          <div className="px-6 md:px-8 py-8 md:py-10 space-y-6 text-[17px] leading-8 text-gray-800">
            {aboutParagraphs.map((paragraph, index) => (
              <p key={index} className="text-justify">
                {paragraph}
              </p>
            ))}

            <div className="pt-2">
              <div className="border border-primary/30 bg-primary/5 rounded-lg px-4 py-4 md:px-5 md:py-5">
                <p className="text-sm md:text-base text-gray-700">
                  <span className="font-semibold text-gray-900">
                    PRGI Registration No.:
                  </span>{" "}
                  ODIODI/2011/40163
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
