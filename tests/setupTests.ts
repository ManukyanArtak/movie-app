import { TextDecoder, TextEncoder } from 'node:util';

import '@testing-library/jest-dom';

if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder as unknown as typeof global.TextDecoder;
