const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

const async = require('async');

exports.index = function(req, res) {
    async.parallel({
      book_count: function(callback) {
        Book.count({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      book_instance_count: function(callback) {
        BookInstance.count({}, callback);
      },
      book_instance_available_count: function(callback) {
        BookInstance.count({status:'Available'}, callback);
      },
      author_count: function(callback) {
        Author.count({}, callback);
      },
      genre_count: function(callback) {
        Genre.count({}, callback);
      }
    }, function(err, results) {
      res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};

// Display list of all Books.
exports.book_list = function(req, res, next) {
    Book.find({}, 'title author')
      .populate('author')
      .exec(function (err, list_books) {
        if (err) {
          return next(err);
        }
        res.render('book_list', {title: 'Book List', book_list: list_books})
      });
};

// Display detail page for a specific Book.
exports.book_detail = function(req, res, next) {
    async.parallel({
      book: function(callback) {
        Book.findById(req.params.id)
          .populate('author')
          .populate('genre')
          .exec(callback);
      },
      book_instance: function(callback) {
        BookInstance.find({'book': req.params.id})
          .exec(callback);
      }
    }, function(err, results) {
      if (err) { return next(err); }
      if (results.book == null) {
        let err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }

      res.render('book_detail', { title: results.book.title, book: results.book, book_instances: results.book_instance })
    });
};

// Display Book create form on GET.
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle Book create on POST.
exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

// Display Book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle Book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display Book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle Book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};
