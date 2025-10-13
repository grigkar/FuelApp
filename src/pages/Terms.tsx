import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <article className="prose prose-slate max-w-none">
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: January 12, 2025</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using FuelApp ("the Service"), you accept and agree to be bound by the 
            terms and provisions of this agreement. If you do not agree to these terms, please do not 
            use the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            FuelApp provides a web-based platform for tracking fuel consumption, managing vehicle 
            information, and analyzing fuel efficiency metrics. The Service is provided "as is" and 
            "as available" without any warranties of any kind.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To use the Service, you must create an account. You are responsible for:
          </p>
          <ul>
            <li>maintaining the confidentiality of your account credentials;</li>
            <li>all activities that occur under your account;</li>
            <li>ensuring the accuracy of the information you provide;</li>
            <li>notifying us immediately of any unauthorized use of your account.</li>
          </ul>

          <h2>4. User Data and Privacy</h2>
          <p>
            Your use of the Service is also governed by our{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            . By using the Service, you consent to the collection and use of your data as described 
            in the Privacy Policy.
          </p>

          <h2>5. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>provide accurate and complete information when using the Service;</li>
            <li>not use the Service for any unlawful purpose;</li>
            <li>not attempt to gain unauthorized access to any portion of the Service;</li>
            <li>not interfere with or disrupt the Service or servers connected to the Service;</li>
            <li>not transmit any malicious code, viruses, or harmful components.</li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by FuelApp 
            and are protected by international copyright, trademark, patent, trade secret, and other 
            intellectual property laws.
          </p>

          <h2>7. Data Ownership</h2>
          <p>
            You retain all rights to the data you input into the Service, including vehicle information 
            and fuel entry records. You may export or delete your data at any time through the Settings 
            page.
          </p>

          <h2>8. Account Termination</h2>
          <p>
            You may terminate your account at any time through the Settings page. We reserve the right 
            to suspend or terminate your account if you violate these Terms of Service or for any other 
            reason at our sole discretion.
          </p>
          <p>
            Upon termination, all data associated with your account will be permanently deleted in 
            accordance with our data retention policies.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, FuelApp shall not be liable for any indirect, 
            incidental, special, consequential, or punitive damages, or any loss of profits or revenues, 
            whether incurred directly or indirectly, or any loss of data, use, goodwill, or other 
            intangible losses.
          </p>

          <h2>10. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an "as is" and "as available" basis. We make no warranties, 
            expressed or implied, regarding the Service, including but not limited to warranties of 
            merchantability, fitness for a particular purpose, or non-infringement.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. We will notify users 
            of any material changes by updating the "Last updated" date at the top of this page. 
            Your continued use of the Service after such modifications constitutes your acceptance 
            of the updated terms.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
            in which FuelApp operates, without regard to its conflict of law provisions.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:{" "}
            <a href="mailto:info@dataart.com" className="text-primary hover:underline">
              info@dataart.com
            </a>
          </p>
        </article>
      </div>
    </div>
  );
};

export default Terms;
