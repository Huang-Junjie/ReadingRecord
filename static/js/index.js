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
        bookName: "",
        bookAuthor: "",
        bookPages: "",
        deadline: "",
        showType: "books",
        selectedBook: {},
        selectedBookIndex: 0,
        todayFinish: ""
    },

    mounted() {
        $.ajax({
            type: "GET",
            url: "/getList",
            success: (data, textStatus, jqXHR) => {
                console.log(data, textStatus, jqXHR);
                if (jqXHR.status == 200) this.books = data;
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
                    inTrash: false
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
                this.trash.splice(i, 1);
            }
            else {
                this.trash.push(this[this.showType][i]);
                this[this.showType].splice(i, 1);
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