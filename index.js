import {define, createExtWebComponent} from 'doz'
import cmp from './src'

// expose component to global scope
function register() {
    if (typeof window !== 'undefined') {
        define('doz-simple-slideshow', cmp);
        createExtWebComponent('doz-simple-slideshow');
    }
}

register();

export default cmp

if (module.hot) {
    module.hot.dispose(function () {
        register();
    })
}