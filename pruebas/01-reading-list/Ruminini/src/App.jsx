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
  const [genre, setGenre] = useState('All');

  const maxPages = useMemo(() => {
    return Math.max(...available.map((book) => book.pages));
  }, []);

  const genresNames = useMemo(() => {
    return available.map((book) => book.genre );
  }, []);

  const getGenresQuantities = () => {
    const genresQuantities = {};
    genresNames.map(name => genresQuantities[name] = 0);
    available.map(book => inPageRange(book.pages) ? genresQuantities[book.genre] = 1 + genresQuantities[book.genre]: 0)
    return genresQuantities
  }

  const getGenres = () => {
    const genresQuantities = getGenresQuantities();
    return Object.keys(genresQuantities).map((g, id) => (<option value={g} disabled={genresQuantities[g]==0} key={id}>{`${g} (${genresQuantities[g]})`}</option>))
  }

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
    if (genre!='All' && book.genre != genre) return true;
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
        <select id="genres" value={genre} onChange={e => setGenre(e.target.value)}>
          <option value='All'>Todas</option>
          {getGenres()}
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
