# doz-simple-slideshow
A simple slideshow for Doz.

## Install
```
npm install doz-simple-slideshow
```

Live <a href="https://fabioricali.github.io/doz-simple-slideshow/build/index.html">here</a>

### Example
```javascript
new Doz({
root: '#app',
props: {
    images: [
        '<img src="https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260">',
        '<img src="https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260">',
        '<img src="https://images.pexels.com/photos/34950/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260">',
    ]
},
template(h) {
    return h`
        <doz-simple-slideshow items="${this.slideSerialize(this.props.images)}"/>
    `
}
});
```

## Props
| Name | Default | Description |
| ---- | ------- | ----------- |
| items |  | Items that must rotate |
| delay | 5s  | Animation delay between items |
| duration | 1s  | Animation duration |
| state | running  | Can be running or paused |


#### CDN unpkg
```html
<script src="https://unpkg.com/doz-simple-slideshow/build/bundle.min.js"></script>
```

## Changelog
You can view the changelog <a target="_blank" href="https://github.com/fabioricali/doz-simple-slideshow/blob/master/CHANGELOG.md">here</a>

## License
doz-simple-slideshow is open-sourced software licensed under the <a target="_blank" href="http://opensource.org/licenses/MIT">MIT license</a>

## Author
<a target="_blank" href="http://rica.li">Fabio Ricali</a>