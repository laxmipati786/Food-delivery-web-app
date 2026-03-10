import React from 'react';

function Footer() {
    return (
        <footer className="bg-black text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">Foodie</h3>
                    <p className="text-gray-400 text-sm">© 2026 Foodie Technologies Pvt. Ltd</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-lg">Company</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Team</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Foodie Instamart</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Help & Support</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Partner with us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Ride with us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-lg">Legal</h4>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
