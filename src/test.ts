// Using ES5 strict mode
'use strict';

//  Imports

import ReditFetchClient from './FetchClient';

// These are Jest based tests, but could probably work in most testing frameworks

// Unit tests

test('FetchClient Should NOT work without an error', () => {
    expect(new ReditFetchClient(null, null, null, null)).toThrow(Error);
})


// Download tests