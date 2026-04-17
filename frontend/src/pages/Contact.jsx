import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const { firstName, lastName, email, subject, message } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!firstName || !lastName || !email || !message) {
      return toast.error('Please fill all required fields');
    }

    setLoading(true);
    try {
      const response = await api.post('/contact', {
        name: `${firstName} ${lastName}`,
        email,
        subject: subject || 'No Subject',
        message
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 my-5">
      <div className="text-center mb-5">
        <h1 className="font-weight-bold text-primary">Get in Touch</h1>
        <p className="lead text-muted">We'd love to hear from you. Please reach out with any inquiries.</p>
      </div>

      <div className="row">
        <div className="col-lg-4 mb-4 mb-lg-0">
          <div className="card h-100 border-0 shadow-sm p-4 bg-primary text-white text-center">
            <h4 className="font-weight-bold mb-4">Contact Information</h4>
            <p className="mb-4 font-weight-light">Our dedicated team is ready to assist you. Connect through any of the detailed networks below.</p>

            <div className="d-flex align-items-center mb-4 pl-3 text-left">
              <MapPin className="mr-3" />
              <span>123 Innovation Drive,<br />Siwan City, Bihar 841226</span>
            </div>
            <div className="d-flex align-items-center mb-4 pl-3 text-left">
              <Phone className="mr-3" />
              <span>+1 (800) 123-4567</span>
            </div>
            <div className="d-flex align-items-center mb-4 pl-3 text-left">
              <Mail className="mr-3" />
              <span>support@Cartifypremium.com</span>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm p-5 h-100">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="font-weight-bold small text-secondary">First Name</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    placeholder="first name"
                    name="firstName"
                    value={firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="font-weight-bold small text-secondary">Last Name</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    placeholder="last name"
                    name="lastName"
                    value={lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="font-weight-bold small text-secondary">Email Address</label>
                <input
                  type="email"
                  className="form-control bg-light"
                  placeholder="enter your email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="font-weight-bold small text-secondary">Subject</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  placeholder="How can we help?"
                  name="subject"
                  value={subject}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="font-weight-bold small text-secondary">Message</label>
                <textarea
                  className="form-control bg-light"
                  rows="5"
                  placeholder="Write your message here..."
                  name="message"
                  value={message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary px-4 py-2 d-flex align-items-center justify-content-center w-100"
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 size={18} className="mr-2 animate-spin" /> Sending...</>
                ) : (
                  <>Send Message <Send size={18} className="ml-2" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
