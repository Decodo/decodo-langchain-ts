import axios from 'axios';
import { DecodoUniversalTool } from '../tools';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('DecodoScraperTool', () => {
  let tool: DecodoUniversalTool;
  let mockPost: jest.Mock;

  beforeEach(() => {
    mockPost = jest.fn();
    mockedAxios.create.mockReturnValue({
      request: mockPost,
    } as any);

    jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);

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

    const result = await tool.invoke({ url: 'https://example.com' });

    expect(mockPost).toHaveBeenCalledWith({
      method: 'POST',
      headers: {
        'x-integration': 'langchain',
      },
      data: {
        url: 'https://example.com',
        markdown: true,
      },
    });
    expect(result).toEqual({
      content: '<html>Test content</html>',
      status: 200,
      url: 'https://example.com',
      timestamp: '2023-01-01T00:00:00Z',
    });
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

    const input = {
      url: 'https://example.com',
      markdown: true,
      jsRender: true,
      geo: 'US',
    };

    const result = await tool.invoke(input);

    expect(mockPost).toHaveBeenCalledWith({
      method: 'POST',
      headers: {
        'x-integration': 'langchain',
      },
      data: {
        url: 'https://example.com',
        markdown: true,
        headless: 'html',
        geo: 'US',
      },
    });
    expect(result).toEqual({
      content: 'Markdown content',
      status: 200,
      url: 'https://example.com',
      timestamp: '2023-01-01T00:00:00Z',
    });
  });

  it('should handle non-Axios errors', async () => {
    const mockError = new Error('Network error');
    jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);
    mockPost.mockRejectedValue(mockError);

    await expect(tool.invoke({ url: 'https://example.com' })).rejects.toThrow('Network error');
  });
});
