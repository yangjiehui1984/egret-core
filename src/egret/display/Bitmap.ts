/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../context/renderer/RendererContext.ts"/>
/// <reference path="../core/Logger.ts"/>
/// <reference path="../core/RenderFilter.ts"/>
/// <reference path="DisplayObject.ts"/>
/// <reference path="SpriteSheet.ts"/>
/// <reference path="../geom/Rectangle.ts"/>
/// <reference path="../texture/Texture.ts"/>

module ns_egret {
    export class Bitmap extends DisplayObject {

        /**
         * 全部Bitmap是否开启DEBUG模式
         * @stable B 这个API以后可能会被移动到一个单独的负责各种DEBUG参数的枚举类中
         */
        public static debug:boolean = false;


        /**
         * 单个Bitmap是否开启DEBUG模式
         * @stable B 这个API以后可能会被移动到一个单独的负责各种DEBUG参数的枚举类中
         */
        public debug:boolean = false;

        /**
         * debug边框颜色，默认值为红色
         */
        public debugColor:number = 0xff0000;

        /**
         * 渲染采用的SpriteFrame，用来渲染纹理中的一部分
         */
        public spriteFrame:ns_egret.SpriteSheetFrame;

        /**
         * 渲染纹理
         */
        public texture:Texture;


        /**
         * 这个API是cocos2d-x风格的，和egret设计思路不统一，会最快时间内删除
         * @stable D
         * @param texture
         * @returns {Bitmap}
         */
        public static initWithTexture(texture:Texture):Bitmap {
            if (texture == null) {
                throw new Error("texture 取不到 ");
            }
            var ret:Bitmap = new Bitmap();
            ret.texture = texture;
            return ret;
        }

        constructor() {
            super();
        }

        /**
         * @see egret.DisplayObject.render
         * @param renderContext
         */
            render(renderContext:RendererContext) {

            var locTexture = this.texture;
            if (locTexture == null) {
                return;
            }
            this._texture_to_render = locTexture;
            var x, y, w, h, offsetX, offsetY;
            if (this.spriteFrame) {
                var rect:ns_egret.SpriteSheetFrame = this.spriteFrame;
                x = rect.x;
                y = rect.y;
                w = rect.w;
                h = rect.h;
                offsetX = rect.offX;
                offsetY = rect.offY;
            }
            else {
                x = 0;
                y = 0;
                w = locTexture._textureWidth;
                h = locTexture._textureHeight;
                offsetX = 0;
                offsetY = 0;
            }

            RenderFilter.getInstance().drawImage(renderContext, this, x, y, w, h, offsetX, offsetY, w, h);
        }

        /**
         * @see egret.DisplayObject.measureBounds
         * @returns {Rectangle}
         * @private
         */
            _measureBounds():ns_egret.Rectangle {
            var rect:ns_egret.SpriteSheetFrame = this.spriteFrame;
            var w, h;
            if (rect) {
                w = rect.w;
                h = rect.h;
            }
            else if (this.texture) {
                w = this.texture._textureWidth;
                h = this.texture._textureHeight;
            }
            else {
                ns_egret.Logger.fatal("获取BitmapBounds失败");
            }
            var anchorX, anchorY;
            if (this._anchorX != 0 || this._anchorY != 0) {
                anchorX = w * this._anchorX;
                anchorY = h * this._anchorY;
            }
            else {
                anchorX = this._anchorOffsetX;
                anchorY = this._anchorOffsetY;
            }
            return Rectangle.identity.initialize(-anchorX, -anchorY, w, h);
        }
    }
}