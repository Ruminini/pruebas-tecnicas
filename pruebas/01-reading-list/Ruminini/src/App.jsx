import { useEffect, useState, useMemo } from "react";
import "./App.css";
import Library from "./books.json";
import { BookCard } from "./components/BookCard";
import MultiRangeSlider from "./components/MultiRangeSlider";

function App() {
  const [available, setAvailable] = useState(
    Library.library.map((item) => item.book)
  );
  const [wishlisted, setWishlisted] = useState([]);
  const [pageRange, setPageRange] = useState({ min: 0, max: 999 });
  const [genre, setGenre] = useState(null);

  const maxPages = useMemo(() => {
    return Math.max(...available.map((book) => book.pages));
  }, []);

  const genresNames = useMemo(() => {
    return available.map((book) => book.genre );
  }, []);

  console.log(genresNames)

  const genres = {};
  useEffect(() => {
    available.map(book => genres[book.genre] =  inPageRange(book.pages) ? 1 : 0 + genres[book.genre] || 0)
    console.log(genres)
    Object.keys(genres).map((b) => { console.log(b) })
  }, [pageRange]);

  const toggleWishlisted = (book) => {
    const index = wishlisted.indexOf(book);
    if (index === -1) {
      setWishlisted([...wishlisted, book]);
      setAvailable(available.filter((b) => b.ISBN != book.ISBN));
    } else {
      setWishlisted(wishlisted.filter((b) => b.ISBN != book.ISBN));
      setAvailable([...available, book]);
    }
  };

  const inPageRange = (pages) => {
    return pages >= pageRange.min && pages <= pageRange.max;
  };

  const isHidden = (book) => {
    if (wishlisted.includes(book)) return false;
    if (!inPageRange(book.pages)) return true;
    if (genre && book.genre != genre) return true;
    return false;
  };

  const getBooks = (library) => {
    if (!library) return;
    return library.map(
      (book) =>
        book && (
          <BookCard
            key={book.ISBN}
            hidden={isHidden(book)}
            onClick={() => toggleWishlisted(book)}
            book={book}
          />
        )
    );
  };

  return (
    <>
      <header>
        <p>Filtros</p>

        <MultiRangeSlider
          min={0}
          max={maxPages}
          onChange={({ min, max }) => {
            setPageRange({ min, max });
          }}
        />
        <select id="genres">
          {console.log("------")}
          {console.log(genres)}
          {console.log(Object.keys(genres))}
          {
          Object.keys(genres).map((b) => { console.log(b) })
          }
          {Object.keys(genres).map((key, i) =>
            <option key={i} value={key}>{`${key} (${genres[key]})`}</option>
          )}
          {console.log("------")}
          <option value={null}>All</option>
          {/* <option value={genres.key(0)}>{genres[genres.key(0)]}</option>
          <option value={genres.key(1)}>{genres[genres.key(1)]}</option>
          <option value={genres.key(2)}>{genres[genres.key(2)]}</option>
          <option value={genres.key(3)}>{genres[genres.key(3)]}</option> */}
          {
            // Object.entries(genres).map( ([k, v]) => <option key={k} value={k}>{`${k} (${v})`}</option> )
          }
          
        </select>
      </header>
      <main>
        <section className="availableBooks">{getBooks(available)}</section>
        <aside>
          lista libros elejidos
          {getBooks(wishlisted)}
        </aside>
      </main>
    </>
  );
}
export default App;
