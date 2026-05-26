import { describe, it, expect, vi, beforeEach } from 'vitest';
import { downloadCSV } from '@/lib/csv-export';

describe('downloadCSV', () => {
  let mockLink: { href: string; download: string; click: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockLink = { href: '', download: '', click: vi.fn() };
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLElement);
    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  it('returns early for empty array', () => {
    downloadCSV([], 'test.csv');
    expect(document.createElement).not.toHaveBeenCalled();
  });

  it('returns early for undefined/null', () => {
    downloadCSV(undefined as unknown as Record<string, unknown>[], 'test.csv');
    expect(document.createElement).not.toHaveBeenCalled();

    downloadCSV(null as unknown as Record<string, unknown>[], 'test.csv');
    expect(document.createElement).not.toHaveBeenCalled();
  });

  it('creates correct CSV content and triggers download', () => {
    const data = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ];

    downloadCSV(data, 'people');

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(mockLink.download).toBe('people.csv');
    expect(mockLink.click).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
  });

  it('properly escapes quotes in values', () => {
    const data = [{ text: 'He said "hello"' }];

    // Capture the blob content
    let capturedBlob: Blob | undefined;
    vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      capturedBlob = blob as Blob;
      return 'blob:test-url';
    });

    downloadCSV(data, 'test.csv');

    expect(capturedBlob).toBeDefined();
    // Read the blob content
    const reader = new FileReader();
    return new Promise<void>((resolve) => {
      reader.onload = () => {
        const content = reader.result as string;
        // Quotes in values should be escaped as double-quotes
        expect(content).toContain('"He said ""hello"""');
        resolve();
      };
      reader.readAsText(capturedBlob!);
    });
  });

  it('appends .csv extension if not present', () => {
    const data = [{ a: 1 }];
    downloadCSV(data, 'myfile');
    expect(mockLink.download).toBe('myfile.csv');
  });

  it('does not double .csv extension', () => {
    const data = [{ a: 1 }];
    downloadCSV(data, 'myfile.csv');
    expect(mockLink.download).toBe('myfile.csv');
  });
});
