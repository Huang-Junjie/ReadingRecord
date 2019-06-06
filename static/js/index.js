var vm = new Vue({
    el: '#app',
    data: {
        books: [
            {
                name: "Vue.js实战",
                author: "梁灏",
                startDate: "2019/1/1",
                deadlineDate: "2019/2/1",
                progress: [50,50,50,50,100,50],
                totalPages: 400,
                finishedPages: 350
            },
            {
                name: "Bootstrap基础教程",
                author: "张松慧",
                startDate: "2019/2/1",
                deadlineDate: "2019/3/1",
                progress: [100,50,100],
                totalPages: 300,
                finishedPages: 250
            },
            {
                name: "深入浅出nodejs",
                author: "朴灵",
                startDate: "2019/3/1",
                deadlineDate: "2019/4/1",
                progress: [10,20,30],
                totalPages: 400,
                finishedPages: 60
            }


        ],
        trash: [

        ],
        finishedBooks: [

        ],
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
    methods: {
        clear() {
            this.bookName = "";
            this.bookAuthor = "";
            this.bookPages = "";
            this.deadline = "";
        },
        add() {
            if (this.bookPages > 0) {
                var now = new Date();
                this.books.push({
                    name: this.bookName,
                    author: this.bookAuthor,
                    startDate: now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate(),
                    deadlineDate: this.deadline,
                    progress: [],
                    totalPages: this.bookPages,
                    finishedPages: 0
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