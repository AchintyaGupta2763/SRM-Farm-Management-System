import React from 'react';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
    const { user } = useAuth();

    // ✅ Farming Related Features
    const features = [
        {
            title: 'Farm Operations',
            description: 'Manage field activities, track daily work, and optimize productivity.'
        },
        {
            title: 'Weather Forecasts',
            description: 'Get real-time weather updates to plan your farming activities effectively.'
        },
        {
            title: 'Crop Management',
            description: 'Monitor crop growth, schedule irrigation, and analyze yield data.'
        },
        {
            title: 'Inventory & Tools',
            description: 'Track farm equipment, tool movements, and stock registers seamlessly.'
        },
        {
            title: 'Financial Records',
            description: 'Maintain purchase registers, labor payments, and expense tracking for your farm.'
        },
        {
            title: 'Reports & Insights',
            description: 'Generate detailed reports on farm performance and productivity trends.'
        }
    ];

    return (
        <div className="landing-container">
            <header className="landing-header">
                <h1 className="welcome-text">🌾 Welcome to the Farm Management Dashboard, {user?.username}! 🌿</h1>
                <p>Effortlessly manage your farm, track activities, and enhance productivity.</p>
            </header>

            <div className="features-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                        <h3>🌱 {feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>

            <section className="getting-started">
                <h2>🚜 Get Started with Smart Farming</h2>
                <p>
                    Use this dashboard to manage your farming activities efficiently. Explore the sections above 
                    to track your farm tools, analyze reports, and optimize your workflow. 
                </p>
                <p>📌 Need help? Visit our <a href="/documentation">Documentation</a> for step-by-step guides.</p>
            </section>
        </div>
    );
};

export default LandingPage;
