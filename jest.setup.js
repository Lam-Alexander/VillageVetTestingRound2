// jest.setup.js
require('dotenv').config({ path: '.env.local' });
// jest.setup.js
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
// jest.setup.js
