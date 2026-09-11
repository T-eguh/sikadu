/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PhoneFrame } from './simulator/PhoneFrame';
import { MobileApp, ScreenState } from './simulator/MobileApp';
import { DeviceType } from './simulator/types';
import { TOKEN_STORAGE_KEY } from './simulator/mockApi';

export default function App() {
  const [device, setDevice] = useState<DeviceType>('android');
  const [screen, setScreen] = useState<ScreenState>('splash');
  const [nonce, setNonce] = useState<number>(0);

  const handleScreenChange = (newScreen: ScreenState) => {
    if (newScreen === 'splash') {
      setNonce((n) => n + 1);
    }
    setScreen(newScreen);
  };

  const handleResetSession = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setNonce((n) => n + 1);
    setScreen('splash');
  };

  return (
    <PhoneFrame
      device={device}
      onDeviceChange={setDevice}
      currentScreen={screen}
      onScreenChange={handleScreenChange}
      onResetSession={handleResetSession}
    >
      <MobileApp
        key={`mobile-${nonce}`}
        currentScreen={screen}
        onScreenChange={setScreen}
      />
    </PhoneFrame>
  );
}

