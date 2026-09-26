import { describe, expect, it } from 'vitest';
import { AppService } from './app.service.js';

describe('AppService', () => {
    it('should return hello message', () => {
        const service = new AppService();

        expect(service.getHello()).toBeDefined();
    });
});
