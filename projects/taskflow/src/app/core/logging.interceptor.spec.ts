import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { loggingInterceptor } from './logging.interceptor';

describe('loggingInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loggingInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  it('passes successful responses through and logs them', async () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => {});
    const response = firstValue(http.get<{ ok: boolean }>('/data'));

    controller.expectOne('/data').flush({ ok: true });

    expect(await response).toEqual({ ok: true });
    expect(debug).toHaveBeenCalledWith(expect.stringContaining('[http] GET /data'));
  });

  it('logs failures and rethrows them', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const response = firstValue(http.get('/missing'));

    controller.expectOne('/missing').flush('nope', { status: 404, statusText: 'Not Found' });

    await expect(response).rejects.toBeTruthy();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('[http] GET /missing failed'),
      expect.anything(),
    );
  });
});

function firstValue<T>(source: {
  subscribe: (observer: Record<string, unknown>) => unknown;
}): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    source.subscribe({ next: resolve, error: reject });
  });
}
