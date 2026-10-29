/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import './index.css';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic Year
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }

  // 2. Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle') as HTMLButtonElement | null;
  const navLinks = document.getElementById('navLinks') as HTMLElement | null;

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking any nav link
    const links = navLinks.querySelectorAll<HTMLAnchorElement>('.dock-link, .nav-link');
    links.forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
      });
    });
  }

  // 3. Navbar scroll effect
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (navbar) {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 4. Active Section Highlighting using IntersectionObserver
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const dockItems = document.querySelectorAll<HTMLAnchorElement>('.dock-link, .nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          dockItems.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }

  // 5. Copy Email functionality with feedback
  const copyEmailBtn = document.getElementById('copyEmailBtn') as HTMLButtonElement | null;
  const copyBtnText = document.getElementById('copyBtnText');
  const copyToast = document.getElementById('copyToast');
  const emailLink = document.getElementById('emailLink') as HTMLAnchorElement | null;

  if (copyEmailBtn && emailLink) {
    const emailToCopy = emailLink.textContent?.trim() || 'mohamedazizayedi14@gmail.com';

    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback for older browsers / iframe restrictions
          const textarea = document.createElement('textarea');
          textarea.value = emailToCopy;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        // Visual feedback
        if (copyBtnText) copyBtnText.textContent = 'Copied!';
        if (copyToast) copyToast.classList.add('visible');

        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copy';
          if (copyToast) copyToast.classList.remove('visible');
        }, 2200);
      } catch (err) {
        console.warn('Could not copy email to clipboard', err);
      }
    });
  }
});
