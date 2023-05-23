import React, { useEffect, useState } from 'react';
import TestimonialCard from './TestimonialCard';
import { submit } from 'common/services/request';
import { Carousel } from 'react-responsive-carousel';
import {
  FetchALlEvents,
  FetchtestimonialsHomePage
} from 'common/services/request/query/fetch-testimonials';
import { Link } from 'react-router-dom';
import './Testimonial.css';

const TestimonialSection = () => {
  const [testimonials, setestimonials] = useState([]);

  const fetchtestimonials = async () => {
    const res = await submit(FetchtestimonialsHomePage());
    setestimonials(res);
  };

  const fetchtestevents = async () => {
    const res = await submit(FetchALlEvents());
  };

  useEffect(() => {
    fetchtestimonials();
    fetchtestevents();
  }, []);

  return (
    <>
      <Carousel autoPlay={true} showArrows={true} showStatus={false} showThumbs={false}>
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            quote={testimonial.quote}
            title={testimonial.title}
            name={testimonial.user_id_map.displayName}
            avatarUrl={testimonial.user_id_map.avatarUrl}
            codeName={testimonial.testimonials_event.name}
            created_at={testimonial.created_at}
          />
        ))}
      </Carousel>
      <div className="testimonial-footer">
        <Link className="testimonial-anchor" to="/testimonials">
          <span className="text">View all Testimonials</span>
        </Link>
      </div>
    </>
  );
};

export default TestimonialSection;