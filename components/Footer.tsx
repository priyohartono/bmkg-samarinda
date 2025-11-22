export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-8 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} BMKG APT Pranoto Samarinda
        </p>
        <div className="flex gap-4 mt-3 md:mt-0">
          <a href="/about" className="hover:text-blue-600">About</a>
          <a href="/contact" className="hover:text-blue-600">Contact</a>
        </div>
      </div>
    </footer>
  );
}
