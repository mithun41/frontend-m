import { Mail, MapPin, Phone, Clock } from "lucide-react";

export const metadata = {
  title: "Contact Us - BrandName",
  description: "Get in touch with our team.",
};

export default function ContactPage() {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 min-h-screen py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-neutral-900 dark:text-white">
            Get in <span className="text-primary-600">Touch</span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-lg">
            Whether you have a question about our products, shipping, or need assistance, our team is ready to help.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
          
          {/* Left Column: Information (Clean, Subtle Primary Tint) */}
          <div className="flex-1 p-8 sm:p-12 lg:p-16 bg-primary-50/50 dark:bg-primary-900/10 border-r border-neutral-100 dark:border-neutral-800">
            <h2 className="text-2xl font-bold tracking-wide mb-10 text-neutral-900 dark:text-white">
              Contact Information
            </h2>
            
            <div className="flex flex-col gap-10">
              {/* Info Item */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-primary-500 transition-colors shadow-sm">
                  <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1.5 text-neutral-900 dark:text-neutral-100">Our Location</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                    123 Fitness Avenue, Block C<br />
                    Gulshan, Dhaka 1212<br />
                    Bangladesh
                  </p>
                </div>
              </div>

              {/* Info Item */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-primary-500 transition-colors shadow-sm">
                  <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1.5 text-neutral-900 dark:text-neutral-100">Phone Number</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                    +880 1712-345678<br />
                    +880 1987-654321
                  </p>
                </div>
              </div>

              {/* Info Item */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-primary-500 transition-colors shadow-sm">
                  <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1.5 text-neutral-900 dark:text-neutral-100">Email Address</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                    support@brandname.com<br />
                    sales@brandname.com
                  </p>
                </div>
              </div>

              {/* Info Item */}
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl flex items-center justify-center shrink-0 group-hover:border-primary-500 transition-colors shadow-sm">
                  <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1.5 text-neutral-900 dark:text-neutral-100">Working Hours</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                    Saturday - Thursday: 9:00 AM - 8:00 PM<br />
                    Friday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (Clean White/Dark) */}
          <div className="flex-[1.4] p-8 sm:p-12 lg:p-16">
            <form className="h-full flex flex-col gap-6">
              <div className="mb-2">
                <h2 className="text-2xl font-bold tracking-wide mb-2 text-neutral-900 dark:text-white">
                  Send us a Message
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  Fill out the form below and we will get back to you as soon as possible.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-neutral-400 text-neutral-900 dark:text-white"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-neutral-400 text-neutral-900 dark:text-white"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-neutral-400 text-neutral-900 dark:text-white"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-neutral-400 text-neutral-900 dark:text-white"
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 flex-grow">
                <label htmlFor="message" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-neutral-400 text-neutral-900 dark:text-white resize-none"
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>

              <button
                type="button"
                className="mt-4 w-full bg-primary-600 text-white py-4 rounded-xl font-bold tracking-wide hover:bg-primary-700 transition-colors duration-300 shadow-md shadow-primary-500/20"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
