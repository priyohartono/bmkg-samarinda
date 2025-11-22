export default function Contact() {
  return (
    <section className="py-12 bg-white rounded-xl shadow-sm mt-6 px-6">
      <h1 className="text-2xl md:text-4xl font-bold text-blue-700 mb-4">
        Kontak Kami
      </h1>
      <p className="text-gray-700 mb-6">
        Jika ada pertanyaan atau ingin bekerja sama, silakan hubungi kami:
      </p>
      <ul className="space-y-2 text-gray-700">
        <li>
          Email:{" "}
          <a
            href="mailto:info@bmkgclone.com"
            className="text-blue-600 hover:underline"
          >
            info@bmkgclone.com
          </a>
        </li>
        <li>Telepon: +62 812 3456 7890</li>
        <li>Alamat: Jakarta, Indonesia</li>
      </ul>
    </section>
  );
}
