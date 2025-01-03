# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Описание проекта

При проектировании данного приложения использовался событийно-ориентрованный подход и паттерн проектирования MVP.

Модели данных представленный 3 классами с данными карточек, пользователя, корзины.

Классы отображения, выводящие пользовательский интерфейс, обозначеныи припиской UI в названии класса. А так же к ним относятся два абстракных класса Component и Form, помогающие с заполнием шаблонов и форм.

Работа презентера (отлавливание событий и выполнение последующих действий) реализована а файле "/srs/index.ts".

Брокер событий реализован классом EventEmitter.

Вся работа приложения построена на генерации событий в блоке представления, затем в последующем их отлавливании и обработке в презентере, а потом в зависимости от собития, прозводстве манипуляций с моделями данных. Откуда в последствии  генеририруются новые события, отлавливаются и обрабатываются в презентере, после чего происходит перерисовака представления в зависимости от события.

## UML схема проекта

![Image alt](/src/images/UMLscheme.jpg)

## Описание данных

Тип CardItem содержит данные одной карточки товара приходящие с сервера такие как id, описание, картинка товара, название, категория товара и цена. Все даныне типизированы в string, кроме цены - number.

Интерфейс ICardsData описывает массив карточек с данными типа CardItem.

Тип PaymentMethod может быть либо 'offline' либо 'online' для отправки выбранного метода оплаты из формы на сервер.

Интерфейс IOrderForm содержит данные из формы оплыты, вводимые пользователем. Это метод оплаты с типом PaymentMethod, email, телефон и адрес, последние 3 с типом string.

Интерфейс IBasket содержит данные корзины. items - товары добавленные пользователем в корзину с стипом ICardItem[], это массив так как товаров несколько.

## Модели данных

Данные в данном приложении реализуются 3 классами - CardsData, basket и UserData.

class CardsData - реализует интерфейс ICardsData и создает массив по типу CardItem, в котом хрятся карточки товара с сервера. Данный класс может выдать полный список карточек из массива методом getCardList, а так же получить определенную карточку их массива по ее id  - getCard.

class basket реализует интерфейс IBasket и служит для добавления товаров в корзину (addInBasket), удаления их из нее (removeOutOfBasket), и очищение всей корзины (clearBasket). Тут же можно получить полный список товаров, находящихся на данный момент в корзине(getBasketList).

class UserData реализует интерфейс IOrderForm. Тут хранятся данные, введенные пользователем, из которых в последстви будет составлен post запрос на сервер. Здесь пользователь задает метод оплаты (set WayOfPayment), телефон (set PhoneNumber) и адрес (set Adress). Тут же можно очистить все данные (clearForm) или получить все данные пользователя (get AllUserData) в виде объекта по типу IAllUserData. Этот же объект можно валидировать с помощью метода isValid.

## Компоненты представления

Для удобства вся нискоуровнивая работа с обработкой Dom струкруты и ее наполнением выделено в абстакный класс Component. Данный класс является родительским для всех классов отображения.

Так как основными блоками представления являетя главный экран и модальные окна, для них написаны классы PageUI и ModalUI. 

Класс PageUI, овечает за отображение на главной странице приложения. Выводит список карточек с сервера и счетчик количества товаров в корзинке. Тут же реализован функционал блокировки прокрутки страници при окрытии модального окна.

Класс ModalUI, отвечает за открытие любого модального окна, их закрытие и перериросовку. Выводит внутри себя любой контент, получаемый как HTML-элемент. 

Так класс CardUI имеет в свойствах html компоненты каждого из свойств карточки: title, image, description, category, price. Свойство id передается как string так, как в отображении оно не нуждается, но нужно для добавление в корзину определенного товара. Тут же имеются сеттеры для каждого из свойств и гетер для id.

Класс BasketUI отвечает за наполнение модального окна корзины со свойствами: list - список товаров в корзине на данный момент, total - общая стоимость товаров в корзине, button - выводит состояние кнопки заказа. Тут же сеттеры для каждого из свойств.

Следующие 2 класса использует как основу абстракный класс Form в котором реализована работа с формами. Данный класс в свою очередь работает на основе Componnet. Как свойства класса тут submit - выводит состоянее кнопки для подтверждения данных, и errors - содержит описание ошибки при вврде в форму. Тут же есть сеттеры для каждого из свойств и метод перерисовки формы. А так же метод для производства события, регистрирующее изменение формы.

Два класса PurchaseUI и ContactsUI на основе Form (как говорилось ранее) состоят из сеттеров для ввода адреса доставки, метода оплаты и тефона, почты.

Логически финальный коласс CompliteOrderUI - выводит окно удачного размещения заказа на сервере и мееет только свойство close, в которм содержится кнопка, закрывающее модальное окно.

## Класс EventEmitter

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события. Класс имеет методы on , off ,  emit — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно. Дополнительно реализованы методы onAll и offAll — для подписки на все события и сброса всех подписчиков.

Интересным дополнением является метод trigger , генерирующий заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса EventEmitter.

## Описание событий

### События для модели данных

"items:changed" - сигнализирует у том, что количество товаров в корзине изменилось. В результатате чего корзинка должна быть перерисована и счетк товаров на главной странице.

"order:changed" - сигнализирует об изменении данных в форме, в следствии чего надинается их валидация

"order:valid" - сигнализирует о том, что данные пользователя соответсвуют требованиям валидации, вследсивии чего кнопка размещения заказа становится активна.

"order:completed" - данные отправлены, можно окрывать окно об оспешном заказе.

### События для отображения

"items:added" - добавление нового товара в корзинку, дополнительно к событию прилагается id товара. Результат - поиск товара в общем массиве по id и добавление его в корзину;

"items:removed" - удаление товара из корзинки, дополнительно к событию прилагается id товара. Результат - поиск товара в массиве корзины по id и удаление его из корзины;

"card:select" - сигнализирует о том. Что определенная карточка товара выбрана для просмотра, в результате чего, должно открыться модальное окно с этой карточкой. Вместе с событием передается id карточки для ее индефикации;

"formErrors:change" - изменилось состояние валидации формы. Результат - проверка всего набора данных из формы на валидность;

"/^order\..*:change/" - изменилось одно из полей формы. Результат - проверка нового набора данных на валидность;

"order.success" - сигнализирует о том, что  нажата кнопка размещения заказа;

"backet:open" - открыта корзина. Отрисовка модального окна корзины;

"order:open" - открыта форма заказа. Отрисовка модального окна Заказа;

"order:adress" - данные адресса доставки и метода оплаты, готовы к записи;

"order:submit" - сигнализирует о готовности всех данных к записи;

"modal:open" - блокировка прокрутки страницы;

"modal:close" - разблокировка прокрутки страницы.