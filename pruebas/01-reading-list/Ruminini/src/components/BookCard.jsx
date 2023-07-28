import './BookCard.css'

const BookCard = ({book, ...props}) => {
    return (
        <div {...props} className='bookCard'>
            <img
                className='bookCover'
                src={book.cover}
                alt={book.title} />
        </div>
    )
}

export {BookCard};