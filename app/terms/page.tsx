import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full py-4 px-4 sm:px-6 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>

          <div className="prose max-w-none">
            <p>Last updated: May 10, 2025</p>

            <h2>1. Introduction</h2>
            <p>
              Welcome to looqmy ("we," "our," or "us"). By accessing or using our website, services, applications, or
              any other content provided by looqmy (collectively, the "Services"), you agree to be bound by these Terms
              of Service ("Terms").
            </p>

            <h2>2. Acceptance of Terms</h2>
            <p>
              By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound
              by these Terms. If you do not agree to these Terms, you may not access or use our Services.
            </p>

            <h2>3. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of any material changes by
              posting the updated Terms on our website or through other communications. Your continued use of the
              Services after such changes constitutes your acceptance of the new Terms.
            </p>

            <h2>4. User Accounts</h2>
            <p>
              To access certain features of our Services, you may be required to create an account. You are responsible
              for maintaining the confidentiality of your account credentials and for all activities that occur under
              your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>

            <h2>5. User Content</h2>
            <p>
              You retain ownership of any content you submit, post, or display on or through our Services ("User
              Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to
              use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display
              such User Content in connection with providing and promoting our Services.
            </p>

            <h2>6. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Use our Services for any illegal or unauthorized purpose</li>
              <li>Interfere with or disrupt our Services or servers</li>
              <li>Attempt to gain unauthorized access to our Services</li>
              <li>Harass, abuse, or harm another person</li>
              <li>Submit false or misleading information</li>
            </ul>

            <h2>7. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to our Services at any time, without notice, for
              any reason, including if we believe you have violated these Terms.
            </p>

            <h2>8. Disclaimer of Warranties</h2>
            <p>
              OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
              IMPLIED.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
            </p>

            <h2>10. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:looqmy@outlook.co.id">looqmy@outlook.co.id</a>.
            </p>
          </div>

          <div className="mt-8">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo />
          </div>

          <div className="flex gap-6">
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <a href="mailto:looqmy@outlook.co.id" className="text-gray-600 hover:text-gray-900">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
