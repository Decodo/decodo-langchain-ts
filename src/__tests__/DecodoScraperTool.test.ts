import axios from 'axios';
import { DecodoUniversalTool } from '../tools';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DecodoScraperTool', () => {
  let tool: DecodoUniversalTool;
  let mockPost: jest.Mock;

  beforeEach(() => {
    mockPost = jest.fn();
    mockedAxios.create.mockReturnValue({
      post: mockPost,
    } as any);

    tool = new DecodoUniversalTool({
      username: 'test-user',
      password: 'test-pass',
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create tool with correct configuration', () => {
    expect(tool.name).toBe('decodo_scraper');
    expect(tool.description).toContain('Scrape any URL');
  });

  it('should handle simple URL input', async () => {
    const mockResponse = {
      data: {
        content: '<html>Test content</html>',
        status: 200,
        url: 'https://example.com',
        timestamp: '2023-01-01T00:00:00Z',
      },
    };

    mockPost.mockResolvedValue(mockResponse);

    const result = await tool.invoke('https://example.com');

    expect(mockPost).toHaveBeenCalledWith('/scrape', {
      url: 'https://example.com',
    });
    expect(result).toBe('<html>Test content</html>');
  });

  it('should handle JSON input with parameters', async () => {
    const mockResponse = {
      data: {
        content: 'Markdown content',
        status: 200,
        url: 'https://example.com',
        timestamp: '2023-01-01T00:00:00Z',
      },
    };

    mockPost.mockResolvedValue(mockResponse);

    const input = JSON.stringify({
      url: 'https://example.com',
      markdown: true,
      jsRender: true,
      geo: 'US',
    });

    const result = await tool.invoke(input);

    expect(mockPost).toHaveBeenCalledWith('/scrape', {
      url: 'https://example.com',
      markdown: true,
      jsRender: true,
      geo: 'US',
    });
    expect(result).toBe('Markdown content');
  });

  it('should handle API errors', async () => {
    const mockError = {
      response: {
        data: {
          message: 'API rate limit exceeded',
        },
      },
    };

    mockedAxios.isAxiosError.mockReturnValue(true);
    mockPost.mockRejectedValue(mockError);

    await expect(tool.invoke('https://example.com')).rejects.toThrow('Decodo API error: API rate limit exceeded');
  });

  it('should handle non-Axios errors', async () => {
    const mockError = new Error('Network error');
    mockedAxios.isAxiosError.mockReturnValue(false);
    mockPost.mockRejectedValue(mockError);

    await expect(tool.invoke('https://example.com')).rejects.toThrow('Network error');
  });
});
