import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { JwtService } from '@nestjs/jwt';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: { verifyAsync: ReturnType<typeof vi.fn> };

  const request = {
    headers: { authorization: undefined as string | undefined },
    user: undefined as unknown,
  };

  const context = {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;

  beforeEach(() => {
    request.headers.authorization = undefined;
    request.user = undefined;

    jwtService = {
      verifyAsync: vi.fn(),
    };

    guard = new JwtAuthGuard(jwtService as unknown as JwtService);
  });

  it('should allow a request with a valid Bearer token', async () => {
    request.headers.authorization = 'Bearer valid-token';
    jwtService.verifyAsync.mockResolvedValue({
      sub: 'user-1',
      role: 'CUSTOMER',
    });

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
    expect(context.switchToHttp().getRequest().user).toEqual({
      sub: 'user-1',
      role: 'CUSTOMER',
    });
  });

  it('should reject a missing authorization header', async () => {
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should reject a malformed authorization header', async () => {
    request.headers.authorization = 'Basic some-token';

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('should reject an invalid token', async () => {
    request.headers.authorization = 'Bearer invalid-token';
    jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should reject an expired token', async () => {
    request.headers.authorization = 'Bearer invalid-token';
    jwtService.verifyAsync.mockRejectedValue(new Error('Invalid expired'));

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should reject a token without a sub claim', async () => {
    request.headers.authorization = 'Bearer valid-token';
    jwtService.verifyAsync.mockResolvedValue({ role: 'CUSTOMER' });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should reject a token without a role claim', async () => {
    request.headers.authorization = 'Bearer valid-token';
    jwtService.verifyAsync.mockResolvedValue({ sub: 'user-1' });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
