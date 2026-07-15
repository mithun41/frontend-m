"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { contactService, ContactData } from "@/lib/api/contactService";

export default function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactData>();

  const onSubmit = async (data: ContactData) => {
    try {
      await contactService.submitContactForm(data);
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col gap-6">
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
          <label htmlFor="first_name" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">First Name</label>
          <input
            type="text"
            id="first_name"
            {...register("first_name", { required: "First name is required" })}
            className={`w-full bg-neutral-50 dark:bg-neutral-950 border ${errors.first_name ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-800'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-neutral-400 text-neutral-900 dark:text-white`}
            placeholder="John"
          />
          {errors.first_name && <span className="text-xs text-red-500">{errors.first_name.message}</span>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="last_name" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Last Name</label>
          <input
            type="text"
            id="last_name"
            {...register("last_name", { required: "Last name is required" })}
            className={`w-full bg-neutral-50 dark:bg-neutral-950 border ${errors.last_name ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-800'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-neutral-400 text-neutral-900 dark:text-white`}
            placeholder="Doe"
          />
          {errors.last_name && <span className="text-xs text-red-500">{errors.last_name.message}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Email Address</label>
        <input
          type="email"
          id="email"
          {...register("email", { 
            required: "Email is required",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" }
          })}
          className={`w-full bg-neutral-50 dark:bg-neutral-950 border ${errors.email ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-800'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-neutral-400 text-neutral-900 dark:text-white`}
          placeholder="john@example.com"
        />
        {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Subject</label>
        <input
          type="text"
          id="subject"
          {...register("subject", { required: "Subject is required" })}
          className={`w-full bg-neutral-50 dark:bg-neutral-950 border ${errors.subject ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-800'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-neutral-400 text-neutral-900 dark:text-white`}
          placeholder="How can we help you?"
        />
        {errors.subject && <span className="text-xs text-red-500">{errors.subject.message}</span>}
      </div>

      <div className="flex flex-col gap-2 flex-grow">
        <label htmlFor="message" className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Message</label>
        <textarea
          id="message"
          rows={5}
          {...register("message", { required: "Message is required" })}
          className={`w-full bg-neutral-50 dark:bg-neutral-950 border ${errors.message ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-800'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder:text-neutral-400 text-neutral-900 dark:text-white resize-none`}
          placeholder="Write your message here..."
        ></textarea>
        {errors.message && <span className="text-xs text-red-500">{errors.message.message}</span>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 w-full bg-primary-600 text-white py-4 rounded-xl font-bold tracking-wide hover:bg-primary-700 transition-colors duration-300 shadow-md shadow-primary-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
