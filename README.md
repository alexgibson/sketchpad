jQuery-sketchpad
===

Multi-touch sketchpad for canvas line drawing based on the [fine work of Alex Gibson](https://github.com/alexgibson/sketchpad). It's incredibly simple to use, as documented below.

## Initialization
To initialize the sketchpad, use 
```
pad = $('#your-element').sketchpad({ //options });
pad.init();
```

preferably before the `</body>` tag, after including jQuery and the other dependencies (underscore and shake).

## Options
jQuery-sketchpad can be extended using the following options:

```
{
  colors: {
    r: 0, //red stroke
    g: 0, //green stroke
    b: 0, //blue stroke
    a: 1 //alpha/opacity
  },
  size: 10, //brush/pencil size
}
```

### Changing options in real-time
The reason I decided to create this plugin was because I wanted to create something similar to MS Paint on my company's website. This includes changing colors and brush-size on the fly. To change options on the fly, this plugin has two methods:

#### Changing the color

`pad.changeColor(r, g, b, a);` changes the color on the fly and accepts the desired red, green, blue, and alpha values just like a CSS query.

`pad.changeSize(newSize, add);` changes the brush size on the fly. It accepts two parameters:

* `newSize` is... the new size. Could be 10, 20, whatever.
* `add` is a boolean value. If it's true, it increases (or decreases) the existing `size` by `newSize`. By default, it just changes the `size` of the stroke to `newSize`.

I hope this is useful for the community!