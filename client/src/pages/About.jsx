import React from 'react'

export default function About() {
    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='max-w-2xl mx-auto p-3 text-center'>
                <div>
                    <h1 className='text-3xl font-semibold text-center my-7'>About PlacementDiaries</h1>
                    <div className='text-md text-gray-500 flex flex-col gap-6 '>
                        <p>
                            Welcome to PlacementDiaries! This platform is designed to empower students preparing for on-campus and off-campus placements and internships. PlacementDiaries is a dedicated space where students can share and explore valuable insights about their interview experiences, helping peers navigate their preparation for various companies and roles.
                        </p>
                        <p>
                            Our goal is to build a supportive community where students can access firsthand accounts of interviews, placement processes, and internship journeys. Whether it’s technical rounds, HR interviews, or company-specific tips, PlacementDiaries aims to provide a treasure trove of knowledge to help you prepare effectively.
                        </p>
                        <p>
                            On PlacementDiaries, you’ll find detailed posts from students who have successfully secured internships or placements. Their experiences, strategies, and advice will serve as a guide for others aiming to achieve similar goals.
                        </p>
                        <p>
                        PlacementDiaries is more than just a platform; it’s a community-driven initiative to ensure that no student feels unprepared in their journey toward internships and placements. Let’s make success a shared experience!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
