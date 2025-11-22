import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, TrendingUp, BarChart3, Users, Shield, Zap, CheckCircle, ArrowRight, ChevronRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Redirect to dashboard if logged in
      navigate('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [navigate]);

  if (isChecking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #754E1A 0%, #CBA35C 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>Loading StockMaster...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#754E1A'
    }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-fade-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(117, 78, 26, 0.25);
        }
        .cta-button {
          transition: all 0.3s ease;
        }
        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(203, 163, 92, 0.4);
        }
      `}</style>

      {/* Navigation */}
      <nav style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'white',
        borderBottom: '2px solid #F8E1B7',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #CBA35C 0%, #754E1A 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800
          }}>
            <Package size={24} />
          </div>
          <span style={{ fontSize: '24px', fontWeight: 800, color: '#754E1A' }}>StockMaster</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 24px',
              background: 'white',
              border: '2px solid #754E1A',
              borderRadius: '8px',
              color: '#754E1A',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="cta-button"
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #CBA35C 0%, #754E1A 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #754E1A 0%, #CBA35C 50%, #B6CBBD 100%)',
        padding: '100px 40px 120px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(248,225,183,0.3) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <h1 style={{
              fontSize: '56px',
              fontWeight: 900,
              color: 'white',
              marginBottom: '24px',
              lineHeight: 1.2,
              textShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              Inventory Management<br />Made Simple & Powerful
            </h1>
          </div>
          
          <div className="animate-fade-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <p style={{
              fontSize: '20px',
              color: 'rgba(255,255,255,0.95)',
              marginBottom: '40px',
              lineHeight: 1.6
            }}>
              Track stock, manage operations, and gain insights with StockMaster.<br />
              Built for modern businesses, designed for efficiency.
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.5s', opacity: 0, display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              className="cta-button"
              style={{
                padding: '16px 40px',
                background: 'white',
                border: 'none',
                borderRadius: '12px',
                color: '#754E1A',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Start Free Trial <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '16px 40px',
                background: 'transparent',
                border: '2px solid white',
                borderRadius: '12px',
                color: 'white',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
            >
              Login to Dashboard
            </button>
          </div>

          <div className="animate-fade-up" style={{ 
            animationDelay: '0.7s', 
            opacity: 0,
            marginTop: '60px',
            display: 'flex',
            gap: '48px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {[
              { icon: <Users size={24} />, label: '500+ Users' },
              { icon: <Package size={24} />, label: '10K+ Products Tracked' },
              { icon: <TrendingUp size={24} />, label: '99.9% Uptime' }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', color: 'white' }}>
                <div style={{ marginBottom: '8px', opacity: 0.9 }}>{stat.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '14px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '100px 40px',
        background: '#F8E1B7'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '16px',
            color: '#754E1A'
          }}>
            Everything You Need to Manage Inventory
          </h2>
          <p style={{
            textAlign: 'center',
            fontSize: '18px',
            color: '#997644',
            marginBottom: '60px'
          }}>
            Powerful features designed for businesses of all sizes
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {[
              {
                icon: <Package size={32} />,
                title: 'Real-Time Stock Tracking',
                description: 'Monitor inventory levels in real-time with automatic updates and low-stock alerts.'
              },
              {
                icon: <BarChart3 size={32} />,
                title: 'Advanced Analytics',
                description: 'Get insights into stock movement, trends, and forecasting with detailed reports.'
              },
              {
                icon: <Zap size={32} />,
                title: 'Fast Operations',
                description: 'Process receipts, deliveries, and transfers with lightning-fast workflows.'
              },
              {
                icon: <Shield size={32} />,
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security with role-based access control and audit trails.'
              },
              {
                icon: <Users size={32} />,
                title: 'Multi-User Support',
                description: 'Collaborate with your team with different roles and permissions.'
              },
              {
                icon: <TrendingUp size={32} />,
                title: 'Smart Insights',
                description: 'AI-powered recommendations and predictions to optimize your inventory.'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  border: '2px solid #CBA35C',
                  boxShadow: '0 4px 12px rgba(117, 78, 26, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #CBA35C 0%, #754E1A 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  marginBottom: '20px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  marginBottom: '12px',
                  color: '#754E1A'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: '#997644',
                  lineHeight: 1.6
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{
        padding: '100px 40px',
        background: 'white'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '60px',
            color: '#754E1A'
          }}>
            Why Choose StockMaster?
          </h2>

          <div style={{
            display: 'grid',
            gap: '24px'
          }}>
            {[
              'Reduce stock-outs by 85% with intelligent forecasting',
              'Save 10+ hours per week on manual inventory tasks',
              'Eliminate errors with automated tracking and validation',
              'Scale effortlessly from 10 to 10,000+ products',
              'Get up and running in under 5 minutes',
              'Access your data anywhere, anytime with cloud sync'
            ].map((benefit, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px',
                  background: '#F8E1B7',
                  borderRadius: '12px',
                  border: '2px solid #CBA35C'
                }}
              >
                <CheckCircle size={24} color="#754E1A" strokeWidth={3} />
                <span style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#754E1A'
                }}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '100px 40px',
        background: 'linear-gradient(135deg, #754E1A 0%, #CBA35C 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: 900,
            color: 'white',
            marginBottom: '24px'
          }}>
            Ready to Transform Your Inventory?
          </h2>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '40px',
            lineHeight: 1.6
          }}>
            Join hundreds of businesses already using StockMaster to streamline their operations.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="cta-button"
            style={{
              padding: '18px 48px',
              background: 'white',
              border: 'none',
              borderRadius: '12px',
              color: '#754E1A',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            Get Started Free <ChevronRight size={24} />
          </button>
          <p style={{
            marginTop: '20px',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.8)'
          }}>
            No credit card required • Free 30-day trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px',
        background: '#754E1A',
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <Package size={24} color="white" />
          <span style={{ fontSize: '20px', fontWeight: 800, color: 'white' }}>StockMaster</span>
        </div>
        <p style={{ fontSize: '14px', marginBottom: '8px' }}>
          Built for the Odoo × SPIT Hackathon
        </p>
        <p style={{ fontSize: '13px', opacity: 0.7 }}>
          © 2025 StockMaster. All rights reserved.
        </p>
      </footer>
    </div>
  );
}