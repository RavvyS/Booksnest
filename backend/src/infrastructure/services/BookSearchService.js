const dotenv = require("dotenv");
dotenv.config();

class BookSearchService {
  async search(query) {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch from Google Books API");
      }
      const data = await response.json();
      
      if (!data.items) return [];

      return data.items.map(item => {
        const info = item.volumeInfo;
        // Find ISBN_13 if available, otherwise ISBN_10
        const isbn13 = info.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier;
        const isbn10 = info.industryIdentifiers?.find(id => id.type === "ISBN_10")?.identifier;
        
        return {
          title: info.title || "",
          author: info.authors ? info.authors.join(", ") : "Unknown Author",
          isbn: isbn13 || isbn10 || "",
          description: info.description || "",
          thumbnail: info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "",
          previewLink: info.previewLink || info.infoLink || "",
          categories: info.categories || [],
          pageCount: info.pageCount || 0,
        };
      });
    } catch (error) {
      console.error("Google Books Search Error:", error);
      throw error;
    }
  }

  async searchFreeBooks(subject = "fiction") {
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(subject)}&filter=free-ebooks&maxResults=8`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Google Books API Error [${response.status}]:`, errorText);
        return []; // Gracefully fail if rate limited
      }
      const data = await response.json();
      if (!data.items) return [];

      return data.items.map(item => {
        const info = item.volumeInfo;
        return {
          id: item.id,
          title: info.title || "",
          author: info.authors ? info.authors.join(", ") : "Unknown Author",
          thumbnail: info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "",
          previewLink: info.previewLink || info.infoLink || "",
          description: info.description || "",
          rating: info.averageRating || 0,
        };
      });
    } catch (error) {
      console.error("Google Books Free Search Error:", error);
      throw error;
    }
  }
}

module.exports = new BookSearchService();
