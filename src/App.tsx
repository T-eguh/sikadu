/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PhoneFrame } from './simulator/PhoneFrame';
import { MobileApp } from './simulator/MobileApp';
import { DeviceType } from './simulator/types';

export default function App() {
  const [device, setDevice] = useState<DeviceType>('ios');

  return (
    <PhoneFrame device={device} onDeviceChange={setDevice}>
      <MobileApp />
    </PhoneFrame>
  );
}
