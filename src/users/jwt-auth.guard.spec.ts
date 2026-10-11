import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGaurd } from './jwt-auth.guard.js';
import { JwtService } from '@nestjs/jwt';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGaurd;
  let jwtService: { verifyAsync: ReturnType<typeof vi.fn> };
  let authorization: string | undefined;

  const context = {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: { authorization },
      }),
    }),
  } as unknown as ExecutionContext;

  beforeEach(() => {
    authorization = undefined;

    jwtService = {
      verifyAsync: vi.fn(),
    };

    guard = new JwtAuthGaurd(jwtService as unknown as JwtService);
  });

  it('should allow a request with a valid Bearer token', async () => {
    authorization = 'Bearer valid-token';
    jwtService.verifyAsync.mockResolvedValue({ sub: 'user-1' });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
  });

  it('should reject a missing authorization header', async () => {
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should reject a malformed authorization header', async () => {
    authorization = 'Basic some-token';

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should reject an invalid token', async () => {
    authorization = 'Bearer invalid-token';
    jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should reject an expired token', async () => {
    authorization = 'Bearer invalid-token';
    jwtService.verifyAsync.mockRejectedValue(new Error('Invalid expired'));

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
