import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-14 pb-8">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-10">

        {/* Brand Info */}
        <div>
          <h3 className="font-semibold mb-3">Tenbrand</h3>
          <p className="text-gray-400 text-sm">
            A premium local fashion brand proudly made in Vietnam.
          </p>
        </div>

        {/* About Us */}
        <div>
          <h3 className="font-semibold mb-3">About Us</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>Introduction</li>
            <li>Our Stores</li>
            <li>Products</li>
            <li>News</li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="font-semibold mb-3">Customer Support</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>Search</li>
            <li>Return Policy</li>
            <li>Shopping Guide</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="font-semibold mb-3">Policies</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>Payment Policy</li>
            <li>Privacy Policy</li>
            <li>Shipping Policy</li>
          </ul>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm mt-10">
        © 2025 Tenbrand — All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
