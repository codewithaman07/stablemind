import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getAnonymousIdentity } from './identity.ts';

describe('getAnonymousIdentity', () => {
    it('should return a consistent identity for the same seed', () => {
        const seed = 'user123';
        const identity1 = getAnonymousIdentity(seed);
        const identity2 = getAnonymousIdentity(seed);
        assert.deepStrictEqual(identity1, identity2);
    });

    it('should return different identities for different seeds', () => {
        const identity1 = getAnonymousIdentity('seed1');
        const identity2 = getAnonymousIdentity('seed2');
        assert.notDeepStrictEqual(identity1, identity2);
    });

    it('should return valid identity structure', () => {
        const identity = getAnonymousIdentity('test');
        assert.ok(identity.avatar);
        assert.ok(identity.color);
        assert.ok(identity.name);
        assert.match(identity.name, /^Anonymous .+/);
        assert.match(identity.color, /^#[0-9a-fA-F]{6}$/);
    });
});
