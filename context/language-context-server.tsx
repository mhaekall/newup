"use server"

// This is a simplified version of the language context for server components
export async function getTranslation(key: string, language = "en"): Promise<string> {
  const translations: Record<string, Record<string, string>> = {
    en: {
      // Navigation
      "nav.signin": "Sign In",
      "nav.getStarted": "Get Started",
      "nav.back": "Back",
      "nav.signout": "Sign Out",
      "nav.backToDashboard": "Back to Dashboard",

      // Home page
      "home.hero.title": "Create Your Professional Portfolio",
      "home.hero.titleHighlight": "in Minutes",
      "home.hero.subtitle":
        "No coding required. Just fill out a form and get a beautiful portfolio page that showcases your skills and projects.",
      "home.hero.cta": "Get Started",
      "home.hero.secondary": "How It Works",

      // Features section
      "features.title": "Features",
      "features.subtitle": "Everything you need to create a professional online presence",
      "features.easyToUse.title": "Easy to Use",
      "features.easyToUse.description":
        "Fill out a simple form with your information and get a professional portfolio in minutes.",
      "features.templates.title": "Beautiful Templates",
      "features.templates.description": "Choose from multiple professionally designed templates for your portfolio.",
      "features.free.title": "Free to Use",
      "features.free.description": "Create and share your professional portfolio completely free of charge.",

      // Dashboard
      "dashboard.editPortfolio": "Edit Portfolio",
      "dashboard.viewPortfolio": "View Portfolio",
      "dashboard.noPortfolio.title": "You don't have a portfolio yet",
      "dashboard.noPortfolio.description": "Create your portfolio to showcase your skills and projects",
      "dashboard.noPortfolio.cta": "Create Portfolio",
      "dashboard.quickTips": "Quick Tips",
      "dashboard.tip1": "Add your skills and projects to showcase your expertise",
      "dashboard.tip2": "Include your social media links to help people connect with you",
      "dashboard.tip3": "Upload a professional profile photo to make a good impression",
    },
    id: {
      // Navigation
      "nav.signin": "Masuk",
      "nav.getStarted": "Mulai",
      "nav.back": "Kembali",
      "nav.signout": "Keluar",
      "nav.backToDashboard": "Kembali ke Dasbor",

      // Home page
      "home.hero.title": "Buat Portofolio Profesional Anda",
      "home.hero.titleHighlight": "dalam Hitungan Menit",
      "home.hero.subtitle":
        "Tanpa perlu coding. Cukup isi formulir dan dapatkan halaman portofolio yang menampilkan keahlian dan proyek Anda.",
      "home.hero.cta": "Mulai Sekarang",
      "home.hero.secondary": "Cara Kerja",

      // Features section
      "features.title": "Fitur",
      "features.subtitle": "Semua yang Anda butuhkan untuk membuat kehadiran online profesional",
      "features.easyToUse.title": "Mudah Digunakan",
      "features.easyToUse.description":
        "Isi formulir sederhana dengan informasi Anda dan dapatkan portofolio profesional dalam hitungan menit.",
      "features.templates.title": "Template Menarik",
      "features.templates.description":
        "Pilih dari berbagai template yang dirancang secara profesional untuk portofolio Anda.",
      "features.free.title": "Gratis Digunakan",
      "features.free.description": "Buat dan bagikan portofolio profesional Anda secara gratis.",

      // Dashboard
      "dashboard.editPortfolio": "Edit Portofolio",
      "dashboard.viewPortfolio": "Lihat Portofolio",
      "dashboard.noPortfolio.title": "Anda belum memiliki portofolio",
      "dashboard.noPortfolio.description": "Buat portofolio Anda untuk menampilkan keahlian dan proyek Anda",
      "dashboard.noPortfolio.cta": "Buat Portofolio",
      "dashboard.quickTips": "Tips Cepat",
      "dashboard.tip1": "Tambahkan keahlian dan proyek Anda untuk menunjukkan keahlian Anda",
      "dashboard.tip2": "Sertakan tautan media sosial Anda untuk membantu orang terhubung dengan Anda",
      "dashboard.tip3": "Unggah foto profil profesional untuk memberikan kesan yang baik",
    },
  }

  return translations[language]?.[key] || key
}
