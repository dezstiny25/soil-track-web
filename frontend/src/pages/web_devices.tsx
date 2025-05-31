import { useState } from 'react';
import TabNavigation from '../components/TabNavigation';

// CSS

import '../index.css';
import dashboardStyles from '../styles/dashboard.module.css';
import plotStyles from '../styles/plots.module.css';

// Pages
import WebController from './web_controller';
import WebPumpValves from './web_pumps_valves';

const chartTabs = [
  { id: 'Controller', name: 'Controller', to: '/web_controller' },
  { id: 'Pump and Valves', name: 'Pump and Valves', to: '/web_pump_and_valves' },
];


export default function WebDevices() {
      const [activeTabChart, setActiveTab] = useState('Controller');
    return (
        <div className="min-h-screen min-w-screen">
            <main className="flex-grow container mt-0 py-8 pt-0 space-y-8">

                {/* Row 1: Header Title and Control */}
                <div className={`${dashboardStyles.header} ${plotStyles.header} flex items-center justify-between mb-8`}>
                    <span className={`${dashboardStyles.mainTitle} font-semibold text-[#134F14]`}><span className='text-[#838383]'>Hey</span>, your device is not connected.</span>
                    <div className="flex items-center space-x-4">
                        {/* Placeholder for any control buttons */}
                        <TabNavigation
                            tabs={chartTabs}
                            activeTab={activeTabChart}
                            onTabChange={setActiveTab}
                            size="md"
                            fullWidth={false}
                            className=""
                        />
                    </div>
                </div>

                {/* Call controller here */}
                
                {/* Render content based on active tab */}
                {activeTabChart === 'Controller' && (
                    <WebController />
                )}
                {activeTabChart === 'Pump and Valves' && (
                    <WebPumpValves />
                )}
                {/* You can add more conditions for other tabs if needed */}

            </main>
        </div>
    )
}