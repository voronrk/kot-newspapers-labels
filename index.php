<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/bulma.min.css">
    <script src=js/script.js?<?=time()?> defer type="module"></script>
    <script lang="javascript" src="js/xlsx.full.min.js"></script>
    <title>Печать газетных ярлыков</title>
</head>
<body>
    <div class="container py-6">
        <div class="box">
            <div class="title is-size-5">Загрузка разнарядки</div>
            <div id="load" class="field is-grouped"></div>
        </div>

        <div class="box is-hidden" id="labels-wrapper">
            <div class="title is-size-5">Печать ярлыков</div>

            <div class="field">
                <label class="label">Заказчик</label>
                <div class="select">
                    <select id="select-customer" ></select>
                </div>
            </div>

            <form class="form mt-4" id="label-form">
                <div class="field is-grouped">
                    <div class="field">
                        <label class="label">Издание</label>
                        <div class="select">
                            <select id="select-title" name="title"></select>
                        </div>
                        <p class="help is-danger is-hidden" id="title-warning">Заполните поле</p>
                    </div>
                    <div class="field ml-4">
                        <label class="label">Номер</label>
                        <input name="num" class="input" type="text" placeholder="Номер">
                        <p class="help is-danger is-hidden" id="num-warning">Заполните поле</p>
                    </div>
                    <div class="field ml-4">
                        <label class="label">Дата выхода</label>
                        <input name="date" class="input" type="date" placeholder="Дата">
                        <p class="help is-danger is-hidden" id="date-warning">Заполните поле</p>
                    </div>
                    <div class="field ml-4">
                        <label class="label">Тираж</label>
                        <input name="count" class="input" type="number" placeholder="Тираж">
                        <p class="help is-danger is-hidden" id="count-warning">Заполните поле</p>
                    </div>
                    <div class="field ml-4">
                        <label class="label">Номер заказа</label>
                        <input name="ordernum" class="input" type="string" placeholder="Номер заказа">
                        <p class="help is-danger is-hidden" id="ordernum-warning">Заполните поле</p>
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="field ml-4">
                        <label class="label">Формат</label>
                        <div class="control">
                            <label class="radio">
                                <input type="radio" name="size" value="A4">
                                А4
                            </label>
                            <label class="radio">
                                <input type="radio" name="size" value="A6">
                                А6
                            </label>
                        </div>
                        <p class="help is-danger is-hidden" id="size-warning">Заполните поле</p>
                    </div>
                    <div class="field ml-4">
                        <label class="label">Количество в пачке</label>
                        <input name="countpack" class="input" type="number" placeholder="В пачке" value="200" step=50>
                        <p class="help is-danger is-hidden" id="count-pack-warning">Заполните поле</p>
                    </div>
                </div>
                <button type="submit" class="button is-primary" id="button-print">Печатать</button>        
            </form>
        </div>
    </div>
</body>
</html>
