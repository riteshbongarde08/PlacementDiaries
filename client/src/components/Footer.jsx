import { Footer } from 'flowbite-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsLinkedin } from 'react-icons/bs';

export default function FooterCom() {
    return (
        <Footer container className='border border-t-8 border-teal-500'>
            <div className='w-full max-w-7xl mx-auto'>
                <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
                    <div className='mt-5'>
                        <Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                                Placement
                            </span>
                            Diaries
                        </Link>
                    </div>
                    <div className='grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6'>
                        <div>
                            <Footer.Title title='Follow us' />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href='https://github.com/riteshbongarde08'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Github
                                </Footer.Link>
                                <Footer.Link
                                    href='https://www.linkedin.com/in/ritesh-bongarde-16575a236/'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Linkedin
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title='Legal' />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href='/privacy'
                                >
                                    Privacy Policy
                                </Footer.Link>
                                <Footer.Link
                                    href='/terms'
                                    rel='noopener noreferrer'
                                >
                                    Terms &amp; Conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className='w-full sm:flex sm:items-center sm:justify-between'>
                    <Footer.Copyright href='#' by='PlacementDiaries' year={new Date().getFullYear()} />
                    <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
                        {/* <Footer.Icon target='_blank' rel='noopener noreferrer' href='https://www.linkedin.com/in/ritesh-bongarde-16575a236/' icon={BsInstagram} /> */}
                        <Footer.Icon target='_blank' rel='noopener noreferrer' href='https://github.com/riteshbongarde08' icon={BsGithub} />
                        <Footer.Icon target='_blank' rel='noopener noreferrer' href='https://www.linkedin.com/in/ritesh-bongarde-16575a236/' icon={BsLinkedin} />
                    </div>
                </div>
            </div>
        </Footer>
    )
}
