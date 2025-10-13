import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
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
          <h1>Privacy and Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: July 24, 2025</p>

          <p>
            This data protection policy applies to the collection and processing of personal data:
          </p>
          <ul>
            <li>during the central operation of this website;</li>
            <li>
              Controller for the operation of the website: DataArt Enterprises Inc., 475 Park Avenue South, 
              New York, NY 10016, United States, info@dataart.com;
            </li>
            <li>
              in the context of a pre-contractual or contractual business relationship with you, your employer 
              or the company you work for by a local member of the DataArt group;
            </li>
            <li>
              in connection with registration forms and sign-ups, where a local member of the DataArt group 
              collects personal data directly for the purpose of registering for a service or an event.
            </li>
          </ul>

          <h2>Purposes for which we process customer and user data</h2>
          <p>We collect and process personal data for various purposes, including:</p>
          <ul>
            <li>to provide our websites and social media pages;</li>
            <li>to display personalized advertising and content;</li>
            <li>to manage event registration and attendance;</li>
            <li>to send communications;</li>
            <li>to respond to contact and user support requests;</li>
            <li>to provide our Services and to improve and optimize their performance;</li>
            <li>to bill you for our services and manage our accounts;</li>
            <li>to ensure the security of DataArt and its services; and</li>
            <li>to comply with our legal obligations.</li>
          </ul>

          <p>
            We collect and process your personal data only where it is necessary to fulfill these purposes 
            and we have a legal basis to do so. Where required, we will ask for your consent prior to the processing.
          </p>

          <p>
            Our website, services and events are not directed at children. We do not knowingly collect 
            personal information from children under the age of 16.
          </p>

          <h2>Data sharing</h2>
          <p>We share your personal data with various parties, including:</p>
          <ul>
            <li>
              contracted service providers who process data on our behalf for IT and system administration, 
              hosting, analytics, marketing and customer support;
            </li>
            <li>
              affiliated companies within our current or future Group of Companies that process personal data 
              for customer support, marketing, event management, technical operations and account management;
            </li>
            <li>sponsors of events and webinars for which you register;</li>
            <li>third-party networks and websites so that we can display advertisements on their platforms;</li>
            <li>consultants providing consulting, banking, legal, insurance, tax and accounting services; and</li>
            <li>
              public and government authorities where we are required to disclose personal information to 
              comply with our legal obligations.
            </li>
          </ul>

          <h2>What usage data do we process?</h2>
          <p>
            Every time you visit our website, our system automatically collects data and information from 
            the computer system of the visiting computer.
          </p>

          <p>
            This information may include identifiers, commercial information and information about Internet 
            activities such as the IP address, device and application information, identification numbers and 
            characteristics, location, browser type, plug-ins, Internet Service Provider, mobile carrier, 
            the pages and files viewed, searches conducted, referring website, operating system, system 
            configuration information, language preferences, date and time stamps relating to your use and 
            frequency of visits to the websites.
          </p>

          <h2>Your rights</h2>
          <p>
            You have the right to request access to, correction of, or deletion of your personal data. 
            You may also have the right to restrict or object to certain processing of your data.
          </p>

          <h2>Related Policies</h2>
          <p>
            Please also review our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
            {" "}for information about your rights and responsibilities when using FuelApp.
          </p>

          <h2>Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at: 
            <a href="mailto:info@dataart.com" className="text-primary hover:underline"> info@dataart.com</a>
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            This privacy policy is based on the{" "}
            <a 
              href="https://www.dataart.com/dataart-privacy-policy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              DataArt Privacy Policy
            </a>
          </p>
        </article>
      </div>
    </div>
  );
};

export default Privacy;
