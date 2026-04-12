const axios = require('axios');
async function test() {
  try {
    const res = await axios.get('http://localhost:5000/api/books');
    const book = res.data[0];
    console.log("Book to edit:", book.id);
    const updateRes = await axios.put(`http://localhost:5000/api/books/${book.id}`, {
      title: book.title + " test",
      author: book.author,
      isbn: book.isbn,
      categoryId: book.categoryId,
      description: book.description,
      totalCopies: 5,
      availableCopies: 5
    });
    console.log("Update success:", updateRes.data);
  } catch(e) {
    console.error("Update failed:", e.response ? e.response.data : e.message);
  }
}
test();
