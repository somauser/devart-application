// const Masonry = require('masonry-layout')
window.onload = () => {
    const grid = document.querySelector('.grid');
    const masonry = new Masonry(grid, {
        itemSelector: '.grid-item',
        // columnWidth: 230,
        fitWidth:true,
    });
    const masonry2 = new Masonry(grid, {
        itemSelector: '.grid-item-show',
        fitWidth:true,
    });
}
