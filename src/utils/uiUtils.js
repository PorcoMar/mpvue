export function animation({
    type = "frame",
    //文件地址
    files = [],
    //上下文环境
    context,
    //限制次数
    limit = -1,
    //动画结束
    end,
    //每次动画完
    update,
    data = [],
    canvas,
    fps = 33
}) {
    switch (type) {
        case "sprite":
            return _startSpriteAnimation({
                context,
                data,
                files,
                limit,
                end,
                update,
                fps,
                canvas
            });
        //img序列帧
        case "frame":
            return _startFrameAnimation({
                context,
                data,
                files,
                limit,
                end,
                update,
                fps
            });
        default:
            console.log("不支持的动画方式");
    }

    function _startFrameAnimation({
        context,
        data,
        files,
        limit = -1,
        end,
        update,
        fps
    }) {
        if (typeof fps !== "number") {
            fps = 33;
        }
        let begin = -1;
        //动画次数
        let time = 0;

        let fn = () => {
            begin++;
            if (begin > files.length - 1) {
                begin = 0;
                time++;
                //每次动画全部跑完
                typeof update == "function" && update.call(context);
                if (limit != -1 && time == limit) {
                    clearInterval(timer);
                    typeof end == "function" && end.call(context);
                }
            }
            data.forEach(e => {
                if (e in context) {
                    context[e] = files[begin];
                }
            });
        };

        let timer = setInterval(fn, 1000 / fps);
        let animationObj = new AnimationOperation(timer, fn, fps);
        allAnimationOperation.push(animationObj);
        return animationObj;
    }

    function _startSpriteAnimation({
        context,
        data,
        files,
        limit = -1,
        end,
        update,
        canvas,
        fps
    }) {
        if (typeof fps !== "number") {
            fps = 33;
        }
        let { width, height, length, ctx } = canvas;
        let begin = -1;
        //动画次数
        let time = 0;
        let position = 0;
        let allWidth = width * length;
        let fn = () => {
            begin++;
            if (begin > length - 1) {
                begin = 0;
                time++;
                //每次动画全部跑完
                typeof update == "function" && update.call(context);
                if (limit != -1 && time == limit) {
                    clearInterval(timer);
                    typeof end == "function" && end.call(context);
                }
            }
            position = -width * begin;
            ctx.drawImage(
                files[0],
                0,
                0,
                allWidth,
                height,
                position,
                0,
                allWidth,
                height
            );
            ctx.draw();
        };
        let timer = setInterval(fn, 1000 / fps);
        let animationObj = new AnimationOperation(timer, fn, fps);
        allAnimationOperation.push(animationObj);
        return animationObj;
    }
}