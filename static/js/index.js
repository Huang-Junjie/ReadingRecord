var vm = new Vue({
    el: '#app',
    data: {
        books: [],

        trash: [],

        finishedBooks: [],

        colorClass: [
            "",
            "progress-bar-success",
            "progress-bar-info",
            "progress-bar-warning",
            "progress-bar-danger",
        ],

        search: "",
        showType: "books",

        bookName: "",
        bookAuthor: "",
        bookPages: "",
        deadline: "",

        todayFinish: "",

        selectedBook: {},
        selectedBookIndex: 0
    },

    mounted() {
        $.ajax({
            type: "GET",
            url: "/getList",
            success: (data, textStatus, jqXHR) => {
                console.log(data, textStatus, jqXHR);
                if (jqXHR.status == 200) {
                    this.books = data.readingList;
                    this.trash = data.trashList;
                    this.finishedBooks = data.finishedList;
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR, textStatus, errorThrown);
            },
        });

       
    },

    methods: {
        clear() {
            this.bookName = "";
            this.bookAuthor = "";
            this.bookPages = "";
            this.deadline = "";
        },

        add() {
            if (this.bookPages > 0 && this.bookName) {
                var now = new Date();
                var newBook = {
                    name: this.bookName,
                    author: this.bookAuthor,
                    startDate: now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate(),
                    deadlineDate: this.deadline,
                    progress: [],
                    totalPages: this.bookPages,
                    finishedPages: 0,
                    inTrash: false,
                    isFinished: false
                };

                $.ajax({
                    type: "POST",
                    url: "/addBook",
                    data: JSON.stringify(newBook),
                    contentType:"application/json;charset=utf-8",
                    success: (data, textStatus, jqXHR) => {
                        console.log(data, textStatus, jqXHR);
                        if (jqXHR.status == 200) this.books.push(data);
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        console.log(jqXHR, textStatus, errorThrown);
                    },
                });
            }

            this.clear();
            this.showType = 'books';
        },

        deleteBook(i) {
            if (this.showType == 'trash') {
                $.ajax({
                    type: "GET",
                    url: "/deleteBook/?id=" + this.showBooks[i]._id,
                    success: (data, textStatus, jqXHR) => {
                        console.log(data, textStatus, jqXHR);
                        if (jqXHR.status == 200) {
                            let index = this[this.showType].findIndex(book => book._id == this.showBooks[i]._id);
                            this[this.showType].splice(index, 1);
                        }
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        console.log(jqXHR, textStatus, errorThrown);
                    },
                });
            }
            else {
                $.ajax({
                    type: "GET",
                    url: "/trashBook/?id=" + this.showBooks[i]._id,
                    success: (data, textStatus, jqXHR) => {
                        console.log(data, textStatus, jqXHR);
                        if (jqXHR.status == 200) {
                            this.trash.push(this.showBooks[i]);
                            let index = this[this.showType].findIndex(book => book._id == this.showBooks[i]._id);
                            this[this.showType].splice(index, 1);
                        }
                    },
                    error: (jqXHR, textStatus, errorThrown) => {
                        console.log(jqXHR, textStatus, errorThrown);
                    },
                });
            }
        },

        addProgress() {
            if (this.todayFinish != "" &&
                this.todayFinish > this.selectedBook.finishedPages &&
                this.todayFinish <= this.selectedBook.totalPages) {
                this.selectedBook.progress.push(this.todayFinish-this.selectedBook.finishedPages);
                this.selectedBook.finishedPages = this.todayFinish;
            }
            this.todayFinish = "";
            if (this.selectedBook.finishedPages == this.selectedBook.totalPages) {
                this.finishedBooks.push(this.books[this.selectedBookIndex]);
                this.books.splice(this.selectedBookIndex, 1);
            }
        }
    },
    computed: {
        showBooks: function () {
            _this = this;
            return this[this.showType].filter(function (book) {
                return book.name.toLowerCase().includes(_this.search.toLowerCase()) ||
                    book.author.toLowerCase().includes(_this.search.toLowerCase()) ||
                    book.startDate.toLowerCase().includes(_this.search.toLowerCase()) ||
                    book.deadlineDate.toLowerCase().includes(_this.search.toLowerCase());
            });
        }
    }
});