import React from 'react';
import Breadcrumb from '../../components/customer/Breadcrumb';

export default function AboutPage() {
  return (
    <div className="relative bg-gray-50">
      {/* Navigation Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-80 h-8/12 bg-white border-r border-gray-200 p-8 overflow-y-auto z-10">
        <h2 className="text-sm font-semibold text-gray-900 mb-6 tracking-wide">TABLE OF CONTENTS</h2>
        
        <div className="space-y-1">
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Search"
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <a href="#intro" className="block px-4 py-2 text-blue-600 font-medium border-l-4 border-blue-600 bg-blue-50">
            Introduction
          </a>
          <a href="#payment" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
            Payment Policy
          </a>
          <a href="#complaint" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
            Complaint Policy
          </a>
          <a href="#shipping" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
            Shipping Policy
          </a>
          <a href="#exchange" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
            Exchange & Return Policy
          </a>
          <a href="#warranty" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
            Warranty Policy
          </a>
          <a href="#inspection" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
            Inspection Policy
          </a>
          <a href="#privacy" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
            Privacy Policy
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-80 px-16 py-12">
         <Breadcrumb
          paths={[
            { label: "Home", link: "/" },
            { label: "About" },
          ]}
        />
        <div className="max-w-4xl">
          {/* Introduction Section */}
          <section id="intro" className="mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Introduction</h1>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              We are committed to bringing the best quality fashion to everyone at reasonable prices, 
              bringing modern and trendy fashion experiences for the younger generation. Tenbrand aims 
              towards a style of freedom, comfort and confidence in each product.
            </p>

            {/* Image Placeholders */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="aspect-video bg-gray-900 rounded-lg"></div>
              <div className="aspect-video bg-gray-900 rounded-lg"></div>
            </div>

            {/* Our Mission */}
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              At Tenbrand, we believe that fashion is not just about clothing, but a way to express 
              your personality. We are committed to bringing high-quality products with unique designs, 
              helping you confidently express your own style.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              With a talented and strict manufacturing process design team, every Tenbrand product is 
              meticulously cared for from material selection to final completion. We never stop 
              innovating and creating to meet the increasingly diverse fashion needs of our customers.
            </p>
          </section>

          {/* Payment Policy */}
          <section id="payment" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Payment Policy</h2>
            
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>We accept the following payment methods:</p>
              
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cash on Delivery (COD) - Pay when you receive your order</li>
                <li>Bank Transfer - Direct transfer to our business account</li>
                <li>Credit/Debit Cards - Visa, Mastercard, JCB</li>
                <li>E-Wallets - Momo, ZaloPay, VNPay</li>
              </ul>

              <p className="mt-6">
                All transactions are secured and encrypted. Your payment information is never stored 
                on our servers. For bank transfers, please include your order number in the transfer 
                description.
              </p>
            </div>
          </section>

          {/* Complaint Policy */}
          <section id="complaint" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Complaint Policy</h2>
            
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                Customer satisfaction is our top priority. If you have any complaints or concerns 
                about our products or services, please contact us through:
              </p>
              
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hotline: 1900-xxxx (8:00 AM - 10:00 PM daily)</li>
                <li>Email: support@tenbrand.com</li>
                <li>Direct message via our Facebook/Instagram page</li>
                <li>Visit our stores directly</li>
              </ul>

              <p className="mt-6">
                We commit to responding to all complaints within 24 hours and resolving issues within 
                3-5 business days. All complaints will be handled professionally and fairly.
              </p>
            </div>
          </section>

          {/* Shipping Policy */}
          <section id="shipping" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Shipping Policy</h2>
            
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>We offer nationwide shipping with the following options:</p>
              
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
                <h3 className="font-semibold text-gray-900 mb-3">Standard Shipping (3-5 business days)</h3>
                <p>Free for orders over $50. Orders under $50 incur a $5 shipping fee.</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-6">
                <h3 className="font-semibold text-gray-900 mb-3">Express Shipping (1-2 business days)</h3>
                <p>$10 flat rate for all orders. Available in major cities only.</p>
              </div>

              <p>
                Orders are processed within 24 hours on business days. You will receive a tracking 
                number via email once your order has been shipped. Please ensure your delivery address 
                is accurate to avoid delays.
              </p>
            </div>
          </section>

          {/* Exchange & Return Policy */}
          <section id="exchange" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Exchange & Return Policy</h2>
            
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>We want you to be completely satisfied with your purchase. Our return policy includes:</p>
              
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>30-day return period from the date of delivery</li>
                <li>Items must be unworn, unwashed, and in original condition with tags attached</li>
                <li>Free exchanges for different sizes or colors (subject to availability)</li>
                <li>Full refund for defective or incorrect items</li>
                <li>Return shipping costs are covered by Tenbrand for defective items</li>
              </ul>

              <p className="mt-6">
                To initiate a return or exchange, please contact our customer service team with your 
                order number and photos of the item. We will provide you with a return shipping label 
                and instructions.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
                <p className="font-semibold text-gray-900">Note:</p>
                <p className="mt-2">Sale items and clearance products are final sale and cannot be returned or exchanged.</p>
              </div>
            </div>
          </section>

          {/* Warranty Policy */}
          <section id="warranty" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Warranty Policy</h2>
            
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                All Tenbrand products come with a quality guarantee. We stand behind the craftsmanship 
                and materials of our products.
              </p>
              
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>6-month warranty against manufacturing defects</li>
                <li>Coverage includes: stitching issues, fabric defects, zipper malfunctions</li>
                <li>Does not cover: normal wear and tear, damage from improper care, alterations</li>
                <li>Free repair or replacement for valid warranty claims</li>
              </ul>

              <p className="mt-6">
                To make a warranty claim, please contact us with your order number, photos of the 
                defect, and a description of the issue. Our team will assess the claim and provide 
                a solution within 5 business days.
              </p>
            </div>
          </section>

          {/* Inspection Policy */}
          <section id="inspection" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Inspection Policy</h2>
            
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                Quality control is essential to our brand. Every product undergoes multiple inspection 
                stages before reaching you:
              </p>
              
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Raw material inspection upon arrival at our facility</li>
                <li>In-process quality checks during manufacturing</li>
                <li>Final product inspection before packaging</li>
                <li>Random quality audits on completed orders</li>
              </ul>

              <p className="mt-6">
                We encourage customers to inspect their orders upon delivery. If you notice any issues, 
                please document them with photos and contact us immediately. Inspection claims must be 
                made within 48 hours of delivery.
              </p>
            </div>
          </section>

          {/* Privacy Policy */}
          <section id="privacy" className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h2>
            
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                Your privacy is important to us. This policy outlines how we collect, use, and protect 
                your personal information.
              </p>
              
              <h3 className="font-semibold text-gray-900 text-xl mt-6 mb-3">Information We Collect</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name, email address, phone number, and shipping address</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Order history and preferences</li>
                <li>Website usage data and cookies</li>
              </ul>

              <h3 className="font-semibold text-gray-900 text-xl mt-6 mb-3">How We Use Your Information</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Communicate about your orders and customer service inquiries</li>
                <li>Send promotional emails (you can opt-out anytime)</li>
                <li>Improve our products and services</li>
                <li>Prevent fraud and ensure security</li>
              </ul>

              <h3 className="font-semibold text-gray-900 text-xl mt-6 mb-3">Data Protection</h3>
              <p>
                We implement industry-standard security measures to protect your information. Your data 
                is encrypted during transmission and stored on secure servers. We never sell or share 
                your personal information with third parties for marketing purposes without your consent.
              </p>

              <p className="mt-6">
                You have the right to access, correct, or delete your personal information at any time. 
                Please contact us at privacy@tenbrand.com for any privacy-related requests.
              </p>
            </div>
          </section>

          {/* Footer Contact - nằm trên Footer chính của layout */}
          <div className="border-t border-gray-200 pt-8 mt-12">
            <p className="text-gray-600 text-center">
              For any questions or concerns, please don't hesitate to contact us at{' '}
              <a href="mailto:support@tenbrand.com" className="text-blue-600 hover:underline">
                support@tenbrand.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}