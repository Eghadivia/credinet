"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Mousewheel, EffectFade } from "swiper/modules";


export default function NotesSection() {
  return (
    <section id="how" className="notes_section">
      <div className="container mx-auto">
        <div className="sub_heading">
          <h2 className="psj_font text-[52px] font-extrabold text-center w-full">
            How Virtual <span className="pjs_font primary_clr">Top-Up</span> Works
          </h2>
          <p
            className="it_font font-medium text-center text-xl mb-0 w-full mx-auto"
            style={{ maxWidth: 552 }}
          >
            Get started in minutes and experience the fastest way to handle your everyday utility payments.
          </p>
        </div>

        <div className="notes_outer_wrapper relative mt-5">
          <Swiper
            direction="vertical"
            effect="fade"
            speed={400}
            loop={false}
            modules={[Pagination, Mousewheel, EffectFade]}
            pagination={{
              clickable: true,
              renderBullet: (index, className) => {
                return `<span class="${className}">${index + 1}</span>`;
              },
            }}
            mousewheel={{
              invert: false,
              forceToAxis: false,
              thresholdDelta: 50,
              sensitivity: 1,
            }}
            onSlideChange={(swiper) => {
              swiper.slides.forEach((slide) => {
                const bg = slide.querySelector(".background");
                if (bg) bg.classList.remove("animation");
              });

              const activeSlide = swiper.slides[swiper.activeIndex];
              const bg = activeSlide.querySelector(".background");

              if (bg) bg.classList.add("animation");
            }}
            className="swiper-container "
          >
              {/* Slide 1 */}
              <SwiperSlide>
                <div className="slide-inner">
                  <div className="notes_wrapper">
                    <div className="notes_content_blk">
                      <h3 className="psj_font font-medium">Notes AI</h3>
                      <p className="inter_font font-medium text_clr mb-0">
                        Transform lectures and textbooks into concise, organized knowledge that actually sticks.
                      </p>

                      <ul className="list-unstyled mb-0">
                        <li className="notes_content_li d-flex">
                          <div className="notes_content_icon">
                            <img src="/assets/images/user.svg" alt="icon" />
                          </div>
                          <div className="notes_content_text">
                            <h4 className="fs-6 it_font font-medium">Live Notes</h4>
                            <p className="fs-14 it_font text_clr mb-0">
                              Record your lecture and watch as Nursify transcribes and summarizes in real-time.
                            </p>
                          </div>
                        </li>
                        <li className="notes_content_li d-flex">
                          <div className="notes_content_icon">
                            <img src="/assets/images/user.svg" alt="icon" />
                          </div>
                          <div className="notes_content_text">
                            <h4 className="fs-6 it_font font-medium">Live Notes</h4>
                            <p className="fs-14 it_font text_clr mb-0">
                              Record your lecture and watch as Nursify transcribes and summarizes in real-time.
                            </p>
                          </div>
                        </li>
                        <li className="notes_content_li d-flex">
                          <div className="notes_content_icon">
                            <img src="/assets/images/user.svg" alt="icon" />
                          </div>
                          <div className="notes_content_text">
                            <h4 className="fs-6 it_font font-medium">Live Notes</h4>
                            <p className="fs-14 it_font text_clr mb-0">
                              Record your lecture and watch as Nursify transcribes and summarizes in real-time.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="notes_media_base">
                      <div className="notes_media_blk">
                        <img src="/assets/images/transaction-sucess.png" alt="Notes AI" />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              {/* Slide 2 */}
              <SwiperSlide>
                <div className="slide-inner">
                  <div className="notes_wrapper">
                    <div className="notes_content_blk">
                      <h3 className="it_font font-medium">Calendar AI</h3>
                      <p className="it_font font-medium text_clr mb-0">
                        Smart calendar management that organizes your study schedule.
                      </p>
                      <ul className="list-unstyled mb-0">
                        <li className="notes_content_li d-flex">
                          <div className="notes_content_icon">
                            <img src="/assets/images/user.svg" alt="icon" />
                          </div>
                          <div className="notes_content_text">
                            <h4 className="fs-6 it_font font-medium">Live Notes</h4>
                            <p className="fs-14 it_font text_clr mb-0">
                              22222  Record your lecture and watch as Nursify transcribes and summarizes in real-time.
                            </p>
                          </div>
                        </li>
                        <li className="notes_content_li d-flex">
                          <div className="notes_content_icon">
                            <img src="/assets/images/user.svg" alt="icon" />
                          </div>
                          <div className="notes_content_text">
                            <h4 className="fs-6 it_font font-medium">Live Notes</h4>
                            <p className="fs-14 it_font text_clr mb-0">
                              Record your lecture and watch as Nursify transcribes and summarizes in real-time.
                            </p>
                          </div>
                        </li>
                        <li className="notes_content_li d-flex">
                          <div className="notes_content_icon">
                            <img src="/assets/images/user.svg" alt="icon" />
                          </div>
                          <div className="notes_content_text">
                            <h4 className="fs-6 it_font font-medium">Live Notes</h4>
                            <p className="fs-14 it_font text_clr mb-0">
                              Record your lecture and watch as Nursify transcribes and summarizes in real-time.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="notes_media_base">
                      <div className="notes_media_blk">
                        <img src="/assets/images/transaction-sucess.png" alt="Calendar AI" />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              {/* Slide 3 */}
              <SwiperSlide>
                <div className="slide-inner">
                  <div className="notes_wrapper">
                    <div className="notes_content_blk">
                      <h3 className="it_font font-medium">Clinical AI</h3>
                      <p className="it_font font-medium text_clr mb-0">
                        Bridge the gap between textbook knowledge and real clinical practice.
                      </p>
                      <ul className="list-unstyled mb-0">
                        <li className="notes_content_li d-flex">
                          <div className="notes_content_icon">
                            <img src="/assets/images/user.svg" alt="icon" />
                          </div>
                          <div className="notes_content_text">
                            <h4 className="fs-6 it_font font-medium">Live Notes</h4>
                            <p className="fs-14 it_font text_clr mb-0">
                              3333 Record your lecture and watch as Nursify transcribes and summarizes in real-time.
                            </p>
                          </div>
                        </li>
                        <li className="notes_content_li d-flex">
                          <div className="notes_content_icon">
                            <img src="/assets/images/user.svg" alt="icon" />
                          </div>
                          <div className="notes_content_text">
                            <h4 className="fs-6 it_font font-medium">Live Notes</h4>
                            <p className="fs-14 it_font text_clr mb-0">
                              Record your lecture and watch as Nursify transcribes and summarizes in real-time.
                            </p>
                          </div>
                        </li>
                        <li className="notes_content_li d-flex">
                          <div className="notes_content_icon">
                            <img src="/assets/images/user.svg" alt="icon" />
                          </div>
                          <div className="notes_content_text">
                            <h4 className="fs-6 it_font font-medium">Live Notes</h4>
                            <p className="fs-14 it_font text_clr mb-0">
                              Record your lecture and watch as Nursify transcribes and summarizes in real-time.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="notes_media_base">
                      <div className="notes_media_blk">
                        <img src="/assets/images/transaction-sucess.png" alt="Clinical AI" />
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  );
}
