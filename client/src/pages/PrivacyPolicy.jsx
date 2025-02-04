import React from 'react'

export default function PrivacyPolicy() {
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='max-w-2xl mx-auto p-3 text-center'>
                <div>
                    <h1 className='text-3xl font-semibold text-center my-7'>Privacy Policy for PlacementDiaries</h1>
                    <div className='text-md text-gray-500 flex flex-col gap-6 text-left'>
                        <p><strong>Effective Date:</strong> [Insert Date]</p>
                        <p><strong>Information We Collect</strong></p>
                        <ul className='list-disc list-inside'>
                            <li>Personal Information: Name, email, educational background</li>
                            <li>User-Generated Content: Posts, comments, and shared content</li>
                        </ul>
                        <p><strong>How We Use Your Information</strong></p>
                        <ul className='list-disc list-inside'>
                            <li>To operate and improve PlacementDiaries</li>
                            <li>To communicate with users</li>
                            <li>To personalize user experience</li>
                            <li>For analytics and platform improvement</li>
                        </ul>
                        <p><strong>Information Sharing</strong></p>
                        <p>We only share your information:</p>
                        <ul className='list-disc list-inside'>
                            <li>With your consent</li>
                            <li>With service providers</li>
                            <li>When legally required</li>
                            <li>To protect platform and user rights</li>
                        </ul>
                        <p><strong>Data Security</strong></p>
                        <p>We implement standard security measures to protect your data, though no online platform is 100% secure.</p>
                        <p><strong>Your Rights</strong></p>
                        <ul className='list-disc list-inside'>
                            <li>Access your personal data</li>
                            <li>Request corrections</li>
                            <li>Request deletion</li>
                            <li>Opt-out of communications</li>
                        </ul>
                        <p><strong>Contact Us</strong></p>
                        <p>Email: placementdiariestkiet@gmail.com</p>
                        <p>By using PlacementDiaries, you agree to this privacy policy.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}