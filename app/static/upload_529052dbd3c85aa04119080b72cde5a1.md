## CSS样式初始化

### mixin.scss

```scss
//背景图片
@mixin bg-image($url) {
  background-image: url($url + "@2x.png");
  @media (-webkit-min-device-pixel-ratio:3),(min-device-pixel-ratio:3) {
    background-image: url($url + "@3x.png");
  }
}

//单行文本
@mixin no-wrap {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

//扩展点击区域
@mixin extend-click() {
  position: relative;
  &:before{
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
  }
}
```



### reset.scss

```scss
//重置默认样式
* { -webkit-tap-highlight-color: transparent; outline: 0; margin: 0; padding: 0; vertical-align: baseline; }
body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td { margin: 0; padding: 0; vertical-align: baseline; }
img { border: 0 none; vertical-align: top; }
i, em { font-style: normal; }
ol, ul { list-style: none; }
input, select, button, h1, h2, h3, h4, h5, h6 { font-size: 100%; font-family: inherit; }
table { border-collapse: collapse; border-spacing: 0; }
a { text-decoration: none; color: #666; }
body { margin: 0 auto; min-width: 320px; max-width: 640px; height: 100%; font-size: 14px; font-family: -apple-system,Helvetica,sans-serif; line-height: 1.5; color: #666; -webkit-text-size-adjust: 100% !important; text-size-adjust: 100% !important; }
input[type="text"], textarea { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
```



### variable.scss

```scss
//颜色和字体设置
$color-background:#222;
$color-background-d:rgba(0, 0, 0, .3);
$color-highlight-background:#333;
$color-dialog-background:#666;
$color-theme:#ffcd32;
$color-theme-d:rgba(255,204,49,.5);
$color-sub-theme:#d93f30;
$color-text:#fff;
$color-text-d:rgba(255,255,255,.3);
$color-text-l:rgba(255,255,255,.5);
$color-text-ll:rgba(255,255,255,.8);

$font-size-small-s:10px;
$font-size-small:12px;
$font-size-medium:14px;
$font-size-small-x:16px;
$font-size-large:18px;
$font-size-large-x:22px;
```



