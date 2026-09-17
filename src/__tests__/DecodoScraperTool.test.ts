import { DecodoClient, DecodoError, Target } from '@decodo/sdk-ts';
import { DecodoUniversalTool } from '../tools';

const mockScrape = jest.fn();

jest.mock('@decodo/sdk-ts', () => {
  const actual = jest.requireActual('@decodo/sdk-ts');

  return {
    ...actual,
    DecodoClient: jest.fn().mockImplementation(() => ({
      webScrapingApi: { scrape: mockScrape },
    })),
  };
});

describe('DecodoScraperTool', () => {
  let tool: DecodoUniversalTool;

  beforeEach(() => {
    tool = new DecodoUniversalTool({
      username: 'test-user',
      password: 'test-pass',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create tool with correct configuration', () => {
    expect(tool.name).toBe('decodo_universal_tool');
  });

  it('should authenticate with a basic auth token and the langchain integration header', () => {
    expect(DecodoClient).toHaveBeenCalledWith({
      webScrapingApi: {
        token: Buffer.from('test-user:test-pass').toString('base64'),
        integrationHeader: 'langchain',
      },
    });
  });

  it('should handle simple URL input', async () => {
    const mockResponse = {
      results: [
        {
          content: '<html>Test content</html>',
          status_code: 200,
          url: 'https://example.com',
          task_id: 'task-1',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ],
    };

    mockScrape.mockResolvedValue(mockResponse);

    const result = await tool.invoke({ url: 'https://example.com' });

    expect(mockScrape).toHaveBeenCalledWith({
      target: Target.Universal,
      url: 'https://example.com',
      markdown: true,
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle JSON input with parameters', async () => {
    const mockResponse = {
      results: [
        {
          content: 'Markdown content',
          status_code: 200,
          url: 'https://example.com',
          task_id: 'task-2',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ],
    };

    mockScrape.mockResolvedValue(mockResponse);

    const input = {
      url: 'https://example.com',
      markdown: true,
      jsRender: true,
      geo: 'US',
    };

    const result = await tool.invoke(input);

    expect(mockScrape).toHaveBeenCalledWith({
      target: Target.Universal,
      url: 'https://example.com',
      markdown: true,
      headless: 'html',
      geo: 'US',
    });
    expect(result).toEqual(mockResponse);
  });

  it('should wrap Decodo API errors', async () => {
    mockScrape.mockRejectedValue(new DecodoError('Invalid request', 400, 'failed'));

    await expect(tool.invoke({ url: 'https://example.com' })).rejects.toThrow('Decodo API error: Invalid request');
  });

  it('should rethrow non-Decodo errors', async () => {
    mockScrape.mockRejectedValue(new Error('Network error'));

    await expect(tool.invoke({ url: 'https://example.com' })).rejects.toThrow('Network error');
  });
});
