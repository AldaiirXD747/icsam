
// Mock Firebase storage implementation
// In a real app, you would initialize Firebase properly
export const storage = {
  ref: () => ({
    put: async () => Promise.resolve({ ref: { getDownloadURL: async () => Promise.resolve("https://example.com/image.jpg") } }),
  }),
};
