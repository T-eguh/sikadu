/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PhoneFrame } from './simulator/PhoneFrame';
import { MobileApp, ScreenState } from './simulator/MobileApp';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('splash');
  const [nonce, setNonce] = useState<number>(0);

  return (
    <PhoneFrame>
      <MobileApp
        key={`mobile-${nonce}`}
        currentScreen={screen}
        onScreenChange={setScreen}
      />
    </PhoneFrame>
  );
}

