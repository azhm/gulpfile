$(function () {
    var _tap = ("ontouchstart" in window) ? "tap" : "click";
    new mo.Landscape();
    new mo.PCPrompt({
        url: '',
        title: '',
        description: ' ',
        preview: '',
        prefix: 'pc',
        jump: function () {
            alert('请用移动端扫一扫二维码，进行浏览。');
            $("#pc_jump").hide();
        }
    });

    //tp.tongji(");

});
