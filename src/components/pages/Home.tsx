"use client";

import React, { useEffect, useRef } from 'react';
import Image from '@/components/Image';
import Link from 'next/link';
import Button from '@/components/Button';
import Card, { Spacer } from '@/components/Card';
import Map from "@/components/Map";
import Footer from "@/components/footer";
import Time from "@/components/helpers/Time";
import NowPlaying from "@/components/helpers/NowPlaying";
import gsap from 'gsap';

const HomePage = ({ options }: any) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const aboutButtonRef = useRef<HTMLDivElement>(null);
    const hrRef = useRef<HTMLHRElement>(null);
    const blogLibraryButtonsRef = useRef<HTMLDivElement>(null);
    const introCardRef = useRef<HTMLDivElement>(null);
    const imageCardRef = useRef<HTMLDivElement>(null);
    const mapCardRef = useRef<HTMLDivElement>(null);
    const nowPlayingRef = useRef<HTMLDivElement>(null);
    const svgPathsRef = useRef<(SVGPathElement | null)[]>([]);

    useEffect(() => {
        const tl = gsap.timeline();

        if (contentRef.current) {
            gsap.fromTo(
                contentRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.5 / 3 }
            );
        }

        if (headerRef.current) {
            gsap.fromTo(
                headerRef.current,
                { y: -25, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.75 / 3 }
            );
        }

        if (svgPathsRef.current) {
            svgPathsRef.current.forEach((path, index) => {
                if (path) {
                    const delay = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.375, 1.5, 1.625, 1.75, 1.875, 2, 2.125, 2.25, 2.375][index] / 2;
                    const duration = index === 11 ? 0.125 / 2 : 0.125 / 2;
                    const y = index === 11 ? 0 : undefined;
                    const initialY = index === 11 ? -10 : undefined;

                    gsap.fromTo(
                        path,
                        { opacity: 0, y: initialY },
                        { opacity: 1, duration: duration, delay: delay, y: y }
                    );
                }
            });
        }


        if (aboutButtonRef.current) {
            gsap.fromTo(
                aboutButtonRef.current,
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, delay: 2.5 / 3, duration: 0.1875 / 3 }
            );
        }

        if (hrRef.current) {
            gsap.fromTo(
                hrRef.current,
                { width: 0 },
                { width: "100%", delay: 2.75 / 3, duration: 0.375 / 3 }
            );
        }

        if (blogLibraryButtonsRef.current) {
            gsap.fromTo(
                blogLibraryButtonsRef.current,
                { opacity: 0 },
                { opacity: 1, delay: 3.25 / 3, duration: 0.1875 / 3 }
            );
        }

        const cardAnimationConfig = { opacity: 1, y: 0, delay: 3.5 / 3, duration: 1 / 3 };

        if (introCardRef.current) {
            gsap.fromTo(introCardRef.current, { opacity: 0, y: -50 }, cardAnimationConfig);
        }
        if (imageCardRef.current) {
            gsap.fromTo(imageCardRef.current, { opacity: 0, y: 50 }, cardAnimationConfig);
        }
        if (mapCardRef.current) {
            gsap.fromTo(mapCardRef.current, { opacity: 0, y: 50 }, cardAnimationConfig);
        }
        if (nowPlayingRef.current) {
            gsap.fromTo(nowPlayingRef.current, { opacity: 0, y: -50 }, cardAnimationConfig);
        }
    }, []);

    return (
        <>
            <div
                ref={contentRef}
                id={`content`}
                className={`post-list bar-left/50 relative flex w-full flex-col bg-amber-50 before:w-[48px] xl:before:w-[64px] bg-pattern`}
            >
                <div
                    ref={headerRef}
                    className="w-full max-h-max max-w-4xl pt-36 px-4 lg:px-12 !pb-4 mx-auto xl:rounded-2xl text-stone-950"
                >
                    <div
                        className="relative flex flex-col"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill={'currentColor'} viewBox="0 0 1484 192"
                             className="block w-auto ml-0.75 mr-[-2.65%] xl:-mr-5.5 mx-auto aspect-[15/2] translate-x-px text-background drop-shadow-natural-100 shadow-foreground"
                             height="auto" width="100%">
                            <g>
                                <path ref={(el) => (svgPathsRef.current[0] = el)} d="M205 12h-15l3 5v9h-11v-9l3-5h-10v3l-2 1v23l-3 4v1h15v-1l-3-4V28h11v11l-3 4v1h15v-1l-3-4V16l3-4Z"/>
                                <path ref={(el) => (svgPathsRef.current[1] = el)} d="M218 20c4 0 7 1 9 3s3 5 3 9-1 6-3 9c-3 2-6 3-10 3s-6-1-8-3-4-5-4-9 2-6 4-9c2-2 6-3 9-3Zm1 22 2-1 1-5-2-10-3-4-2 1-1 5 2 10 3 4Z"/>
                                <path ref={(el) => (svgPathsRef.current[2] = el)} d="m267 21-4 4-7 19h-1l-7-15-7 15h-2l-8-19-3-4v-1h14v1l-1 4 3 8 2-7-2-5v-1h12v1l-1 4 3 8 3-8-3-4v-1h9v1Z"/>
                                <path ref={(el) => (svgPathsRef.current[3] = el)} d="M281 40h-1l-3 3-3 1c-3 0-5-1-7-3s-2-5-2-9c0-3 1-7 3-9s5-3 9-3a16 16 0 0 1 3 0v-2l-3-4v-1l12-3v29l3 4v1h-11v-4Zm-3-1 1-1h1V25l-1-2-3-1-2 1-1 6 2 7c0 2 2 3 3 3Z"/>
                                <path ref={(el) => (svgPathsRef.current[4] = el)} d="m303 49 4 4v1h-12v-1l5-4 3-5-10-19-3-4v-1h16v1l-3 4 4 9 4-9-3-4v-1h9v1l-4 4-10 24Z"/>
                            </g>

                            <g>
                                <path ref={(el) => (svgPathsRef.current[5] = el)} d="m28 37-4 94 14 17v1H0v-1l15-17 5-102L5 13v-1h46l38 89 37-89h45v1l-15 16 7 102 14 17v1h-60v-1l14-17-6-94-45 111h-4L28 37Z"/>
                                <path ref={(el) => (svgPathsRef.current[6] = el)} d="m217 174 18 17v1h-50v-1l20-17 13-27-38-81-14-15v-1h60v1l-13 15 20 47 20-47-13-15v-1h36v1l-14 15-45 108Z"/>
                                <path ref={(el) => (svgPathsRef.current[7] = el)} d="M350 76v57l12 15v1h-56v-1l14-15V78l-13-17v-1l43-13v21c6-7 12-12 18-16 5-3 12-5 18-5 8 0 15 3 20 9s7 13 7 23v54l14 15v1h-56v-1l12-15V85c0-6-1-10-3-13s-6-4-10-4l-10 2-10 6Z"/>
                                <path ref={(el) => (svgPathsRef.current[8] = el)} d="M484 133h-1c-5 6-10 11-16 14-5 3-11 4-17 4-7 0-13-2-17-6-5-5-7-11-7-18 0-9 4-17 13-22 9-6 23-12 44-17V73c0-5-1-9-3-12s-5-4-8-4c-6 0-12 3-18 8-7 6-13 13-18 23h-2V50h84v1l-5 14v68l14 15v1h-43v-16Zm-16 0 8-2 7-5V95c-10 2-17 6-21 9s-6 8-6 13 1 9 3 12c3 3 6 4 9 4Z"/>
                                <path ref={(el) => (svgPathsRef.current[9] = el)} d="M572 76v57l15 15v1h-59v-1l14-15V78l-13-17v-1l43-13v21l17-16c6-3 12-5 18-5s11 2 16 6c4 3 7 8 9 15 6-7 12-12 18-15 5-4 11-6 17-6 8 0 15 3 19 9s7 13 7 23v54l14 15v1h-49v-1l5-15V85c0-6-1-10-3-13s-5-4-10-4l-9 2-9 6v57l14 15v1h-49v-1l5-15V85c0-6-1-10-3-13s-5-4-10-4l-8 2-10 6Z"/>
                                <path ref={(el) => (svgPathsRef.current[10] = el)} d="M763 129a32 32 0 0 0 28-16l2 1c-3 12-9 21-16 28-8 6-17 9-27 9-14 0-25-4-33-14s-13-21-13-36 4-29 13-39 20-15 35-15c12 0 22 5 30 13 7 8 11 19 11 33h-61c1 12 4 21 9 27 6 6 13 9 22 9Zm-16-73c-5 0-9 2-11 7-3 5-4 13-4 23h33c-1-10-3-17-6-22-3-6-7-8-12-8Z"/>
                                <path ref={(el) => (svgPathsRef.current[11] = el)} d="m806 9 16 17-15 51h-2l-16-51 17-17z"/>
                                <path ref={(el) => (svgPathsRef.current[12] = el)} d="M898 119c0 10-4 18-11 24-7 5-17 8-29 8a64 64 0 0 1-20-3l-16 3v-41h2c6 11 12 20 19 25 6 6 12 9 19 9 4 0 8-1 10-3 3-2 4-5 4-8s-1-7-4-10-8-5-14-7l-11-4c-8-3-15-7-19-13-4-5-6-11-6-19 0-9 3-17 10-22 7-6 16-8 28-8h30v35h-2c-5-10-10-16-16-21-5-5-10-7-16-7-4 0-6 1-9 3-2 2-3 4-3 8s2 6 4 9l14 7 11 4c8 2 14 6 18 12 4 5 7 12 7 19Z"/>
                            </g>

                            <g>
                                <path ref={(el) => (svgPathsRef.current[13] = el)} d="M974 151h-56l1-1 16-17 19-103-12-17 1-1h51c21 0 37 5 49 16 13 10 19 25 19 44a78 78 0 0 1-27 58c-8 7-17 12-27 16-10 3-22 5-34 5Zm53-77c0-17-3-30-9-40-7-9-16-14-27-14h-4l-21 122a34 34 0 0 0 11 1c15 0 27-6 36-19 10-13 14-30 14-50Z"/>
                                <path ref={(el) => (svgPathsRef.current[14] = el)} d="m1125 136 13-40h-2c-5 11-12 22-20 33-8 10-16 17-23 22h-26l-1-12a103 103 0 0 1-2-21c0-22 4-39 13-51 9-13 20-19 36-19a44 44 0 0 1 26 9l28-8h3l-16 86 12 15v1h-44l3-15Zm-29-27a127 127 0 0 0 1 20l1 7a123 123 0 0 0 39-71l-8-5-8-1c-7 0-13 4-18 14-5 9-7 21-7 36Z"/>
                                <path ref={(el) => (svgPathsRef.current[15] = el)} d="M1241 50h36c-2 16-8 32-19 50s-25 35-43 51h-25a330 330 0 0 1-5-49l-2-22-10-18v-1l41-13v47a229 229 0 0 0 3 43c7-6 13-16 18-30 4-14 6-28 6-44V50Z"/>
                                <path ref={(el) => (svgPathsRef.current[16] = el)} d="m1278 61 45-13-15 87 12 15-1 1h-44l12-72-10-17 1-1Zm32-15-21-23 25-23 20 23-24 23Z"/>
                                <path ref={(el) => (svgPathsRef.current[17] = el)} d="m1443 5-23 130 12 15-1 1h-44l3-15 13-40h-1a168 168 0 0 1-46 55h-26l-1-12a213 213 0 0 1-1-20c0-23 4-39 13-52 8-13 21-19 36-19l14 2 12 6 4-20-10-17v-1l46-13Zm-84 105a145 145 0 0 0 2 19v7a123 123 0 0 0 42-71l-9-5-8-1c-7 0-13 4-18 14s-8 21-8 37Z"/>
                                <path ref={(el) => (svgPathsRef.current[18] = el)} d="m1445 154-18-21 23-22 18 22-23 21Zm5-43-4-80 22-22 16 22-32 80h-2Z"
                                      className={'flicker'}/>
                            </g>

                            <path ref={(el) => (svgPathsRef.current[19] = el)} d="M947 43H822l5-18-5-5h121l6 10-2 13ZM324 20h465l-5 5 5 18H311l8-18 5-5Z"
                                  className="fill-border-soft/25"/>
                        </svg>
                        <div className="grid grid-cols-[auto_1fr_auto] gap-x-3.5 items-center px-0.5 mt-[calc(-2.35%)] mb-4">
                            <div
                                ref={aboutButtonRef}
                            >
                                <Button href={'/about'} variant={'primary'}>{'About Me'}</Button>
                            </div>

                            <hr
                                ref={hrRef}
                                className="border-t-2 border-dashed border-border-soft/75 mr-auto"
                            />

                            <div
                                ref={blogLibraryButtonsRef}
                                className="flex flex-row gap-x-2.5 items-center"
                            >
                                <Button href={'/blog'}>{'Blog'}</Button>
                                <Button href={'/library'}>{'Library'}</Button>
                            </div>
                        </div>
                    </div>
                    <section className="flex flex-col lg:grid lg:grid-cols-3 gap-4 mx-0.5">
                        <div ref={introCardRef} className="col-span-1">
                            <Card
                                className="text-md"
                                header={(
                                    <h3 className="block font-display font-semibold text-xl leading-6">
                                        A brief introduction&hellip;
                                    </h3>
                                )}
                            >
                                <p>
                                    I{"'"}m a digital storyteller inspired by
                                    the epic worlds of Alagäesia and
                                    Middle Earth, driven by the musical
                                    imagination of Nightwish. Exploring
                                    creativity through gaming, writing,
                                    and code-navigating the rich
                                    landscapes of Tamriel, the mysteries
                                    of Aperture Science, and the
                                    boundless realms of digital creation.
                                </p>
                            </Card>
                        </div>
                        <div ref={imageCardRef} className="col-span-2">
                            <Card
                                className="relative h-full p-2"
                                footer={[
                                    (<Spacer key={0}/>),
                                    (<span className="select-none">{'Pennybacker Bridge — Austin, Texas'}</span>)
                                ]}
                            >
                                <Image
                                    source={[
                                        {
                                            url: options.homepage.photo.encrypted,
                                            params: {
                                                cover: [512, 288]
                                            }
                                        }
                                    ]}
                                    imgClass="lg:absolute lg:inset-0 rounded-xs w-full h-full"
                                    alt={'Pennybacker Bridge — Austin, Texas'}
                                />
                            </Card>
                        </div>
                        <div ref={mapCardRef} className="col-span-2">
                            <Card
                                className="relative h-full p-2"
                                footer={[
                                    (<Spacer key={0}/>),
                                    (
                                        <span className="select-none">
                                            <Time timezone={'America/Chicago'}/>
                                            {' — Austin, Texas'}
                                        </span>
                                    )
                                ]}
                            >
                                <div className="relative w-full h-[200px] rounded-xs overflow-hidden">
                                    <Map
                                        lat={'30.2672'}
                                        lng={'-97.7431'}
                                        width={512}
                                        height={200}
                                        zoom={10}
                                    />
                                </div>
                            </Card>
                        </div>
                        <div ref={nowPlayingRef} className="col-span-1">
                            <NowPlaying />
                        </div>
                    </section>
                </div>
                <Footer loadMore={``} options={options}/>
            </div>
        </>
    );
};

export default HomePage;
