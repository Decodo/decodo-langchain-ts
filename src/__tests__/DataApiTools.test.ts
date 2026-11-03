import { DecodoClient, TimeoutError } from '@decodo/sdk-ts';
import { DecodoCrawlCancelTool, DecodoCrawlTool, DecodoMapTool, DecodoSearchTool } from '../tools';
import { INTEGRATION_HEADER } from '../constants';
import { DecodoApiKeyConfig } from '../types';

const mockSearch = jest.fn();
const mockMap = jest.fn();
const mockCrawl = jest.fn();
const mockCancelCrawl = jest.fn();

jest.mock('@decodo/sdk-ts', () => {
  const actual = jest.requireActual('@decodo/sdk-ts');

  return {
    ...actual,
    DecodoClient: jest.fn().mockImplementation(() => ({
      webScrapingApi: {
        search: mockSearch,
        map: mockMap,
        crawl: mockCrawl,
        cancelCrawl: mockCancelCrawl,
      },
    })),
  };
});

const apiKeyConfig = { apiKey: 'test-api-key' };

const basicAuthConfig = { username: 'test-user', password: 'test-pass' } as unknown as DecodoApiKeyConfig;

afterEach(() => {
  jest.clearAllMocks();
});

describe.each([
  ['DecodoSearchTool', DecodoSearchTool],
  ['DecodoMapTool', DecodoMapTool],
  ['DecodoCrawlTool', DecodoCrawlTool],
  ['DecodoCrawlCancelTool', DecodoCrawlCancelTool],
])('%s', (toolName, Tool) => {
  it('authenticates with an api key and rejects username and password', () => {
    new Tool(apiKeyConfig);

    expect(DecodoClient).toHaveBeenCalledWith({
      webScrapingApi: { apiKey: 'test-api-key', integrationHeader: INTEGRATION_HEADER },
    });
    expect(() => new Tool(basicAuthConfig)).toThrow(`${toolName} requires an apiKey.`);
  });
});

describe('DecodoSearchTool', () => {
  it('returns the search results', async () => {
    const response = { status: 'done', organic: [{ title: 'Result', link: 'https://example.com' }] };
    mockSearch.mockResolvedValue(response);

    const result = await new DecodoSearchTool(apiKeyConfig).invoke({ query: 'laptop reviews' });

    expect(mockSearch).toHaveBeenCalledWith({ query: 'laptop reviews' });
    expect(result).toEqual(response);
  });

  it('throws when the search reports a failure', async () => {
    mockSearch.mockResolvedValue({ status: 'failed', message: 'Upstream unavailable' });

    await expect(new DecodoSearchTool(apiKeyConfig).invoke({ query: 'laptop reviews' })).rejects.toThrow(
      'Decodo search failed: Upstream unavailable'
    );
  });
});

describe('DecodoMapTool', () => {
  it('maps inputs to API parameter names', async () => {
    mockMap.mockResolvedValue({ results: [] });

    await new DecodoMapTool(apiKeyConfig).invoke({
      url: 'https://example.com',
      domainFilter: 'subdomain',
      selectPaths: ['^/blog'],
      jsRender: true,
    });

    expect(mockMap).toHaveBeenCalledWith({
      url: 'https://example.com',
      limit: 100,
      domain_filter: 'subdomain',
      select_paths: ['^/blog'],
      JS_rendering: true,
    });
  });
});

describe('DecodoCrawlTool', () => {
  it('crawls the site and returns a trimmed status and pages', async () => {
    mockCrawl.mockResolvedValue({
      status: { status: 'done', crawl_id: 'crawl-1', discovered: 1, completed: 1, failed: 0 },
      pages: [{ url: 'https://example.com', content: '# Example', depth: 0, task_id: 'task-1' }],
    });

    const result = await new DecodoCrawlTool(apiKeyConfig).invoke({ url: 'https://example.com', maxDepth: 2 });

    expect(mockCrawl).toHaveBeenCalledWith(
      { url: 'https://example.com', limit: 10, output: 'markdown', max_depth: 2, max_duration: 600 },
      { pollInterval: 5_000, timeout: 600_000 }
    );
    expect(result).toStrictEqual({
      status: { status: 'done', discovered: 1, completed: 1, failed: 0 },
      pages: [{ url: 'https://example.com', content: '# Example' }],
    });
  });

  it('rewords the crawl timeout for the agent', async () => {
    mockCrawl.mockRejectedValue(
      new TimeoutError(
        "Crawl crawl-1 did not settle within 600000ms. It is still running; call cancelCrawl('crawl-1') to stop it."
      )
    );

    await expect(new DecodoCrawlTool(apiKeyConfig).invoke({ url: 'https://example.com' })).rejects.toThrow(
      'Crawl crawl-1 did not finish within 600s. Decodo stops it at the same limit, so it ends shortly as truncated; its pages are not returned.'
    );
  });
});

describe('DecodoCrawlCancelTool', () => {
  it('cancels the crawl by id', async () => {
    mockCancelCrawl.mockResolvedValue({ crawl_id: 'crawl-1', status: 'cancelled' });

    await new DecodoCrawlCancelTool(apiKeyConfig).invoke({ crawlId: 'crawl-1' });

    expect(mockCancelCrawl).toHaveBeenCalledWith('crawl-1');
  });
});
