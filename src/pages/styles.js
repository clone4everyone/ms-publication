export const submissionDetailStyles = `
  @media print {
    .no-print-for-reviewer {
      display: none !important;
    }
  }

  @keyframes slideDown {
    from { transform: translateY(-100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes fadeInUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }

  .animate-slide-down { animation: slideDown 0.5s ease-out; }
  .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
  .animate-scale-in { animation: scaleIn 0.4s ease-out; }
  .animate-delay-100 { animation-delay: 0.1s; animation-fill-mode: both; }
  .animate-delay-200 { animation-delay: 0.2s; animation-fill-mode: both; }
  .animate-delay-300 { animation-delay: 0.3s; animation-fill-mode: both; }

  .glass-morphism {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .hover-lift {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .hover-lift:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .gradient-border {
    position: relative;
    background: white;
  }

  .gradient-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(135deg, #0d9488, #fbbf24);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  .shimmer-bg {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
`;