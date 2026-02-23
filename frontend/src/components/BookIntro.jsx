import React, { useState, useEffect, useCallback } from 'react';
import './BookIntro.css';

/**
 * BookIntro — Cinematic book-opening animation that plays once on first load.
 *
 * Props:
 *   onComplete  — called when the animation finishes (or is skipped)
 *   duration    — total animation time in ms before auto-completing (default 3800)
 */
const BookIntro = ({ onComplete, duration = 3800 }) => {
    const [phase, setPhase] = useState('playing'); // 'playing' | 'fading' | 'done'

    // Check for reduced-motion preference
    const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const finish = useCallback(() => {
        if (phase === 'done') return;
        setPhase('fading');
        // Wait for the fade-out transition (800ms in CSS) then remove overlay
        setTimeout(() => {
            setPhase('done');
            onComplete?.();
        }, 800);
    }, [phase, onComplete]);

    // Auto-complete after animation duration
    useEffect(() => {
        if (prefersReducedMotion) {
            // Skip immediately for reduced-motion users
            setPhase('done');
            onComplete?.();
            return;
        }

        const timer = setTimeout(finish, duration);
        return () => clearTimeout(timer);
    }, [duration, finish, prefersReducedMotion, onComplete]);

    // Already done — render nothing
    if (phase === 'done') return null;

    return (
        <div className={`book-intro-overlay ${phase === 'fading' ? 'fade-out' : ''}`}>
            {/* 3D Book */}
            <div className="book-scene">
                <div className="book">
                    {/* Glow radiating from inside */}
                    <div className="book-glow" />

                    {/* Inner pages (visible after covers open) */}
                    <div className="book-page-left" />
                    <div className="book-page-right" />
                    <div className="book-spine" />

                    {/* Front cover — opens to the right */}
                    <div className="book-cover">
                        <div className="book-cover-content">
                            <div className="book-cover-icon">📘</div>
                            <div className="book-cover-title">CalmPrep AI</div>
                            <div className="book-cover-subtitle">Your Exam Companion</div>
                        </div>
                    </div>

                    {/* Back cover — opens to the left */}
                    <div className="book-back" />

                    {/* Sparkle particles */}
                    <div className="book-particles">
                        <div className="particle" />
                        <div className="particle" />
                        <div className="particle" />
                        <div className="particle" />
                        <div className="particle" />
                        <div className="particle" />
                    </div>
                </div>
            </div>

            {/* Skip button */}
            <button className="skip-btn" onClick={finish} aria-label="Skip intro animation">
                Skip ›
            </button>
        </div>
    );
};

export default BookIntro;
