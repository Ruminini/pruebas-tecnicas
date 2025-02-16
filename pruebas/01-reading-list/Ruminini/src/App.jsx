import { useEffect, useState, useMemo } from "react";
import "./App.css";
import Library from "./books.json";
import { BookCard } from "./components/BookCard";
import MultiRangeSlider from "./components/MultiRangeSlider";

function App() {
  const [library, setLibrary] = useState(Library.library.map((item) => item.book));
  const [wishlistedISBNs, setWishlistedISBNs] = useState(() => {
    const savedWishlist = window.localStorage.getItem('wishlistedISBNs');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [pageRange, setPageRange] = useState({ min: 0, max: 999 });
  const [genre, setGenre] = useState('All');

  const maxPages = useMemo(() => {
    return Math.ceil(Math.max(...library.map((book) => book.pages))/250)*250;
  }, []);

  const getGenresQuantities = () => {
    const genresQuantities = {};
    library.map(book =>  genresQuantities[book.genre] = 0)
    library.map(book =>  (isInPageRange(book) && !isWishlisted(book)) && genresQuantities[book.genre]++)
    return genresQuantities
  }

  const getGenres = () => {
    const genresQuantities = getGenresQuantities();
    const sortedKeys = Object.keys(genresQuantities).sort((a,b) => {return genresQuantities[b]-genresQuantities[a]})
    return sortedKeys.map((g, id) => (<option value={g} disabled={genresQuantities[g]==0} key={id}>{`${g} (${genresQuantities[g]})`}</option>))
  }

  const toggleWishlisted = (book) => {
    const index = wishlistedISBNs.indexOf(book.ISBN);
    let newWishlist = [];
    if (index === -1) {
      newWishlist = [...wishlistedISBNs, book.ISBN];
    } else {
      newWishlist = wishlistedISBNs.filter((ISBN) => ISBN != book.ISBN);
    }
    setWishlistedISBNs(newWishlist);
    window.localStorage.setItem('wishlistedISBNs',JSON.stringify(newWishlist));
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
        <h1>9 libros disponibles</h1>
        <h4>2 en la lista de lectura</h4>
        <section id='filters'>
          <div>
            <h4>Filtrar por Paginas:</h4>
            <MultiRangeSlider
              id='pages_filter'
              min={0}
              max={maxPages}
              onChange={({ min, max }) => {
                setPageRange({ min, max });
              }}
            />
          </div>
          <div>
            <h4>Filtrar por Genero:</h4>
            <select id="genres_filter" value={genre} onChange={e => setGenre(e.target.value)}>
              <option value='All'>Todos</option>
              {getGenres()}
            </select>
          </div>
        </section>
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
