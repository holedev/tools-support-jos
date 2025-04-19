import type { Metadata } from "next";
import { SMTPForm } from "./components/smtp-form.client";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "SMTP Check Tool",
  description: "Test and verify SMTP server configurations"
};

export default function SMTPCheckPage() {
  return (
    <div className='w-full p-6'>
      <h1 className='mb-8 text-3xl font-bold'>SMTP Check Tool</h1>
      <SMTPForm />
      <Toaster />
    </div>
  );
}
