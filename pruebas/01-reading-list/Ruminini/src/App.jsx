import { useEffect, useState, useMemo } from "react";
import "./App.css";
import Library from "./books.json";
import { BookCard } from "./components/BookCard";
import MultiRangeSlider from "./components/MultiRangeSlider";

function App() {
  const [library, setLibrary] = useState(Library.library.map((item) => item.book));
  const [wishlistedISBNs, setWishlistedISBNs] = useState([]);
  const [pageRange, setPageRange] = useState({ min: 0, max: 999 });
  const [genre, setGenre] = useState('All');

  const maxPages = useMemo(() => {
    return Math.max(...library.map((book) => book.pages));
  }, []);

  const getGenresQuantities = () => {
    const genresQuantities = {};
    library.map(book =>  genresQuantities[book.genre] = isInPageRange(book) && !isWishlisted(book) ?  1 + (genresQuantities[book.genre] || 0):0)
    return genresQuantities
  }

  const getGenres = () => {
    const genresQuantities = getGenresQuantities();
    return Object.keys(genresQuantities).map((g, id) => (<option value={g} disabled={genresQuantities[g]==0} key={id}>{`${g} (${genresQuantities[g]})`}</option>))
  }

  const toggleWishlisted = (book) => {
    const index = wishlistedISBNs.indexOf(book.ISBN);
    if (index === -1) {
      setWishlistedISBNs([...wishlistedISBNs, book.ISBN]);
    } else {
      setWishlistedISBNs(wishlistedISBNs.filter((ISBN) => ISBN != book.ISBN));
    }
  };

  const isInPageRange = (book) => {
    return book.pages >= pageRange.min && book.pages <= pageRange.max;
  };

  const isWishlisted = (book) => {
    return wishlistedISBNs.includes(book.ISBN);
  }

  const matchesGenre = (book) => {
    return genre!='All' && book.genre != genre;
  }

  const isHidden = (book) => {
    if (isWishlisted(book)) return false;
    if (!isInPageRange(book)) return true;
    if (matchesGenre(book)) return true;
    return false;
  };

  const getBooks = (wishlisted) => {
    return library.map(
      (book) =>
        book && isWishlisted(book) == wishlisted && (
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
        <section className="availableBooks">{getBooks(false)}</section>
        <aside>
          lista libros elejidos
          {getBooks(true)}
        </aside>
      </main>
    </>
  );
}
export default App;
