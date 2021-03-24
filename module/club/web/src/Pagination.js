/**
 * @copyright Copyright (c)2021 Maxim Khorin <maksimovichu@gmail.com>
 */
Club.Pagination = class Pagination {

    constructor (list) {
        this.list = list;
        this.page = 0;
        this.pageSize = 10;
        this.list.on('click', '.pagination [data-action="first"]', this.onFirst.bind(this));
        this.list.on('click', '.pagination [data-action="prev"]', this.onPrev.bind(this));
        this.list.on('click', '.pagination [data-action="next"]', this.onNext.bind(this));
        this.list.on('click', '.pagination [data-action="last"]', this.onLast.bind(this));
        this.list.on('click', '.pagination [data-page]', this.onPage.bind(this));
    }

    isValidPage (page) {
        return Number.isInteger(page) && page >= 0 && page < this.numPages;
    }

    getOffset () {
        return this.page * this.pageSize;
    }

    getPageSize () {
        return this.pageSize;
    }

    onFirst (event) {
        event.preventDefault();
        this.setPage(0);
    }

    onPrev (event) {
        event.preventDefault();
        this.setPage(this.page - 1);
    }

    onLast (event) {
        event.preventDefault();
        this.setPage(this.numPages - 1);
    }

    onNext (event) {
        event.preventDefault();
        this.setPage(this.page + 1);
    }

    onPage (event) {
        event.preventDefault();
        this.setPage(event.target.dataset.page);
    }

    setPage (page) {
        page = Number(page);
        if (page !== this.page && this.isValidPage(page)) {
            this.page = page;
            this.list.trigger('change:pagination', {page});
        }
    }

    setTotal (total) {
        total = Number.isInteger(total) ? total : 0;
        this.numPages = Math.ceil(total / this.pageSize);
    }

    render () {
        if (this.numPages < 2) {
            return '';
        }
        const pages = this.renderPages();
        return this.list.resolveTemplate('pagination', {pages});
    }

    renderPages () {
        const result = [];
        for (let page = 0; page < this.numPages; ++page) {
            const active = page === this.page ? 'active' : '';
            const text = page + 1;
            result.push(this.list.resolveTemplate('page', {active, page, text}));
        }
        return result.join('');
    }
};